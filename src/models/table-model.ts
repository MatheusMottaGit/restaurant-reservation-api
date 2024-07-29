import { ReservationModel } from "./reservation-model"

export interface Table {
  id: number
  capacity: number
  description: string
  reservations?: ReservationModel[]
}
