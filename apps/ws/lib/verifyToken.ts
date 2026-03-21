import { decode } from "next-auth/jwt";



export async function verifyToken(token: string) {
    try {
        const secret = process.env.NEXTAUTH_SECRET;
        if (!secret) {
            throw new Error("NEXTAUTH_SECRET not set")
        }
        const decoded = await decode({
            token,
            secret: process.env.NEXTAUTH_SECRET!,
        })
        return decoded;
    } catch (error) {
        return null
    }
}

