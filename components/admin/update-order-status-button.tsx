"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateOrderStatus } from "@/lib/admin"

interface UpdateOrderStatusButtonProps {
  orderId: string
  currentStatus: string
}

export default function UpdateOrderStatusButton({ orderId, currentStatus }: UpdateOrderStatusButtonProps) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === status) return

    setIsUpdating(true)

    try {
      await updateOrderStatus(orderId, newStatus)
      setStatus(newStatus)
      router.refresh()
    } catch (error) {
      console.error("Failed to update order status:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Select value={status} onValueChange={handleStatusChange} disabled={isUpdating}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="pending">Pending</SelectItem>
        <SelectItem value="processing">Processing</SelectItem>
        <SelectItem value="completed">Completed</SelectItem>
        <SelectItem value="cancelled">Cancelled</SelectItem>
      </SelectContent>
    </Select>
  )
}

