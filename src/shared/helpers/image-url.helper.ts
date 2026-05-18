// src/shared/helpers/image-url.helper.ts
import { Injectable } from '@nestjs/common'

@Injectable()
export class ImageUrlHelper {
  /**
   * Converte uma URL relativa em URL completa
   * Retorna null se não houver path
   */
  toFullUrl(
    relativePath: string | null | undefined,
    baseUrl: string,
  ): string | null {
    if (!relativePath) return null
    if (relativePath.startsWith('http')) return relativePath
    return `${baseUrl}${relativePath}`
  }

  /**
   * Converte um array de URLs relativas em URLs completas
   * Retorna array vazio se não houver imagens
   */
  toFullUrls(urls: string[] | null | undefined, baseUrl: string): string[] {
    if (!urls || urls.length === 0) return [] // ✅ Retorna array vazio
    return urls.map((url) => this.toFullUrl(url, baseUrl) as string)
  }

  /**
   * Processa um objeto que pode ter campos de imagem
   * Mantém o campo original se não houver imagem
   */
  processImages<T extends Record<string, any>>(
    data: T,
    baseUrl: string,
    imageFields: string[] = ['images', 'image', 'photo', 'avatar'],
  ): T {
    const processed: any = { ...data }

    for (const field of imageFields) {
      if (processed[field]) {
        if (Array.isArray(processed[field])) {
          // ✅ Se for array vazio, mantém vazio
          if (processed[field].length === 0) {
            processed[field] = []
          } else {
            processed[field] = this.toFullUrls(processed[field], baseUrl)
          }
        } else if (typeof processed[field] === 'string') {
          // ✅ Se for string vazia, mantém vazia
          if (processed[field].trim() === '') {
            processed[field] = ''
          } else {
            processed[field] = this.toFullUrl(processed[field], baseUrl)
          }
        }
      } else {
        // ✅ Garante que o campo existe mesmo que vazio
        if (processed[field] === undefined) {
          if (field === 'images') {
            processed[field] = []
          }
        }
      }
    }

    return processed
  }

  /**
   * Processa uma lista de objetos
   */
  processImagesList<T extends Record<string, any>>(
    dataList: T[],
    baseUrl: string,
    imageFields: string[] = ['images', 'image', 'photo'],
  ): T[] {
    if (!dataList || dataList.length === 0) return []
    return dataList.map((item) =>
      this.processImages(item, baseUrl, imageFields),
    )
  }
}
