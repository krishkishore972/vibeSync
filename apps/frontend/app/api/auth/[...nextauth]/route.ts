import { prisma } from "@/app/lib/db";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
    providers:[
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret:process.env.GOOGLE_CLIENT_SECRET ?? ""
        })
    ],

    callbacks : {
        async jwt({token,user}){
           if (user?.email) {
                let dbUser = await prisma.user.findFirst({
                    where:{
                        email:user.email
                    }
                })
                if (!dbUser) {
                    dbUser = await prisma.user.create({
                        data:{
                            email:user.email,
                            provider:"Google"
                        }
                    })
                }
                token.id = dbUser.id
           }
           return token
        },
        
        async session({session,token}){
            if (session.user) {
                session.user.id = token.id as string
            }
            return session
        }
    }
})

export { handler as GET,handler as POST}