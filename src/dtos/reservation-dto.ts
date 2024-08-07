import { Status } from "@prisma/client";
import { z } from "zod";

export const listReservationsPeriodsFilters = z.object({
  period: z.enum(["daily", "weekly", "monthly"]).optional(),
})

export const listReservationsStatusFilters = z.object({
  status: z.enum([Status.CONFIRMED, Status.CANCELED]).optional()
})

export type ListReservationsPeriodsFiltersDTO = z.infer<typeof listReservationsPeriodsFilters>
export type ListReservationsStatusFiltersDTO = z.infer<typeof listReservationsStatusFilters>