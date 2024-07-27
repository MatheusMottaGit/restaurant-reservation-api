import { Role } from "@prisma/client"
import { ReservationModel } from "./reservation-model"

export interface User {
  id: string
  name: string
  email: string
  password: string
  role: Role
  reservations?: ReservationModel[]
}

export interface RegisterUserData {
  name: string
  email: string
  password: string
}

export interface CreateUserData extends RegisterUserData {
  role: Role
}

export interface AuthenticateUserData {
  email: string
  password: string
}