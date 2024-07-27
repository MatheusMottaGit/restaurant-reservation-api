import express from 'express'
import { AuthController } from '../controllers/auth-controller'
import { AuthMiddleware } from '../middlewares/auth-middleware'
import { RoleMiddleware } from '../middlewares/role-middleware'
import { Role } from '@prisma/client'

const router = express.Router()
const authController = new AuthController()
const authMiddleware = new AuthMiddleware()
const roleMiddleware = new RoleMiddleware()

router.post('/register', authController.register)

router.post('/login', authController.login)

router.post(
  '/create', 
  roleMiddleware.roleGuard(Role.ADMIN),
  authMiddleware.authenticateToken, 
  authController.create
)

export default router