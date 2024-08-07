import express from "express"
import { AuthMiddleware } from "../middlewares/auth-middleware"
import { ReservationController } from "../controllers/reservation-controller"
import { RoleMiddleware } from "../middlewares/role-middleware"
import { Role } from "@prisma/client"

const router = express.Router()

const authMiddleware = new AuthMiddleware()
const roleMiddleware = new RoleMiddleware()
const reservationController = new ReservationController()

router.get('/reservations/:userId', 
  authMiddleware.authGuard,
  reservationController.index
)

router.get('/reservations', // rote for dashboard analysis
  authMiddleware.authGuard,
  roleMiddleware.roleGuard(Role.ADMIN),
  reservationController.filteredIndex
)

export default router