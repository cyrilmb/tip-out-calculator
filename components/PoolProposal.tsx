import React from 'react'
import { round2Decimal } from '@/lib/utils'

interface DataSummariesProps {
  dateSelection: string[]
  data: Shift[]
}

interface Shift {
  position: string
  date: Date
  hoursWorked: number
  foodSales?: number
  liquorSales?: number
  totalTips?: number
  barTipOut?: number
  bBackTipOut?: number
  expoTipOut?: number
  hostTipOut?: number
}

const PoolProposal: React.FC<DataSummariesProps> = ({
  dateSelection,
  data,
}) => {
  //Filter selected dates from ALL DATA
  function filterByDates(data: Shift[], dateSelection: string[]): Shift[] {
    return data.filter((shift) => {
      // Convert shift date to the same format as selected dates
      const shiftDateFormatted = shift.date.toLocaleDateString('en-us', {
        month: 'short',
        day: 'numeric',
      })
      // Check if the formatted date is included in selected dates
      return dateSelection.includes(shiftDateFormatted)
    })
  }
  // Use the filtered data
  const filteredData = filterByDates(data, dateSelection)

  return (
    <div className="p-5">
      <h2 className="text-lg">Proposed Pool</h2>
      <div className="p-5">
        <p>
          Every server/bartender gets one point per hour worked. Every support
          staff gets half a point per hour worked.
        </p>
        <p>
          All tips are pooled and divided by the total number of points for the
          day.
        </p>
        <p>
          Each employee multiplies their points by the tips/hour ratio. This is
          their tipout for the day.
        </p>
      </div>

      <table className="auto">
        <thead>
          <tr>
            <th className="border border-slate-500">Server/Tender</th>
            <th className="border border-slate-500">Support Staff</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-slate-500">hours</td>
            <td className="border border-slate-500">hours</td>
          </tr>
          <tr>
            <td className="border border-slate-500">tips/hour</td>
            <td className="border border-slate-500">tips/hour</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default PoolProposal
