import express from 'express'
import authRoutes from "./routes/auth-routes"
import reservationRoutes from "./routes/reservation-routes"
import tableRoutes from "./routes/table-routes"
import cors from "cors"

const app = express()

app.use(cors())

app.listen(8070)

app.use(express.json())

app.use("/auth", authRoutes)
app.use("/api", [tableRoutes, reservationRoutes])