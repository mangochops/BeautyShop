import { authOptions } from "@/lib/auth"
import { getServerSession as getServerSessionNextAuth } from "next-auth/next"

// Helper function to get the session in server components
export async function getServerSession() {
  return await getServerSessionNextAuth(authOptions)
}

