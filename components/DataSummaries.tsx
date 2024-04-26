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
    recipient: 'bBackTipOut' | 'expoTipOut' | 'hostTipOut' | 'barTipOut',
    filteredData: Shift[]
  ): number {
    // Filter shifts based on position
    const filteredShifts = filteredData.filter(
      (shift) => shift.position.toLowerCase() === position
    )

    // Calculate total sales based on salesType
    let totalSales = filteredShifts.reduce((acc, shift) => {
      if (salesType === 'foodSales') {
        return acc + shift.foodSales
      } else if (salesType === 'liquorSales') {
        return acc + (shift.liquorSales || 0)
      } else if (
        // Adjust totalSales to be equal to totalTips from bartender if recipient is bBackTipOut
        position === 'bartender' &&
        recipient === 'bBackTipOut' &&
        salesType === 'totalSales'
      ) {
        return acc + (shift.totalTips || 0)
      } else {
        return acc + shift.foodSales + (shift.liquorSales || 0)
      }
    }, 0)

    // Check if totalSales is not 0
    if (totalSales === 0) {
      return 0
    }

    // Calculate bar total tip out based on recipient
    let totalTipOut = 0
    if (recipient === 'bBackTipOut' && position === 'bartender') {
      totalTipOut = filteredShifts.reduce((acc, shift) => {
        if (shift.position === 'Bartender' && shift.bBackTipOut !== undefined) {
          return acc + (shift.bBackTipOut || 0)
        }
        return acc
      }, 0)
    } else {
      totalTipOut = filteredShifts.reduce((acc, shift) => {
        return acc + (shift[recipient] || 0)
      }, 0)
    }

    // Calculate the percentage
    const percentage = (totalTipOut / totalSales) * 100

    return round2Decimal(percentage)
  }

  const serverToHostPercentage = calculateTipOutPercentage(
    'server',
    'totalSales',
    'hostTipOut',
    filteredData
  )
  const barToHostPercentage = calculateTipOutPercentage(
    'bartender',
    'totalSales',
    'hostTipOut',
    filteredData
  )
  const serverToExpoPercentage = calculateTipOutPercentage(
    'server',
    'foodSales',
    'expoTipOut',
    filteredData
  )
  const barToExpoPercentage = calculateTipOutPercentage(
    'bartender',
    'foodSales',
    'expoTipOut',
    filteredData
  )
  const serverToBarPercentage = calculateTipOutPercentage(
    'server',
    'liquorSales',
    'barTipOut',
    filteredData
  )
  const bBackPercentage = calculateTipOutPercentage(
    'bartender',
    'totalSales',
    'bBackTipOut',
    filteredData
  )

  function totalTipsAndTipOuts(
    position: 'Bartender' | 'Server',
    filteredData: Shift[]
  ): { percentage: number; difference: number; hourly: number } {
    const filteredShifts = filteredData.filter(
      (shift) => shift.position === position
    )

    const totalTips = filteredShifts.reduce(
      (acc, shift) => acc + shift.totalTips,
      0
    )
    const totalTipOuts = filteredShifts.reduce((acc, shift) => {
      return (
        acc +
        (shift.barTipOut || 0) +
        (shift.bBackTipOut || 0) +
        (shift.expoTipOut || 0) +
        (shift.hostTipOut || 0)
      )
    }, 0)

    const hours = filteredShifts.reduce((acc, shift) => {
      return acc + shift.hoursWorked
    }, 0)

    if (totalTips === 0) {
      return { percentage: 0, difference: 0, hourly: 0 }
    }

    const percentage = round2Decimal((totalTipOuts / totalTips) * 100)
    const difference = round2Decimal(totalTips - totalTipOuts)
    const hourly = round2Decimal(difference / hours)

    return { percentage, difference, hourly }
  }

  const barTotalTipsAndTipOuts = totalTipsAndTipOuts('Bartender', filteredData)
  const serverTotalTipsAndTipOuts = totalTipsAndTipOuts('Server', filteredData)

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
            <td className="border border-slate-500">
              {serverToHostPercentage}
            </td>
            <td className="border border-slate-500">
              {serverToExpoPercentage}
            </td>
            <td className="border border-slate-500">{serverToBarPercentage}</td>
            <td></td>
            <td className="border border-slate-500">
              {serverTotalTipsAndTipOuts.percentage}
            </td>
            <td className="border border-slate-500">
              {serverTotalTipsAndTipOuts.difference}
            </td>
            <td className="border border-slate-500">
              {serverTotalTipsAndTipOuts.hourly}
            </td>
          </tr>
          <tr>
            <td className="border border-slate-500">Bartender</td>
            <td className="border border-slate-500">{bartenderTips}</td>
            <td className="border border-slate-500">{barToHostPercentage}</td>
            <td className="border border-slate-500">{barToExpoPercentage}</td>
            <td></td>
            <td className="border border-slate-500">{bBackPercentage}</td>
            <td className="border border-slate-500">
              {barTotalTipsAndTipOuts.percentage}
            </td>
            <td className="border border-slate-500">
              {barTotalTipsAndTipOuts.difference}
            </td>
            <td className="border border-slate-500">
              {barTotalTipsAndTipOuts.hourly}
            </td>
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
