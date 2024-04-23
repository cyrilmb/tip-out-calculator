import React from 'react'
import { round2Decimal } from '@/lib/utils'

interface DataSummariesProps {
  dateSelection: string[]
  data: Shift[]
}

interface Shift {
  position: string
  date: Date
  am_pm: string
  hoursWorked: number
  foodSales: number
  liquorSales?: number
  totalTips: number
  barTipOut?: number
  bBackTipOut?: number
  expoTipOut?: number
  hostTipOut?: number
}

const DataSummaries: React.FC<DataSummariesProps> = ({
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

  //Calculate all Server/Bartender tips for selected days
  function servBarTips(position: string) {
    return round2Decimal(
      filteredData.reduce((accumulator, shift) => {
        if (shift.position === position) {
          return accumulator + shift.totalTips
        }
        return accumulator
      }, 0)
    )
  }
  const serverTips = servBarTips('Server')
  const bartenderTips = servBarTips('Bartender')

  //Calculate host/expo/barback tipouts for selected days
  function supportStaffTipOuts(tipOut: keyof Shift) {
    return round2Decimal(
      filteredData.reduce((accumulator, shift) => {
        if (shift.position === 'Server' || shift.position === 'Bartender') {
          return accumulator + Number(shift[tipOut] ?? 0)
        }
        return accumulator
      }, 0)
    )
  }
  const hostTips = supportStaffTipOuts('hostTipOut')
  const expoTips = supportStaffTipOuts('expoTipOut')
  const bBackTips = supportStaffTipOuts('bBackTipOut')

  function calculateTipOutPercentage(
    position: 'server' | 'bartender',
    salesType: 'foodSales' | 'liquorSales' | 'totalSales',
    recipient: 'bBackTipOut' | 'expoTipOut' | 'hostTipOut'
  ): number {
    const shifts: Shift[] = [] // Your dataset

    // Filter shifts based on position
    const filteredShifts = shifts.filter(
      (shift) => shift.position.toLowerCase() === position
    )

    // Calculate total sales based on salesType
    const totalSales = filteredShifts.reduce((acc, shift) => {
      if (salesType === 'foodSales') {
        return acc + shift.foodSales
      } else if (salesType === 'liquorSales') {
        return acc + (shift.liquorSales || 0)
      } else {
        return acc + shift.foodSales + (shift.liquorSales || 0)
      }
    }, 0)

    // Calculate total tip out based on recipient
    let totalTipOut = 0
    if (recipient === 'bBackTipOut' && position === 'bartender') {
      const hostTips = supportStaffTipOuts('hostTipOut')
      const expoTips = supportStaffTipOuts('expoTipOut')
      const bartenderTipsAfterTipouts = filteredShifts.reduce((acc, shift) => {
        return acc + (shift.totalTips - hostTips + expoTips)
      }, 0)
      totalTipOut =
        bartenderTipsAfterTipouts -
        filteredShifts.reduce((acc, shift) => {
          return acc + (shift.hostTipOut || 0) + (shift.expoTipOut || 0)
        }, 0)
    } else {
      totalTipOut = filteredShifts.reduce((acc, shift) => {
        return acc + (shift[recipient] || 0)
      }, 0)
    }

    // Calculate the percentage
    const percentage = (totalTipOut / totalSales) * 100

    return percentage
  }

  return (
    <div>
      <table className="auto">
        <thead>
          <tr>
            <th className="border border-slate-500">Position (all)</th>
            <th className="border border-slate-500">Total Tips</th>
            <th className="border border-slate-500">% Sales to Host</th>
            <th className="border border-slate-500">% Food Sales to Expo</th>
            <th className="border border-slate-500">% Liquor Sales to Bar</th>
            <th className="border border-slate-500">
              % Tips to Barback (after tip outs)
            </th>
            <th className="border border-slate-500">% Tips to Support Staff</th>
            <th className="border border-slate-500">Tips After Tip Outs</th>
            <th className="border border-slate-500">Tips/Hour</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-slate-500">Server</td>
            <td className="border border-slate-500">{serverTips}</td>
          </tr>
          <tr>
            <td className="border border-slate-500">Bartender</td>
            <td className="border border-slate-500">{bartenderTips}</td>
          </tr>
          <tr>
            <td className="border border-slate-500">Host</td>
            <td className="border border-slate-500">{hostTips}</td>
          </tr>
          <tr>
            <td className="border border-slate-500">Expo</td>
            <td className="border border-slate-500">{expoTips}</td>
          </tr>
          <tr>
            <td className="border border-slate-500">Barback</td>
            <td className="border border-slate-500">{bBackTips}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default DataSummaries
