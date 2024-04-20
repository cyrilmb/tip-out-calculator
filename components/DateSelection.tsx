import React from 'react'
import data from '@/lib/data'

export default function DateSelection() {
  const dateReformat = data.shifts.map((shift) =>
    shift.date.toLocaleDateString('en-us', {
      month: 'short',
      day: 'numeric',
    })
  )

  function uniqueDates(date: string[]): string[] {
    const exists: { [key: string]: boolean } = {}
    return date.filter((item) => {
      if (exists.hasOwnProperty(item)) {
        return false
      }
      exists[item] = true
      return true
    })
  }

  const uniqueDatesArray = uniqueDates(dateReformat)

  return (
    <div>
      {uniqueDatesArray.map((uniqueDate, i) => (
        <h3 key={i}>{uniqueDate}</h3>
      ))}
    </div>
  )
}
