import express from "express"
import { AuthMiddleware } from "../middlewares/auth-middleware"
import { ReservationController } from "../controllers/reservation-controller"
import { RoleMiddleware } from "../middlewares/role-middleware"
import { Role } from "@prisma/client"

const router = express.Router()

const authMiddleware = new AuthMiddleware()
const roleMiddleware = new RoleMiddleware()
const reservationController = new ReservationController()

router.post('/reservations/:userId', 
  authMiddleware.authGuard,
  roleMiddleware.roleGuard(Role.ADMIN),
  reservationController.create
)

router.get('/reservations/:userId', 
  authMiddleware.authGuard,
  roleMiddleware.roleGuard(Role.ADMIN),
  reservationController.index
)

router.put('/reservations/:id',
  authMiddleware.authGuard,
  roleMiddleware.roleGuard(Role.CLIENT)
)

export default router