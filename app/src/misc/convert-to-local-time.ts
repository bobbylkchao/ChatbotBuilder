import { formatInTimeZone } from 'date-fns-tz'

export const convertToLocalTime = (utcDateStr: string) => {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  return formatInTimeZone(new Date(utcDateStr), timeZone, 'yyyy-MM-dd HH:mm:ss')
}
