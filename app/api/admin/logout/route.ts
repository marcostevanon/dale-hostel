import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST() {
  // Clear the auth cookie
  cookies().delete("admin-auth")

  // Redirect to login page
  return NextResponse.json({ success: true })
}
