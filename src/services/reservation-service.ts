import { prisma } from "../config/prisma-client"
import { ListReservationsPeriodsFiltersDTO, ListReservationsStatusFiltersDTO } from "../dtos/reservation-dto"
import { Reservation } from "../models/reservation-model"

const today = new Date()

export class ReservationService {
  async listUserReservations(userId: string): Promise<Reservation[]> {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
    })

    if (!user) {
      throw new Error("This user doesn't exists.")
    }

    const reservations = await prisma.reservation.findMany({
      where: {
        userId,
      },
      include: {
        client: true,
      },
    })

    return reservations ?? []
  }

  async listReservationsByPeriod({ period }: ListReservationsPeriodsFiltersDTO): Promise<Reservation[]> {
    let startDate: Date
    let endDate: Date

    switch (period) {
      case "daily":
        startDate = new Date(today.setHours(0, 0, 0, 0))
        endDate = new Date(today.setHours(23, 59, 59, 999))
        break;
      case "weekly":
        startDate = new Date(today.setDate(today.getDate() - today.getDay()))
        endDate = new Date(today.setDate(today.getDate() + 6))
        break;
      case "monthly":
        startDate = new Date(today.getFullYear(), today.getMonth(), 1)
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0)
        break;
      default:
        throw new Error("Invalid filter")
    }

    const reservations = await prisma.reservation.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate
        }
      }
    })

    return reservations
  }

  async listReservationsByStatus({ status }: ListReservationsStatusFiltersDTO): Promise<Reservation[]>{
    const reservations = await prisma.reservation.findMany({
      where: {
        status
      }
    })

    return reservations
  }
}
