import { User as UserModel, UserRole } from '@prisma/client'
import { instanceToPlain } from 'class-transformer'
import { Exclude } from 'class-transformer'

export class User implements UserModel {
  constructor(data?: any) {
    Object.assign(this, data)
  }

  id: string
  name: string
  email: string

  @Exclude()
  password: string | null

  whatsapp: string | null
  role: UserRole
  isActive: boolean
  createdAt: Date
  updatedAt: Date

  toJSON() {
    return instanceToPlain(this)
  }
}
