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

  //Pool all tips, calculate hours worked and percentage of tips owed
  function poolingTips(): {
    pooledTips: number
    serverBarHours: number
    supportStaffHours: number
    serverBarHourly: number
    supportStaffHourly: number
  } {
    const bartenderServerShifts = filteredData.filter(
      (shift) => shift.position === 'Bartender' || shift.position === 'Server'
    )
    const supportShifts = filteredData.filter(
      (shift) =>
        shift.position === 'Host' ||
        shift.position === 'Expo' ||
        shift.position === 'Barback'
    )

    const pooledTips = round2Decimal(
      filteredData.reduce((acc, shift) => {
        return acc + (shift.totalTips || 0)
      }, 0)
    )

    const serverBarHours = round2Decimal(
      bartenderServerShifts.reduce((acc, shift) => {
        return acc + (shift.hoursWorked || 0)
      }, 0)
    )

    const supportStaffHours = round2Decimal(
      supportShifts.reduce((acc, shift) => {
        return acc + (shift.hoursWorked || 0)
      }, 0)
    )

    //Servers/tenders get one point per hour worked.
    //Supportstaff gets half a point per hour worked.
    //Value of a point is total pooled tips divided by number of points for given days
    const pointValue = pooledTips / (serverBarHours + supportStaffHours / 2)

    const serverBarHourly = round2Decimal(pointValue * serverBarHours)
    const supportStaffHourly = round2Decimal(
      pointValue * (supportStaffHours / 2)
    )

    return {
      pooledTips,
      serverBarHours,
      supportStaffHours,
      serverBarHourly,
      supportStaffHourly,
    }
  }

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
            <td className="border border-slate-500">
              {poolingTips().serverBarHours} hours
            </td>
            <td className="border border-slate-500">
              {poolingTips().supportStaffHours} hours
            </td>
          </tr>
          <tr>
            <td className="border border-slate-500">
              {poolingTips().serverBarHourly} tips/hour
            </td>
            <td className="border border-slate-500">
              {poolingTips().supportStaffHourly} tips/hour
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default PoolProposal
