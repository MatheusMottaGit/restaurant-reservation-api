import { Role } from "@prisma/client"
import { Reservation } from "./reservation-model"

export interface User {
  id: string
  name: string
  email: string
  password: string
  role: Role
  reservations?: Reservation[]
}