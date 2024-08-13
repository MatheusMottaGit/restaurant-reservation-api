import { Request, Response } from "express"
import { listReservationsFilters } from "../dtos/reservation-dto"
import { ReservationService } from "../services/reservation-service"

const reservationService = new ReservationService()

export class ReservationController {
  async userReservationsindex(req: Request, res: Response): Promise<void> {
    try {
      const userId = String(req.params.userId)

      const reservations = await reservationService.listUserReservations(userId)

      res.status(200).json(reservations)
    } catch (error) {
      res.status(404).json(error)
    }
  } 

  async filteredIndex(req: Request, res: Response): Promise<void> {
    try {
      const filtersOptions = listReservationsFilters.parse(req.query)
      
      const filterCountReservations = await reservationService.listFilteredReservations(filtersOptions)
      res.status(200).json({ filterCountReservations })

    } catch (error) {
      res.status(404).json(error)
    }
  }

  async weekdaysReservationsAmountIndex(req: Request, res: Response): Promise<void> {
    try {
      const weekdaysReservationsAmount = await reservationService.listWeekdaysReservationsAmount()
      res.status(200).json({ weekdaysReservationsAmount })
    } catch (error) {
      res.status(404).send(error)
    }
  }

  async canceledReservationsRateIndex(req: Request, res: Response): Promise<void> {
    try {
      const rate = await reservationService.listCanceledReservationsRateInDay()
      res.status(200).json({ rate })
    } catch (error) {
      res.status(404).json(error)
    }
  }
}
