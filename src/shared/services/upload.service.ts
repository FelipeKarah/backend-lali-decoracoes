// backend/src/shared/services/upload.service.ts
// Serviço reutilizável de upload de imagens.
// Salva os arquivos em /public/uploads/{entity} e retorna a URL pública.
// Uso: inject UploadService em qualquer módulo (kits, itens, complementos)

import { Injectable, BadRequestException } from '@nestjs/common'
import * as fs from 'fs'
import * as path from 'path'
import * as sharp from 'sharp'
import { v4 as uuid } from 'uuid'

// Entidades que usam upload — adicione novas aqui quando precisar
export type UploadEntity = 'kits' | 'itens' | 'complementos'

// Configuração por entidade
const UPLOAD_CONFIG: Record<
  UploadEntity,
  { maxFiles: number; maxSizeMb: number }
> = {
  kits: { maxFiles: 5, maxSizeMb: 5 },
  itens: { maxFiles: 3, maxSizeMb: 5 },
  complementos: { maxFiles: 2, maxSizeMb: 5 },
}

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]
const OUTPUT_FORMAT: keyof sharp.FormatEnum = 'webp' // converte tudo para webp (menor tamanho)
const OUTPUT_QUALITY = 82
const MAX_WIDTH = 1200 // redimensiona se maior que isso
const MAX_HEIGHT = 1200

@Injectable()
export class UploadService {
  /**
   * Faz upload de um ou mais arquivos para /public/uploads/{entity}/
   * Converte para WebP, redimensiona se necessário e retorna as URLs públicas.
   *
   * @param files    - Array de arquivos (Multer Express.Multer.File)
   * @param entity   - Pasta destino: 'kits' | 'itens' | 'complementos'
   * @returns        - Array de URLs públicas: ["/uploads/kits/abc123.webp"]
   */
  async uploadImages(
    files: Express.Multer.File[],
    entity: UploadEntity,
  ): Promise<string[]> {
    const config = UPLOAD_CONFIG[entity]

    if (!files || files.length === 0) {
      throw new BadRequestException('Nenhum arquivo enviado.')
    }

    if (files.length > config.maxFiles) {
      throw new BadRequestException(
        `Máximo de ${config.maxFiles} imagens para ${entity}.`,
      )
    }

    // Garante que o diretório existe
    const uploadDir = this.getUploadDir(entity)
    fs.mkdirSync(uploadDir, { recursive: true })

    const urls: string[] = []

    for (const file of files) {
      // Valida tipo MIME
      if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        throw new BadRequestException(
          `Tipo não permitido: ${file.mimetype}. Use JPEG, PNG ou WebP.`,
        )
      }

      // Valida tamanho
      const maxBytes = config.maxSizeMb * 1024 * 1024
      if (file.size > maxBytes) {
        throw new BadRequestException(
          `Arquivo muito grande. Máximo: ${config.maxSizeMb}MB.`,
        )
      }

      // Processa e salva
      const filename = `${uuid()}.${OUTPUT_FORMAT}`
      const filepath = path.join(uploadDir, filename)

      await sharp(file.buffer)
        .resize(MAX_WIDTH, MAX_HEIGHT, {
          fit: 'inside', // mantém proporção, não corta
          withoutEnlargement: true, // não aumenta imagens pequenas
        })
        .toFormat(OUTPUT_FORMAT, { quality: OUTPUT_QUALITY })
        .toFile(filepath)

      // URL pública (servida pelo NestJS static ou Nginx)
      urls.push(`/uploads/${entity}/${filename}`)
    }

    return urls
  }

  /**
   * Remove uma imagem do disco dado sua URL pública.
   * Ex: deleteImage('/uploads/kits/abc123.webp')
   */
  deleteImage(publicUrl: string): void {
    try {
      // /uploads/kits/abc123.webp → public/uploads/kits/abc123.webp
      const relativePath = publicUrl.replace('/uploads/', '')
      const fullPath = path.join(this.getBaseDir(), relativePath)

      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath)
      }
    } catch (err) {
      // Não quebra o fluxo se o arquivo não existir
      console.warn('[UploadService] Erro ao deletar arquivo:', err.message)
    }
  }

  /**
   * Remove imagens que não estão mais na lista (ao editar um kit, por exemplo).
   * Compara lista atual com lista nova e deleta as removidas.
   */
  cleanRemovedImages(currentUrls: string[], newUrls: string[]): void {
    const removed = currentUrls.filter((url) => !newUrls.includes(url))
    removed.forEach((url) => this.deleteImage(url))
  }

  // ── helpers ────────────────────────────────────────────────────────────────

  private getBaseDir(): string {
    // __dirname = dist/shared/services → sobe até a raiz do projeto
    return path.join(__dirname, '..', '..', '..', 'public')
  }

  private getUploadDir(entity: UploadEntity): string {
    return path.join(this.getBaseDir(), 'uploads', entity)
  }
}
