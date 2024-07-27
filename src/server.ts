import express from 'express'
import authRoutes from "./routes/auth-routes"

const app = express()

app.listen(8070)

app.use(express.json())

app.use("/auth", authRoutes)