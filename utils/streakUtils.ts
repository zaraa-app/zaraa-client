import { isToday, isYesterday, parseISO, differenceInCalendarDays } from "date-fns";

export function calculateStreak(activityDates: string[]): number {
  const sortedDates = activityDates.map((d) => parseISO(d)).sort((a, b) => b.getTime() - a.getTime());

  let streak = 0;
  let currentDate = new Date();

  for (let date of sortedDates) {
    const diff = differenceInCalendarDays(currentDate, date);
    if (diff === 0 || diff === 1) {
      streak++;
      currentDate = date;
    } else {
      break;
    }
  }

  return streak;
}
