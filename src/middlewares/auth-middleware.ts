import { Request, Response, NextFunction } from "express";
import { JWTService } from "../services/jwt-service";

const jwtService = new JWTService()

type JwtPayload = {
  id: string
  iat: number
  exp: number
}

export class AuthMiddleware {
  async authGuard(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers

    if (!authorization) {
      return res.status(401).send({ message: "Token not found..." })
    }

    const [, token] = authorization.split(" ")

    try {
      const decodedToken = jwtService.verifyToken(token)
      
      const { id } = decodedToken as JwtPayload

      req.userId = id

      next()
    } catch (error) {
      return res.status(401).send({ message: "Your token is invalid..." })
    }
  }
}