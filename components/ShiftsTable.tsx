import React from 'react'
import { Shift } from '@/lib/models/ShiftEntryModel'

export default function ShiftsTable({ shift }: { shift: Shift }) {
  return (
    <div>
      <table className="table-auto">
        <thead>
          <tr>
            <th>Position</th>
            <th>Date</th>
            <th>AM/PM</th>
            <th>Hours</th>
            <th>Food Sales</th>
            <th>Liquor Sales</th>
            <th>Total Tips</th>
            <th>Bar Tip Out</th>
            <th>Barback Tip Out</th>
            <th>Expo Tip Out</th>
            <th>Host Tip Out</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{shift.position}</td>
            <td>{shift.date.toString()}</td>
            <td>{shift.am_pm}</td>
            <td>{shift.hoursWorked}</td>
            <td>{shift.foodSales}</td>
            <td>{shift.liquorSales}</td>
            <td>{shift.totalTips}</td>
            <td>{shift.barTipOut}</td>
            <td>{shift.bBackTipOut}</td>
            <td>{shift.expoTipOut}</td>
            <td>{shift.hostTipOut}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
