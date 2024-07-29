import { Role } from '@prisma/client'
import { JwtPayload, sign, verify } from 'jsonwebtoken'

const jwtSecret = process.env.JWT_SECRET ?? ""

export class JWTService {
  signUserToken(id: string, role: Role): string {
    const createdToken = sign({ id, role }, jwtSecret, 
    { 
      expiresIn: "7d"
    })
    
    return createdToken
  }

  verifyToken(token: string): JwtPayload | string {
    const verifiedToken = verify(token, jwtSecret)
    
    return verifiedToken
  }
}