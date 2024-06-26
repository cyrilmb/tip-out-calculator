import React from 'react'
import { round2Decimal } from '@/lib/utils'

interface DataSummariesProps {
  dateSelection: string[]
  data: Shift[]
}

interface Shift {
  position: string
  date: string
  hoursWorked: number
  foodSales?: number
  liquorSales?: number
  totalTips?: number
  barTipOut?: number
  bBackTipOut?: number
  expoTipOut?: number
  hostTipOut?: number
}

const DataSummaries: React.FC<DataSummariesProps> = ({
  dateSelection,
  data,
}) => {
  // Filter selected dates from ALL DATA
  function filterByDates(data: Shift[], dateSelection: string[]): Shift[] {
    return data.filter((shift) => {
      // Parse shift date string into a Date object
      const shiftDate = new Date(shift.date)

      // Format the date as "Month Day"
      const shiftDateFormatted = shiftDate.toLocaleDateString('en-us', {
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
          return accumulator + (shift.totalTips || 0)
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
      filteredData.reduce((acc, shift) => {
        if (shift.position === 'Server' || shift.position === 'Bartender') {
          return acc + Number(shift[tipOut] ?? 0)
        }
        return acc
      }, 0)
    )
  }
  const hostTips = supportStaffTipOuts('hostTipOut')
  const expoTips = supportStaffTipOuts('expoTipOut')
  const bBackTips = supportStaffTipOuts('bBackTipOut')

  //calculate the percentage of relevent sales/tips that leads are tipping out support staff
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
        return acc + (shift.foodSales || 0)
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
        return acc + (shift.foodSales || 0) + (shift.liquorSales || 0)
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

  //calculate the percentage of total tips that leads are tipping out,
  //tips after tipouts, and tips per hour worked
  function totalTipsAndTipOuts(
    position: 'Bartender' | 'Server',
    filteredData: Shift[]
  ): { percentage: number; difference: number; hourly: number } {
    const filteredShifts = filteredData.filter(
      (shift) => shift.position === position
    )

    const totalTips = filteredShifts.reduce(
      (acc, shift) => acc + (shift.totalTips || 0),
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

    const BarTipOut = round2Decimal(
      filteredData.reduce((acc, shift) => {
        return (
          acc +
          (shift.position === 'Server' && shift.barTipOut ? shift.barTipOut : 0)
        )
      }, 0)
    )

    const hours = filteredShifts.reduce((acc, shift) => {
      return acc + shift.hoursWorked
    }, 0)

    if (totalTips === 0) {
      return { percentage: 0, difference: 0, hourly: 0 }
    }

    const percentage = round2Decimal((totalTipOuts / totalTips) * 100)

    let difference
    if (position === 'Bartender') {
      difference = round2Decimal(totalTips - totalTipOuts) + BarTipOut
    } else {
      difference = round2Decimal(totalTips - totalTipOuts)
    }

    const hourly = round2Decimal(difference / hours)

    return { percentage, difference, hourly }
  }

  const barTotalTipsAndTipOuts = totalTipsAndTipOuts('Bartender', filteredData)
  const serverTotalTipsAndTipOuts = totalTipsAndTipOuts('Server', filteredData)

  //calculate the tips/hour for support staff
  function supportStaffTipsHourly(
    position: 'Host' | 'Expo' | 'Barback',
    filteredData: Shift[]
  ): number {
    const supportShifts = filteredData.filter(
      (shift) => shift.position === position
    )
    const bartenderServerShifts = filteredData.filter(
      (shift) => shift.position === 'Bartender' || shift.position === 'Server'
    )

    let totalTipOut: number = 0

    switch (position) {
      case 'Host':
        totalTipOut = bartenderServerShifts.reduce((acc, shift) => {
          return acc + (shift.hostTipOut || 0)
        }, 0)
        break
      case 'Expo':
        totalTipOut = bartenderServerShifts.reduce((acc, shift) => {
          return acc + (shift.expoTipOut || 0)
        }, 0)
        break
      case 'Barback':
        totalTipOut = bartenderServerShifts.reduce((acc, shift) => {
          return acc + (shift.bBackTipOut || 0)
        }, 0)
        break
      default:
        break
    }

    const totalHours = supportShifts.reduce((acc, shift) => {
      if (shift.position === position) {
        return acc + shift.hoursWorked
      }
      return acc
    }, 0)

    const hourly =
      totalHours !== 0 ? round2Decimal(totalTipOut / totalHours) : 0

    return hourly
  }

  const hostHourly = supportStaffTipsHourly('Host', filteredData)
  const expoHourly = supportStaffTipsHourly('Expo', filteredData)
  const bBackHourly = supportStaffTipsHourly('Barback', filteredData)

  return (
    <div className="p-5">
      <h2 className="text-lg">Current Distribution</h2>
      <table className="auto">
        <thead>
          <tr>
            <th className="border border-slate-500">Position</th>
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
            <td className="border border-slate-500"></td>
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
            <td className="border border-slate-500"></td>
            <td className="border border-slate-500"></td>
            <td className="border border-slate-500"></td>
            <td className="border border-slate-500"></td>
            <td className="border border-slate-500"></td>
            <td className="border border-slate-500"></td>
            <td className="border border-slate-500">{hostHourly}</td>
          </tr>
          <tr>
            <td className="border border-slate-500">Expo</td>
            <td className="border border-slate-500">{expoTips}</td>
            <td className="border border-slate-500"></td>
            <td className="border border-slate-500"></td>
            <td className="border border-slate-500"></td>
            <td className="border border-slate-500"></td>
            <td className="border border-slate-500"></td>
            <td className="border border-slate-500"></td>
            <td className="border border-slate-500">{expoHourly}</td>
          </tr>
          <tr>
            <td className="border border-slate-500">Barback</td>
            <td className="border border-slate-500">{bBackTips}</td>
            <td className="border border-slate-500"></td>
            <td className="border border-slate-500"></td>
            <td className="border border-slate-500"></td>
            <td className="border border-slate-500"></td>
            <td className="border border-slate-500"></td>
            <td className="border border-slate-500"></td>
            <td className="border border-slate-500">{bBackHourly}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default DataSummaries
