import { UserModel } from "./user-model"

enum Status {
  CONFIRMED = 'confirmed',
  CANCELED = 'canceled'
}

export interface ReservationModel {
  id: string
  client: UserModel
  table: {}
  date: string
  hour: string
  totalPeople: number
  status: Status
  userId: string
  tableId: string
}