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
  function hostExpoBbackTipOuts(tipOut: keyof Shift) {
    return round2Decimal(
      filteredData.reduce((accumulator, shift) => {
        if (shift.position === 'Server' || shift.position === 'Bartender') {
          return accumulator + Number(shift[tipOut] ?? 0)
        }
        return accumulator
      }, 0)
    )
  }
  const hostTips = hostExpoBbackTipOuts('hostTipOut')
  const expoTips = hostExpoBbackTipOuts('expoTipOut')
  const bBackTips = hostExpoBbackTipOuts('bBackTipOut')

  function tipOutPercentagesOfSales(
    position: string,
    tipOut: number,
    sales: keyof Shift
  ) {
    return
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
