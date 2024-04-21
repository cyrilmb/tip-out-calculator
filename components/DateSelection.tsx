'use client'

import React, { useState } from 'react'
import data from '@/lib/data'
import DataSummaries from './DataSummaries'

export default function DateSelection() {
  const [isChecked, setIsChecked] = useState(false)
  const [selectAll, setSelectAll] = useState(false)

  //array of selected dates to pass down to calculations
  const [dateSelection, setDateSelection] = useState<string[]>([])

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
    <div className="mt-5">
      <span className="m-5">
        <input
          id="select-all-checkbox"
          type="checkbox"
          checked={selectAll}
          onChange={() => {
            setSelectAll(!selectAll)
            setDateSelection(selectAll ? [] : uniqueDatesArray)
            setIsChecked(!isChecked)
          }}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
        Select All Dates
      </span>
      {uniqueDatesArray.map((uniqueDate, i) => (
        <span className="m-5" key={i}>
          <input
            id={`show-table-checkbox-${i}`}
            type="checkbox"
            checked={dateSelection.includes(uniqueDate)} // Check if uniqueDate is in dateSelection
            onChange={() => {
              setDateSelection((prevDateSelection) => {
                if (!prevDateSelection.includes(uniqueDate)) {
                  // If uniqueDate is not already in dateSelection, add it
                  return [...prevDateSelection, uniqueDate]
                } else {
                  // If uniqueDate is already in dateSelection, remove it
                  return prevDateSelection.filter((date) => date !== uniqueDate)
                }
              })
              setIsChecked(!isChecked)
            }}
            value=""
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          {uniqueDate}
        </span>
      ))}
      <DataSummaries dateSelection={dateSelection} data={data.shifts} />
    </div>
  )
}
