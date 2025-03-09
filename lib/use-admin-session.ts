"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface Session {
  user: User
  expires: string
}

export function useAdminSession() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function getSession() {
      try {
        const response = await fetch("/api/admin/session")
        if (response.ok) {
          const data = await response.json()
          if (data.session) {
            setSession(data.session)
          } else {
            router.push("/admin/login")
          }
        } else {
          router.push("/admin/login")
        }
      } catch (error) {
        console.error("Failed to get session:", error)
        router.push("/admin/login")
      } finally {
        setLoading(false)
      }
    }

    getSession()
  }, [router])

  const logout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" })
      setSession(null)
      router.push("/admin/login")
    } catch (error) {
      console.error("Failed to logout:", error)
    }
  }

  return { session, loading, logout }
}

