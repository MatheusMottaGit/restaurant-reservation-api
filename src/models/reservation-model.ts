import { Status } from "@prisma/client"
import { User } from "./user-model"

export interface Reservation {
  id: string
  client?: User
  table?: {}
  date: Date
  hour: Date
  totalPeople: number
  status: Status
  userId: string
  tableId: number
}