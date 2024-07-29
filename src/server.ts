import express from 'express'
import authRoutes from "./routes/auth-routes"
import reservationRoutes from "./routes/reservation-routes"
import tableRoutes from "./routes/table-routes"

const app = express()

app.listen(8070)

app.use(express.json())

app.use("/auth", authRoutes)
app.use("/api", [tableRoutes, reservationRoutes])