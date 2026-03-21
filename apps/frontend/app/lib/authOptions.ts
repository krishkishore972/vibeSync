import { prisma } from "@/app/lib/db";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user?.email) {
                let dbUser = await prisma.user.findFirst({
                    where: { email: user.email }
                })
                if (!dbUser) {
                    dbUser = await prisma.user.create({
                        data: {
                            email: user.email,
                            provider: "Google",
                            role: "Creater"
                        }
                    })
                }
                token.id = dbUser.id
                token.name = user.name
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
            }
            return session
        },
        async redirect({ url, baseUrl }) {
            return `${baseUrl}/dashboard`
        }
    }
}