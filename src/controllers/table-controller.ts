import { Request, Response } from "express"
import { registerTableSchema } from "../dtos/table-dto"
import { TableService } from "../services/table-service"

const tableService = new TableService()

export class TableController {
  async list(res: Response): Promise<void> {
    try {
      const tables = await tableService.listTables()
      
      res.status(201).json(tables)
    } catch (error) {
      res.status(400).json({ error })
    }
  }

  async register(req: Request, res: Response): Promise<void> {
    try {
      const registerTableData = registerTableSchema.parse(req.body)

      const createdTable = await tableService.registerTable(registerTableData)

      res.status(201).json(createdTable)
    } catch (error) {
      res.status(400).json({ error })
    }
  }
}