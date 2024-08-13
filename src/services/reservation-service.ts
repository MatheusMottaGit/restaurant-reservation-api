import { prisma } from "../config/prisma-client"
import { ListReservationsFiltersDTO } from "../dtos/reservation-dto"
import { Reservation } from "../models/reservation-model"

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

  async listFilteredReservations({ period, status }: ListReservationsFiltersDTO): Promise<number> {
    const now = new Date() // returns time that this line has been executed
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    
    let startDate: Date
    let endDate: Date
    
    switch (period) {
      case "daily": // daily interval
        startDate = new Date(now.setHours(0, 0, 0, 0)) // start of the day
        endDate = new Date(now.setHours(23, 59, 59, 999)) // end of the day
        break;
      case "weekly": // weekly interval
        const lastSunday = new Date(now)
        lastSunday.setDate(now.getDate() - now.getDay())
        lastSunday.setHours(0, 0, 0, 0)
    
        const nextSunday = new Date(lastSunday)
        nextSunday.setDate(lastSunday.getDate() + 7)
        nextSunday.setHours(23, 59, 59, 999)
    
        startDate = lastSunday
        endDate = nextSunday
        break;
      case "monthly": // monthly interval
        const startOfMonth = new Date(currentYear, currentMonth, 1) // start of current month
        const firstDayOfNextMonth = new Date(currentYear, currentMonth + 1, 1)
        const endOfMonth = new Date(firstDayOfNextMonth)
        endOfMonth.setDate(firstDayOfNextMonth.getDate() - 1)

        startDate = startOfMonth
        endDate = endOfMonth
        break;
      default:
        throw new Error("No filter provided.")
    }

    const filteredCountReservations = await prisma.reservation.groupBy({
      by: ['date'],
      where: {
        date: {
          gte: startDate,
          lte: endDate
        },
        status
      },
      _count: true
    })

    return filteredCountReservations.length
  }

  async listWeekdaysReservationsAmount(): Promise<{ weekday: string; reservationsAmount: number; }[]> {
    const now = new Date()

    const lastSunday = new Date(now)
    lastSunday.setDate(now.getDate() - now.getDay())
    lastSunday.setHours(0, 0, 0, 0)

    const nextSunday = new Date(lastSunday)
    nextSunday.setDate(lastSunday.getDate() + 6)
    nextSunday.setHours(23, 59, 59, 999)

    const startDate = lastSunday
    const endDate = nextSunday

    const weekdays = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ]

    const weeklyReservations = await prisma.reservation.groupBy({
      by: ['date'],
      where: {
        date: {
          gte: startDate,
          lte: endDate
        },
      },
      _count: true
    })

    const weekdaysReservationsAmount = weekdays.map((weekday) => {
      return {
        weekday,
        reservationsAmount: weeklyReservations.filter(res => weekdays[res.date.getDay()] === weekday).length
      }
    })

    return weekdaysReservationsAmount
  }

  async listCanceledReservationsRateInDay(): Promise<{ canceledRate: number; reservations: number; }> {
    const now = new Date()
    const startDate = new Date(now.setHours(0, 0, 0, 0))
    const endDate = new Date(now.setHours(23, 59, 59, 999))

    const allReservations = await prisma.reservation.findMany()

    const canceledReservations = await prisma.reservation.aggregate({
      _count: {
        _all: true,
        status: true
      },
      where: {
        status: "CANCELED",
        date: {
          gte: startDate,
          lte: endDate
        }
      }
    })

    const canceledReservationsCount = canceledReservations._count.status

    const canceledRate = (canceledReservationsCount / allReservations.length) * 100

    return {
      canceledRate,
      reservations: allReservations.length
    }
  }
}
