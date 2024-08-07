import { Request, Response } from "express"
import { listReservationsPeriodsFilters, listReservationsStatusFilters } from "../dtos/reservation-dto"
import { ReservationService } from "../services/reservation-service"
// import { MailerService } from "../services/mailer-service"

const reservationService = new ReservationService()
// const mailerService = new MailerService()

export class ReservationController {
  async index(req: Request, res: Response): Promise<void> {
    try {
      const userId = String(req.params.userId)

      const reservations = await reservationService.listUserReservations(userId)

      res.status(201).json(reservations)
    } catch (error) {
      res.status(404).json(error)
    }
  } 

  async filteredIndex(req: Request, res: Response): Promise<void> {
    try {
      const periodsFilters = listReservationsPeriodsFilters.parse(req.query)
      const statusFilters = listReservationsStatusFilters.parse(req.query)

      if (periodsFilters) {
        const periodicReservations = await reservationService.listReservationsByPeriod(periodsFilters)
        res.status(201).json(periodicReservations)
      }else if (statusFilters) {
        const statusReservations = await reservationService.listReservationsByStatus(statusFilters)
        res.status(201).json(statusReservations)
      }

    } catch (error) {
      res.status(404).json(error)
    }
  }
}
