import { Role } from '@prisma/client'
import { prisma } from '../config/prisma-client'
import { AuthenticateUserData, CreateUserData, RegisterUserData, User } from '../models/user-model'
import { hash, compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'

export class AuthService {
  async registerUser(registerUserData: RegisterUserData): Promise<User> {
    const { email, name, password } = registerUserData

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      throw new Error('This e-mail is already in use...')
    }

    const hashedPassword = await hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: Role.CLIENT,
      },
    })

    return user
  }

  async createUser(createUserData: CreateUserData): Promise<User> {
    const { email, name, password, role } = createUserData

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      throw new Error('This e-mail is already in use...')
    }

    const hashedPassword = await hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role,
      },
    })

    return user
  }

  async authenticateUser(authenticateUserData: AuthenticateUserData): Promise<string> {
    const { email, password } = authenticateUserData

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      throw new Error('Invalid email or password.')
    }

    const isPasswordValid = await compare(password, user.password)

    if (!isPasswordValid) {
      throw new Error('Invalid email or password.')
    }

    const token = sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    })

    return token
  }
}
