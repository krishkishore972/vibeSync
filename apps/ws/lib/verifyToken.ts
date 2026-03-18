import jwt from "jsonwebtoken"

type NextAuthToken = {
  id: string
  email: string
  name: string
  iat: number
  exp: number
}

export function verifyToken(token:string): NextAuthToken | null {
    try {
        const secret = process.env.NEXTAUTH_SECRET;
        if (!secret) {
            throw new Error("NEXTAUTH_SECRET not set")
        }
        const decoded = jwt.verify(token,secret) as NextAuthToken
        return decoded
    } catch (error) {
         return null
    }
}

