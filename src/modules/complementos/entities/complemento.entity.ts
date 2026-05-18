export class Complemento {
  id: string
  name: string
  description: string
  icon: string
  price: number
  category: string
  stock: number
  isActive: boolean
  images: string[] // ✅ Adicionar
  createdAt: Date
  updatedAt: Date

  constructor(partial: Partial<Complemento>) {
    Object.assign(this, partial)
    this.images = partial.images || [] // Garantir array
  }
}
