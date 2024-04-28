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

    const serverBarHourly = round2Decimal(pointValue)
    const supportStaffHourly = round2Decimal(pointValue / 2)

    return {
      pooledTips,
      serverBarHours,
      supportStaffHours,
      serverBarHourly,
      supportStaffHourly,
    }
  }

  function exampleShifts(filteredData: Shift[]): {
    mostHours: Shift | null
    mostHoursIndividualTakeHome: number
    mostHoursPooledTakeHome: number
    medianHours: Shift | null
    medianHoursIndividualTakeHome: number
    medianHoursPooledTakeHome: number
    leastHours: Shift | null
    leastHoursIndividualTakeHome: number
    leastHoursPooledTakeHome: number
  } {
    // Initialize variables
    let mostHoursShift: Shift | null = null
    let mostHoursIndividualTakeHome = 0
    let mostHoursPooledTakeHome = 0
    let mostHoursWorked: number = 0
    let medianHoursShift: Shift | null = null
    let medianHoursIndividualTakeHome = 0
    let medianHoursPooledTakeHome = 0
    let medianHoursWorked: number = 0
    let leastHoursShift: Shift | null = null
    let leastHoursIndividualTakeHome = 0
    let leastHoursPooledTakeHome = 0
    let leastHoursWorked: number = 0

    // Variables for calculating pooled take-home
    let sumOfTotalTips = 0
    let sumOfTotalHours = 0
    let sumOfServersAndBartendersHours = 0
    let sumOfBarbacksExposHostsHours = 0

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

    const hostPayRate: number = 0.3
    const expoPayRate: number = 0.5
    const bBackPayRate: number = 0.5

    function poolTipsPointValue(sampleShift: Shift): number {
      //Total tips for the day
      const dailyTips = filteredData.reduce((acc, shift) => {
        if (shift.date === sampleShift.date) {
          return (acc += shift.totalTips || 0)
        }
        return acc
      }, 0)
      //Total hours worked in day
      const dailyHours = filteredData.reduce((acc, shift) => {
        // Check if shift date matches the sample shift date
        if (shift.date === sampleShift.date) {
          switch (shift.position) {
            case 'Server':
            case 'Bartender':
              // Add hours worked for server or bartender directly to accumulator
              acc += shift.hoursWorked || 0
              break
            case 'Host':
              // Multiply host hours by host pay rate and then add to accumulator
              acc += (shift.hoursWorked || 0) * hostPayRate
              break
            case 'Expo':
              // Multiply expo hours by expo pay rate and then add to accumulator
              acc += (shift.hoursWorked || 0) * expoPayRate
              break
            case 'Barback':
              // Multiply barback hours by barback pay rate and then add to accumulator
              acc += (shift.hoursWorked || 0) * bBackPayRate
              break
            default:
              // For any other position, do not add hours to accumulator
              break
          }
        }
        return acc
      }, 0)
      return dailyTips / dailyHours
    }

    mostHoursShift
      ? (mostHoursPooledTakeHome = round2Decimal(
          poolTipsPointValue(medianHoursShift) * mostHoursShift.hoursWorked
        ))
      : (mostHoursPooledTakeHome = 0)

    leastHoursShift
      ? (leastHoursPooledTakeHome = round2Decimal(
          poolTipsPointValue(medianHoursShift) * leastHoursShift.hoursWorked
        ))
      : (leastHoursPooledTakeHome = 0)

    medianHoursShift
      ? (medianHoursPooledTakeHome = round2Decimal(
          poolTipsPointValue(medianHoursShift) * medianHoursShift.hoursWorked
        ))
      : (medianHoursPooledTakeHome = 0)

    return {
      mostHours: mostHoursShift,
      mostHoursIndividualTakeHome: mostHoursIndividualTakeHome,
      mostHoursPooledTakeHome: mostHoursPooledTakeHome,
      medianHours: medianHoursShift,
      medianHoursIndividualTakeHome: medianHoursIndividualTakeHome,
      medianHoursPooledTakeHome: medianHoursPooledTakeHome,
      leastHours: leastHoursShift,
      leastHoursIndividualTakeHome: leastHoursIndividualTakeHome,
      leastHoursPooledTakeHome: leastHoursPooledTakeHome,
    }
  }

  return (
    <div className="p-5">
      <h2 className="text-lg">Proposed Pool</h2>
      <div className="p-5">
        <ul>
          <li>Every server/bartender gets one point per hour worked.</li>
          <li>Every support staff gets half a point per hour worked.</li>
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
              <th className="border border-slate-500">Server/Tender</th>
              <th className="border border-slate-500">Host</th>
              <th className="border border-slate-500">Expo</th>
              <th className="border border-slate-500">Barback</th>
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
      <div className="pt-5">
        <h2 className="text-lg">Sample Shifts</h2>
        <table className="auto">
          <thead>
            <tr>
              <th className="border border-slate-500">Shift</th>
              <th className="border border-slate-500">Actual Take Home Tips</th>
              <th className="border border-slate-500">Pooled Take Home Tips</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-500">Most Hours</td>
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
                {exampleShifts(filteredData).medianHoursIndividualTakeHome}
              </td>
              <td className="border border-slate-500">
                {exampleShifts(filteredData).medianHoursPooledTakeHome}
              </td>
            </tr>
            <tr>
              <td className="border border-slate-500">Least Hours</td>
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
