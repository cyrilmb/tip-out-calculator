import React, { useState } from 'react'
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

const PoolProposal: React.FC<DataSummariesProps> = ({
  dateSelection,
  data,
}) => {
  // Filter selected dates from ALL DATA
function filterByDates(data: Shift[], dateSelection: string[]): Shift[] {
  return data.filter((shift) => {
    // Parse shift date string into a Date object
    const shiftDate = new Date(shift.date);

    // Format the date as "Month Day"
    const shiftDateFormatted = shiftDate.toLocaleDateString('en-us', {
      month: 'short',
      day: 'numeric',
    });

    // Check if the formatted date is included in selected dates
    return dateSelection.includes(shiftDateFormatted);
  });
}
  // Use the filtered data
  const filteredData = filterByDates(data, dateSelection)

  //Payrates for support staff - multiplies against their hours worked to calculate final point value
  // State variables for pay rates
  const [hostPayRate, setHostPayRate] = useState<number>(0.3)
  const [expoPayRate, setExpoPayRate] = useState<number>(0.5)
  const [bBackPayRate, setBBackPayRate] = useState<number>(0.5)

  // Handlers to adjust pay rates
  const handleHostPayRateChange = (value: number) => {
    setHostPayRate(value)
  }

  const handleExpoPayRateChange = (value: number) => {
    setExpoPayRate(value)
  }

  const handleBBackPayRateChange = (value: number) => {
    setBBackPayRate(value)
  }

  //Pool all tips, calculate hours worked and percentage of tips owed
  const bartenderServerShifts = filteredData.filter(
    (shift) => shift.position === 'Bartender' || shift.position === 'Server'
  )
  const hostShifts = filteredData.filter((shift) => shift.position === 'Host')
  const expoShifts = filteredData.filter((shift) => shift.position === 'Expo')
  const bBackShifts = filteredData.filter(
    (shift) => shift.position === 'Barback'
  )

  const pooledTips = filteredData.reduce((acc, shift) => {
    return acc + (shift.totalTips || 0)
  }, 0)

  const serverBarHours = round2Decimal(
    bartenderServerShifts.reduce((acc, shift) => {
      return acc + (shift.hoursWorked || 0)
    }, 0)
  )

  const hostHours = round2Decimal(
    hostShifts.reduce((acc, shift) => {
      return acc + (shift.hoursWorked || 0)
    }, 0)
  )
  const expoHours = round2Decimal(
    expoShifts.reduce((acc, shift) => {
      return acc + (shift.hoursWorked || 0)
    }, 0)
  )
  const bBackHours = round2Decimal(
    bBackShifts.reduce((acc, shift) => {
      return acc + (shift.hoursWorked || 0)
    }, 0)
  )
  //Servers/tenders get one point per hour worked.
  //Supportstaff gets half a point per hour worked.
  //Value of a point is total pooled tips divided by number of points for given days
  const pointValue =
    pooledTips /
    (serverBarHours +
      hostHours * hostPayRate +
      expoHours * expoPayRate +
      bBackHours * bBackPayRate)

  const serverBarHourly = isNaN(pointValue) ? 0 : round2Decimal(pointValue)
  const hostHourly = isNaN(pointValue)
    ? 0
    : round2Decimal(pointValue * hostPayRate)
  const expoHourly = isNaN(pointValue)
    ? 0
    : round2Decimal(pointValue * expoPayRate)
  const bBackHourly = isNaN(pointValue)
    ? 0
    : round2Decimal(pointValue * bBackPayRate)

  function calculatePointValue(sampleShift: Shift): number {
    // Filter shifts for each position
    const bartenderServerShifts = filteredData.filter(
      (shift) => shift.position === 'Bartender' || shift.position === 'Server'
    )
    const hostShifts = filteredData.filter((shift) => shift.position === 'Host')
    const expoShifts = filteredData.filter((shift) => shift.position === 'Expo')
    const bBackShifts = filteredData.filter(
      (shift) => shift.position === 'Barback'
    )

    // Calculate pooled tips
    const pooledTips = filteredData.reduce((acc, shift) => {
      return acc + (shift.totalTips || 0)
    }, 0)

    // Calculate total hours worked for each position
    const serverBarHours = bartenderServerShifts.reduce((acc, shift) => {
      return acc + (shift.hoursWorked || 0)
    }, 0)

    const hostHours = hostShifts.reduce((acc, shift) => {
      return acc + (shift.hoursWorked || 0)
    }, 0)

    const expoHours = expoShifts.reduce((acc, shift) => {
      return acc + (shift.hoursWorked || 0)
    }, 0)

    const bBackHours = bBackShifts.reduce((acc, shift) => {
      return acc + (shift.hoursWorked || 0)
    }, 0)

    // Calculate point value
    const pointValue =
      pooledTips /
      (serverBarHours +
        hostHours * hostPayRate +
        expoHours * expoPayRate +
        bBackHours * bBackPayRate)

    return pointValue
  }

  function exampleShifts(filteredData: Shift[]): {
    mostHours: Shift | null
    mostHoursIndividualTakeHome: number
    mostHoursPooledTakeHome: number
    mostHoursWorked: number
    medianHours: Shift | null
    medianHoursIndividualTakeHome: number
    medianHoursPooledTakeHome: number
    medianHoursWorked: number
    leastHours: Shift | null
    leastHoursIndividualTakeHome: number
    leastHoursPooledTakeHome: number
    leastHoursWorked: number
  } {
    // Initialize variables
    let mostHoursShift: Shift | null = null
    let mostHoursIndividualTakeHome = 0
    let mostHoursPooledTakeHome = 0
    let mostHoursWorked = 0
    let medianHoursShift: Shift | null = null
    let medianHoursIndividualTakeHome = 0
    let medianHoursPooledTakeHome = 0
    let medianHoursWorked = 0
    let leastHoursShift: Shift | null = null
    let leastHoursIndividualTakeHome = 0
    let leastHoursPooledTakeHome = 0
    let leastHoursWorked = 0
    // Find the shifts with most, least and median hours worked from selected dates
    //Most hours worked example
    mostHoursShift = filteredData.reduce(
      (mostShift: Shift | null, shift: Shift) => {
        if (
          (shift.position === 'Server' || shift.position === 'Bartender') &&
          (!mostShift || shift.hoursWorked > (mostShift?.hoursWorked || 0))
        ) {
          return shift
        }
        return mostShift
      },
      null
    )
    // console.log('Most: ', mostHoursShift?.hoursWorked || 0)
    //subtract tipouts for take home amount
    const mostTipOut =
      (mostHoursShift?.position === 'Server' ||
      mostHoursShift?.position === 'Bartender'
        ? mostHoursShift?.bBackTipOut || 0
        : 0) +
      (mostHoursShift?.position === 'Server' ||
      mostHoursShift?.position === 'Bartender'
        ? mostHoursShift?.barTipOut || 0
        : 0) +
      (mostHoursShift?.position === 'Server' ||
      mostHoursShift?.position === 'Bartender'
        ? mostHoursShift?.expoTipOut || 0
        : 0) +
      (mostHoursShift?.position === 'Server' ||
      mostHoursShift?.position === 'Bartender'
        ? mostHoursShift?.hostTipOut || 0
        : 0)

    mostHoursIndividualTakeHome = round2Decimal(
      (mostHoursShift?.totalTips || 0) - mostTipOut
    )

    //Least hours worked example
    leastHoursShift = filteredData.reduce(
      (leastShift: Shift | null, shift: Shift) => {
        if (
          (shift.position === 'Server' || shift.position === 'Bartender') &&
          (!leastShift || shift.hoursWorked < (leastShift?.hoursWorked || 0))
        ) {
          return shift
        }
        return leastShift
      },
      null
    )

    // console.log('Least: ', leastHoursShift ? leastHoursShift.hoursWorked : 0)
    //subtract tipouts for take home amount
    const leastTipOut =
      (leastHoursShift?.position === 'Server' ||
      leastHoursShift?.position === 'Bartender'
        ? leastHoursShift?.bBackTipOut || 0
        : 0) +
      (leastHoursShift?.position === 'Server' ||
      leastHoursShift?.position === 'Bartender'
        ? leastHoursShift?.barTipOut || 0
        : 0) +
      (leastHoursShift?.position === 'Server' ||
      leastHoursShift?.position === 'Bartender'
        ? leastHoursShift?.expoTipOut || 0
        : 0) +
      (leastHoursShift?.position === 'Server' ||
      leastHoursShift?.position === 'Bartender'
        ? leastHoursShift?.hostTipOut || 0
        : 0)

    leastHoursIndividualTakeHome = round2Decimal(
      (leastHoursShift?.totalTips || 0) - leastTipOut
    )

    //Median hours worked example
    const sortedShifts = filteredData
      .filter(
        (shift) => shift.position === 'Server' || shift.position === 'Bartender'
      )
      .slice()
      .sort((a, b) => a.hoursWorked - b.hoursWorked)
    const medianIndex = Math.floor(sortedShifts.length / 2)
    medianHoursShift = sortedShifts[medianIndex]

    // console.log('Median: ', medianHoursShift?.hoursWorked)

    //subtract tipouts for take home amount
    const medianTipOut =
      (medianHoursShift?.position === 'Server' ||
      medianHoursShift?.position === 'Bartender'
        ? medianHoursShift?.bBackTipOut || 0
        : 0) +
      (medianHoursShift?.position === 'Server' ||
      medianHoursShift?.position === 'Bartender'
        ? medianHoursShift?.barTipOut || 0
        : 0) +
      (medianHoursShift?.position === 'Server' ||
      medianHoursShift?.position === 'Bartender'
        ? medianHoursShift?.expoTipOut || 0
        : 0) +
      (medianHoursShift?.position === 'Server' ||
      medianHoursShift?.position === 'Bartender'
        ? medianHoursShift?.hostTipOut || 0
        : 0)

    medianHoursIndividualTakeHome = round2Decimal(
      (medianHoursShift?.totalTips || 0) - medianTipOut
    )

    //Tracking the hours worked on sample shifts
    mostHoursWorked = mostHoursShift?.hoursWorked || 0
    leastHoursWorked = leastHoursShift?.hoursWorked || 0
    medianHoursWorked = medianHoursShift?.hoursWorked || 0

    mostHoursShift
      ? (mostHoursPooledTakeHome = round2Decimal(
          calculatePointValue(medianHoursShift) * mostHoursShift.hoursWorked
        ))
      : (mostHoursPooledTakeHome = 0)

    leastHoursShift
      ? (leastHoursPooledTakeHome = round2Decimal(
          calculatePointValue(medianHoursShift) * leastHoursShift.hoursWorked
        ))
      : (leastHoursPooledTakeHome = 0)

    medianHoursShift
      ? (medianHoursPooledTakeHome = round2Decimal(
          calculatePointValue(medianHoursShift) * medianHoursShift.hoursWorked
        ))
      : (medianHoursPooledTakeHome = 0)

    return {
      mostHours: mostHoursShift,
      mostHoursIndividualTakeHome: mostHoursIndividualTakeHome,
      mostHoursPooledTakeHome: mostHoursPooledTakeHome,
      mostHoursWorked: mostHoursWorked,
      medianHours: medianHoursShift,
      medianHoursIndividualTakeHome: medianHoursIndividualTakeHome,
      medianHoursPooledTakeHome: medianHoursPooledTakeHome,
      medianHoursWorked: medianHoursWorked,
      leastHours: leastHoursShift,
      leastHoursIndividualTakeHome: leastHoursIndividualTakeHome,
      leastHoursPooledTakeHome: leastHoursPooledTakeHome,
      leastHoursWorked: leastHoursWorked,
    }
  }

  return (
    <div className="p-5">
      <h2 className="text-lg">Proposed Pool</h2>
      <div className="p-5">
        <ul>
          <li>Every server/bartender gets one point per hour worked.</li>
          <li>
            Support staff gets an adjustable rate less than one point per hour
            worked.
          </li>
          <li>
            All tips are pooled and divided by the total number of points for
            the day.
          </li>
          <li>
            Each employee multiplies their points by the tips/hour ratio. This
            is their tipout for the day.
          </li>
        </ul>
      </div>
      <div>
        <table className="auto">
          <thead>
            <tr>
              <th className="border border-slate-500">Position</th>
              <th className="border border-slate-500">Pooled Tips/Hour</th>
              <th className="border border-slate-500">Hours</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-500">Server/Tender</td>
              <td className="border border-slate-500">
                {serverBarHourly} tips/hour
              </td>
              <td className="border border-slate-500">
                {serverBarHours} hours
              </td>
            </tr>
            <tr>
              <td className="border border-slate-500">Host</td>
              <td className="border border-slate-500">
                {hostHourly} tips/hour
              </td>
              <td className="border border-slate-500">{hostHours} hours</td>
            </tr>
            <tr>
              <td className="border border-slate-500">Expo</td>
              <td className="border border-slate-500">
                {expoHourly} tips/hour
              </td>
              <td className="border border-slate-500">{expoHours} hours</td>
            </tr>
            <tr>
              <td className="border border-slate-500">Barback</td>
              <td className="border border-slate-500">
                {bBackHourly} tips/hour
              </td>
              <td className="border border-slate-500">{bBackHours} hours</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        {/* Inputs for adjusting pay rates */}
        <div>
          <label>Host Pay Rate: </label>
          <input
            type="number"
            value={hostPayRate}
            onChange={(e) =>
              handleHostPayRateChange(parseFloat(e.target.value))
            }
            step={0.1}
            min={0}
          />
        </div>
        <div>
          <label>Expo Pay Rate: </label>
          <input
            type="number"
            value={expoPayRate}
            onChange={(e) =>
              handleExpoPayRateChange(parseFloat(e.target.value))
            }
            step={0.1}
            min={0}
          />
        </div>
        <div>
          <label>Barback Pay Rate: </label>
          <input
            type="number"
            value={bBackPayRate}
            onChange={(e) =>
              handleBBackPayRateChange(parseFloat(e.target.value))
            }
            step={0.1}
            min={0}
          />
        </div>
      </div>

      <div className="pt-5">
        <h2 className="text-lg">Sample Server/Bartender Shifts</h2>
        <table className="auto">
          <thead>
            <tr>
              <th className="border border-slate-500">Shift</th>
              <th className="border border-slate-500">Hours Worked</th>
              <th className="border border-slate-500">Actual Take Home Tips</th>
              <th className="border border-slate-500">Pooled Take Home Tips</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-500">Most Hours</td>
              <td className="border border-slate-500">
                {exampleShifts(filteredData).mostHoursWorked}
              </td>
              <td className="border border-slate-500">
                {exampleShifts(filteredData).mostHoursIndividualTakeHome}
              </td>
              <td className="border border-slate-500">
                {exampleShifts(filteredData).mostHoursPooledTakeHome}
              </td>
            </tr>
            <tr>
              <td className="border border-slate-500">Median Hours</td>
              <td className="border border-slate-500">
                {exampleShifts(filteredData).medianHoursWorked}
              </td>

              <td className="border border-slate-500">
                {exampleShifts(filteredData).medianHoursIndividualTakeHome}
              </td>
              <td className="border border-slate-500">
                {exampleShifts(filteredData).medianHoursPooledTakeHome}
              </td>
            </tr>
            <tr>
              <td className="border border-slate-500">Least Hours</td>
              <td className="border border-slate-500">
                {exampleShifts(filteredData).leastHoursWorked}
              </td>

              <td className="border border-slate-500">
                {exampleShifts(filteredData).leastHoursIndividualTakeHome}
              </td>
              <td className="border border-slate-500">
                {exampleShifts(filteredData).leastHoursPooledTakeHome}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default PoolProposal
