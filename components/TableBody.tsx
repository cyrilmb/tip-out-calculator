import React from 'react'
import { Shift } from '@/lib/models/ShiftEntryModel'

export default function TableBody({ shift }: { shift: Shift }) {
  const date = new Date(shift.date)
  return (
    <tr>
      <td className="border border-slate-500">{shift.position}</td>
      <td className="border border-slate-500">
        {date.toLocaleDateString('en-us', {
          month: 'short',
          day: 'numeric',
        })}
      </td>
      <td className="border border-slate-500">{shift.hoursWorked}</td>
      <td className="border border-slate-500">{shift.foodSales}</td>
      <td className="border border-slate-500">{shift.liquorSales}</td>
      <td className="border border-slate-500">{shift.totalTips}</td>
      <td className="border border-slate-500">{shift.barTipOut}</td>
      <td className="border border-slate-500">{shift.bBackTipOut}</td>
      <td className="border border-slate-500">{shift.expoTipOut}</td>
      <td className="border border-slate-500">{shift.hostTipOut}</td>
    </tr>
  )
}
