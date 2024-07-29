import { prisma } from "../config/prisma-client";
import { RegisterTableDTO } from "../dtos/table-dto";
import { Table } from "../models/table-model";

export class TableService {
  async listTables(): Promise<Table[]> {
    const tables = await prisma.table.findMany()
    
    return tables
  }

  async registerTable(registerTableData: RegisterTableDTO): Promise<Table> {
    const { capacity, description } = registerTableData

    const table = await prisma.table.create({
      data: {
        capacity,
        description
      }
    })

    return table
  }
}