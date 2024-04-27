'use client'

import React from 'react'
import TableBody from './TableBody'
import data from '@/lib/data'
import { useState } from 'react'

export default function ShiftsTableView() {
  const [isChecked, setIsChecked] = useState(false)
  return (
    <div>
      {/* checkbox to display table */}
      <div className="flex items-center m-10">
        <span>
          <input
            id="show-table-checkbox"
            type="checkbox"
            defaultChecked={isChecked}
            onClick={() => setIsChecked(!isChecked)}
            value=""
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          ></input>{' '}
          Display Raw Data Table
        </span>
      </div>
      {isChecked ? (
        <div className="m-5">
          <h1>TABLE of SHIFTS</h1>
          <table className="table-fixed border-collapse border border-slate-400">
            <thead>
              <tr>
                <th className="border border-slate-500">Position</th>
                <th className="border border-slate-500">Date</th>
                <th className="border border-slate-500">Hours</th>
                <th className="border border-slate-500">Food Sales</th>
                <th className="border border-slate-500">Liquor Sales</th>
                <th className="border border-slate-500">Total Tips</th>
                <th className="border border-slate-500">Bar Tip Out</th>
                <th className="border border-slate-500">Barback Tip Out</th>
                <th className="border border-slate-500">Expo Tip Out</th>
                <th className="border border-slate-500">Host Tip Out</th>
              </tr>
            </thead>
            <tbody>
              {data.shifts.map((shift, i) => (
                <TableBody key={i} shift={shift} />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}
