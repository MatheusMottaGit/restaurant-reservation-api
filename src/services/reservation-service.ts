import { Status } from "@prisma/client"
import { prisma } from "../config/prisma-client"
import {
  CreateReservationBodyDTO,
  CreateReservationParamsDTO,
  CreateReservationQueryParamDTO,
  ListUserReservationParamsDTO,
  CancelReservationParamsDTO,
  CancelReservationQueryParamDTO,
} from "../dtos/reservation-dto"
import { Reservation } from "../models/reservation-model"

export class ReservationService {
  async creatUserReservation(
    createReservationBody: CreateReservationBodyDTO,
    createReservationParams: CreateReservationParamsDTO,
    createReservationQuery: CreateReservationQueryParamDTO
  ): Promise<Reservation> {
    const { date, hour, totalPeople } = createReservationBody

    const { userId } = createReservationParams

    const { tableId } = createReservationQuery

    const existingReservation = await prisma.reservation.findFirstOrThrow({
      where: {
        tableId,
        date,
      },
    })

    if (existingReservation) {
      throw new Error("This table is already in use for this selected date and time.")
    }

    const createdReservation = await prisma.reservation.create({
      data: {
        userId,
        tableId,
        date,
        hour,
        status: Status.CONFIRMED,
        totalPeople,
      },
    })

    return createdReservation
  }

  async listUserReservations(listUserReservationParams: ListUserReservationParamsDTO): Promise<Reservation[]> {
    const { userId } = listUserReservationParams

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

  async cancelUserReservation(
    cancelReservationParams: CancelReservationParamsDTO,
    cancelReservationQueryParams: CancelReservationQueryParamDTO
  ): Promise<Reservation> {
    const { id } = cancelReservationParams

    const { tableId, userId, date } = cancelReservationQueryParams

    const existingReservation = await prisma.reservation.findFirstOrThrow({
      where: {
        date,
        id, 
        tableId,
        userId
      }
    })

    const canceledReservation = await prisma.reservation.update({
      where: {
        id: existingReservation.id
      },
      data: {
        status: Status.CANCELED
      }
    })

    return canceledReservation
  }
}
