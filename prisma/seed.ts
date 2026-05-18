// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Criar Admin
  const adminPassword = await bcrypt.hash('Lara1804*', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'duda.pomp8@gmail.com' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'duda.pomp8@gmail.com',
      password: adminPassword,
      role: 'ADMIN',
      isActive: true,
    },
  })
  console.log(`✅ Admin criado: ${admin.email}`)

  // Criar Configurações padrão
  const config = await prisma.config.upsert({
    where: { id: '1' },
    update: {},
    create: {
      id: '1',
      companyName: 'Lali',
      whatsappNumber: '5511999990000',
      defaultCauction: 200,
      barcodePrefix: 'PM',
      emailSupport: 'oi@lali.com.br',
      address: 'Rua Exemplo, 123 - Americana, SP',
      workingHours: 'Segunda a Sexta: 9h às 18h | Sábado: 9h às 13h',
    },
  })
  console.log(`✅ Configurações criadas`)

  console.log('🎉 Seed concluído!')
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
