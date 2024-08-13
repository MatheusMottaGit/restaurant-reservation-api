import { Status } from "@prisma/client"
import { z } from "zod"

export const listReservationsFilters = z.object({
  period: z.enum(["daily", "weekly", "monthly"]).default("daily"),
  status: z.enum([Status.CONFIRMED, Status.CANCELED]).default("CONFIRMED")
})

export const listReservationsCountPerHourFilters = z.object({
  period: z.enum(["daily", "weekly", "monthly"]).default("daily")
})

export type ListReservationsFiltersDTO = z.infer<typeof listReservationsFilters>
export type ListReservationsCounterPerHourFiltersDTO = z.infer<typeof listReservationsCountPerHourFilters>
