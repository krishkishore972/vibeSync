import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";


export function GET(req:NextRequest){
    const token = getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
        raw: true  
    })
    if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }
  return NextResponse.json({ token })
}
