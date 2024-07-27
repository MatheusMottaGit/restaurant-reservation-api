import { ReservationModel } from "./reservation-model"

export interface TableModel {
  id: string
  capacity: number
  description: string
  reservations: ReservationModel[]
}
