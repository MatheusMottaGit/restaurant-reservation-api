import { prisma } from "../config/prisma-client"
import { ListReservationsFiltersDTO } from "../dtos/reservation-dto"
import { Reservation } from "../models/reservation-model"
import { handlePeriodsDates } from "../utils/period-dates-handler"

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
    const { startDate, endDate } = handlePeriodsDates(period)

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

  async listReservationsCountPerHourInMonth(): Promise<{ hour: string; reservationsAmount: number; }[]> {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    
    const startDate = new Date(currentYear, currentMonth, 1, 12, 0, 0)
    const endDate = new Date(currentYear, currentMonth + 1, 1, 22, 59, 59)
    endDate.setDate(endDate.getDate() - 1)

    const reservationsPerHour = await prisma.reservation.groupBy({
      by: ['date'],
      where: {
        date: {
          gte: startDate,
          lte: endDate
        },
        status: "CONFIRMED"
      },
      _count: {
        _all: true
      }
    });

    const hours = Array.from({ length: 11 }, (_, i) => i + 12)

    const reservationsCountPerHour = hours.map((hour) => {
      const reservationsHour = reservationsPerHour.filter((res) => {
        return res.date.getHours() === hour
      }).length

      return {
        hour: String(hour).concat('h'),
        reservationsAmount: reservationsHour
      } 
    })

    return reservationsCountPerHour
}

}
