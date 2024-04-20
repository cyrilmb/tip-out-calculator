import React from 'react'
import data from '@/lib/data'
import exp from 'constants'

interface DataSummariesProps {
  dateSelection: string[]
}

const DataSummaries: React.FC<DataSummariesProps> = ({ dateSelection }) => {
  return (
    <div>
      <table className="auto">
        <thead>
          <tr>
            <th>Position</th>
            <th>Total Tips</th>
            <th>Tips/Hour</th>
            <th>% Tipped Out</th>
            <th>% Sales to Host</th>
            <th>% Food Sales to Expo</th>
            <th>% Liquor Sales to Bar</th>
            <th>% Tips to Barback (after tip outs)</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Server</td>
          </tr>
          <tr>
            <td>Bartender</td>
          </tr>
          <tr>
            <td>Host</td>
          </tr>
          <tr>
            <td>Expo</td>
          </tr>
          <tr>
            <td>Barback</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default DataSummaries
