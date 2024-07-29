import { Request, Response } from 'express'
import { AuthService } from '../services/auth-service'
import { prisma } from '../config/prisma-client'
import { Role } from '@prisma/client'
import { createUserSchema, loginUserSchema, registerUserSchema } from '../dtos/auth-dto'

const authService = new AuthService()

export class AuthController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const createUserData = createUserSchema.parse(req.body)

      if (!req.userId) {
        res.status(401).json({ error: 'Unauthorized' })
        return
      }

      const userRequest = await prisma.user.findUnique({
        where: {
          id: req.userId,
        },
      })

      if (createUserData.role === Role.ADMIN && userRequest?.role !== Role.ADMIN) {
        res.status(403).json({ error: 'Forbidden' })
        return
      }

      const user = await authService.createUser(createUserData)

      res.status(201).json(user)
    } catch (error) {
      res.status(400).json({ error })
    }
  }

  async register(req: Request, res: Response): Promise<void> {
    try {
      const registerUserData = registerUserSchema.parse(req.body)

      const user = await authService.registerUser(registerUserData)

      res.status(201).json(user)
    } catch (error) {
      res.status(400).json({ error })
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const loginUserData = loginUserSchema.parse(req.body)

      const token = await authService.authenticateUser(loginUserData)

      res.status(200).json({ token })
    } catch (error) {
      res.status(401).json({ error: 'Unauthorized' })
    }
  }
}
