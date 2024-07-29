import { Request, Response, NextFunction } from 'express'
import { prisma } from '../config/prisma-client'
import { Role } from '@prisma/client'

export class RoleMiddleware {
  roleGuard(role: Role) {
    return async (req: Request, res: Response, next: NextFunction) => {
      const user = await prisma.user.findUnique({
        where: {
          id: req.userId,
        },
      })

      if (!user || user.role !== role) {
        return res.status(403).json({ message: 'Your role is not required for this action.' })
      }

      next()
    }
  }
}
