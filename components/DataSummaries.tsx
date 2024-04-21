import React from 'react'

interface DataSummariesProps {
  dateSelection: string[]
  data: Shift[]
}

interface Shift {
  position: string
  date: Date
  // Other properties of Shift
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
  console.log(filteredData)
  return (
    <div>
      <table className="auto">
        <thead>
          <tr>
            <th className="border border-slate-500">Position</th>
            <th className="border border-slate-500">Total Tips</th>
            <th className="border border-slate-500">Tips/Hour</th>
            <th className="border border-slate-500">
              % of Tips to Support Staff
            </th>
            <th className="border border-slate-500">% Sales to Host</th>
            <th className="border border-slate-500">% Food Sales to Expo</th>
            <th className="border border-slate-500">% Liquor Sales to Bar</th>
            <th className="border border-slate-500">
              % Tips to Barback (after tip outs)
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-slate-500">Server</td>
          </tr>
          <tr>
            <td className="border border-slate-500">Bartender</td>
          </tr>
          <tr>
            <td className="border border-slate-500">Host</td>
          </tr>
          <tr>
            <td className="border border-slate-500">Expo</td>
          </tr>
          <tr>
            <td className="border border-slate-500">Barback</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default DataSummaries
