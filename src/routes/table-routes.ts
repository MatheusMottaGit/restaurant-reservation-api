import express from "express"
import { TableController } from "../controllers/table-controller"
import { AuthMiddleware } from "../middlewares/auth-middleware"
import { RoleMiddleware } from "../middlewares/role-middleware"
import { Role } from "@prisma/client"

const router = express.Router()
const authMiddleware = new AuthMiddleware()
const tableController = new TableController()
const roleMiddleware = new RoleMiddleware()

router.post('/tables', 
  authMiddleware.authGuard,
  roleMiddleware.roleGuard(Role.ADMIN),
  tableController.register
)

router.get('/tables', 
  authMiddleware.authGuard,
  roleMiddleware.roleGuard(Role.ADMIN),
  tableController.list
)

export default router