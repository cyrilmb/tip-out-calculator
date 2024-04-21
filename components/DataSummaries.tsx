import React from 'react'

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

  const serverTips = filteredData.reduce((accumulator, shift) => {
    if (shift.position === 'Server') {
      return accumulator + shift.totalTips
    }
    return accumulator
  }, 0)

  const bartenderTips = filteredData.reduce((accumulator, shift) => {
    if (shift.position === 'Bartender') {
      return accumulator + shift.totalTips
    }
    return accumulator
  }, 0)

  const hostTips = filteredData.reduce((accumulator, shift) => {
    if (shift.position === 'Server' || shift.position === 'Bartender') {
      return accumulator + (shift.hostTipOut ?? 0)
    }
    return accumulator
  }, 0)

  const expoTips = filteredData.reduce((accumulator, shift) => {
    if (shift.position === 'Server' || shift.position === 'Bartender') {
      return accumulator + (shift.expoTipOut ?? 0)
    }
    return accumulator
  }, 0)

  const bBackTips = filteredData.reduce((accumulator, shift) => {
    if (shift.position === 'Server' || shift.position === 'Bartender') {
      return accumulator + (shift.bBackTipOut ?? 0)
    }
    return accumulator
  }, 0)

  return (
    <div>
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
