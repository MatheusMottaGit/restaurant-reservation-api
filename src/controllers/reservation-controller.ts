import { Request, Response } from "express"
import {
  cancelReservationParamsSchema,
  cancelReservationQueryParamSchema,
  createReservationBodySchema,
  createReservationParamsSchema,
  createReservationQueryParamSchema,
  listUserReservationParamsSchema,
} from "../dtos/reservation-dto"
import { ReservationService } from "../services/reservation-service"
import { MailerService } from "../services/mailer-service"
import { prisma } from "../config/prisma-client"

const reservationService = new ReservationService()
const mailerService = new MailerService()

export class ReservationController {
  async index(req: Request, res: Response): Promise<void> {
    try {
      const listUserReservationParamsData = listUserReservationParamsSchema.parse(req.params)

      const reservations = await reservationService.listUserReservations(listUserReservationParamsData)

      res.status(201).json(reservations)
    } catch (error) {
      res.status(404).json(error)
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const createReservationBodyData = createReservationBodySchema.parse(req.body);
      const createReservationParamsData = createReservationParamsSchema.parse(req.params);
      const createReservationQueryParams = createReservationQueryParamSchema.parse({
        ...req.query,
        tableId: Number(req.query.tableId)
      });

      const createdReservation = await reservationService.creatUserReservation(
        createReservationBodyData,
        createReservationParamsData,
        createReservationQueryParams
      );

      // if (createdReservation) {
      //   const userReservation = await prisma.user.findFirst({
      //     where: {
      //       id: createdReservation.userId,
      //     },
      //   });

      //   if (userReservation) {
      //     await mailerService.sendReservationEmail(userReservation.email, createdReservation);
      //   }
      // }

      res.status(201).json(createdReservation);
    } catch (error) {
      res.status(404).json(error);
    }
  }

  async cancel(req: Request, res: Response): Promise<void> {
    try {
      const cancelUserReservationParams = cancelReservationParamsSchema.parse(req.params)

      const cancelUserReservationQueryParam = cancelReservationQueryParamSchema.parse({
        ...req.query,
        tableId: Number(req.query.tableId)
      })

      const canceledReservation = await reservationService.cancelUserReservation(
        cancelUserReservationParams,
        cancelUserReservationQueryParam
      )

      res.status(201).json(canceledReservation)
    } catch (error) {
      res.status(404).json(error)
    }
  }
}
