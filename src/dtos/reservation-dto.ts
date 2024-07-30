import { z } from "zod";

export const createReservationBodySchema = z.object({
  date: z.coerce.date(),
  hour: z.coerce.date(),
  totalPeople: z.number().int()
})

export const createReservationParamsSchema = z.object({
  userId: z.string().uuid()
})

export const createReservationQueryParamSchema = z.object({
  tableId: z.number()
})

export const listUserReservationParamsSchema = z.object({
  userId: z.string().uuid()
})

export const cancelReservationParamsSchema = z.object({
  id: z.string().uuid()
})

export const cancelReservationQueryParamSchema = z.object({
  userId: z.string().uuid(),
  tableId: z.number(),
  date: z.coerce.date()
})

export type CreateReservationBodyDTO = z.infer<typeof createReservationBodySchema>
export type CreateReservationParamsDTO = z.infer<typeof createReservationParamsSchema>
export type CreateReservationQueryParamDTO = z.infer<typeof createReservationQueryParamSchema>

export type ListUserReservationParamsDTO = z.infer<typeof listUserReservationParamsSchema>

export type CancelReservationParamsDTO = z.infer<typeof cancelReservationParamsSchema>
export type CancelReservationQueryParamDTO = z.infer<typeof cancelReservationQueryParamSchema>