type Period = "daily" | "weekly" | "monthly"

export function handlePeriodsDates(period: Period): { startDate: Date; endDate: Date; } {
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()
  
  let startDate: Date
  let endDate: Date
  
  switch (period) {
    case "daily":
      startDate = new Date(now.setHours(0, 0, 0, 0))
      endDate = new Date(now.setHours(23, 59, 59, 999))
      break;
    case "weekly":
      const lastSunday = new Date(now)
      lastSunday.setDate(now.getDate() - now.getDay())
      lastSunday.setHours(0, 0, 0, 0)

      const nextSunday = new Date(lastSunday)
      nextSunday.setDate(lastSunday.getDate() + 7)
      nextSunday.setHours(23, 59, 59, 999)

      startDate = lastSunday
      endDate = nextSunday
      break;
    case "monthly":
      const startOfMonth = new Date(currentYear, currentMonth, 1)
      const firstDayOfNextMonth = new Date(currentYear, currentMonth + 1, 1)
      const endOfMonth = new Date(firstDayOfNextMonth)
      endOfMonth.setDate(firstDayOfNextMonth.getDate() - 1)

      startDate = startOfMonth
      endDate = endOfMonth
      break;
    default:
      throw new Error("No filter provided.")
  }

  return {
    startDate,
    endDate
  }
}