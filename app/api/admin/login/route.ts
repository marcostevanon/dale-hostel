import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { validateCredentials } from "@/utils/auth"

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 })
    }

    const isValid = await validateCredentials(username, password)

    if (isValid) {
      // Set a cookie to authenticate the user
      // In a real app, you would use a more secure method like JWT
      cookies().set({
        name: "admin-auth",
        value: "authenticated",
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24, // 1 day
      })

      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "An error occurred" }, { status: 500 })
  }
}
