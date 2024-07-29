import { z } from "zod";

export const registerTableSchema = z.object({
  capacity: z.number().int(),
  description: z.string()
})

export type RegisterTableDTO = z.infer<typeof registerTableSchema>