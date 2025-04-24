export type AdminUser = {
  username: string
  passwordHash: string
}

// In a real app, you would store this in a database or environment variables
// and properly hash the passwords
const ADMIN_USERS: AdminUser[] = [
  {
    username: "admin",
    passwordHash: "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918", // SHA-256 of "admin"
  },
]

export async function validateCredentials(username: string, password: string): Promise<boolean> {
  // In a real app, you would use a proper password hashing library
  const passwordHash = await sha256(password)

  return ADMIN_USERS.some((user) => user.username === username && user.passwordHash === passwordHash)
}

// Simple SHA-256 implementation for demo purposes
// In a real app, use a proper crypto library
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message)
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}
