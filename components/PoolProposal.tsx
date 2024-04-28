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
    let medianHoursShift: Shift | null = null
    let medianHoursIndividualTakeHome = 0
    let medianHoursPooledTakeHome = 0
    let leastHoursShift: Shift | null = null
    let leastHoursIndividualTakeHome = 0
    let leastHoursPooledTakeHome = 0

    // Variables for calculating pooled take-home
    let sumOfTotalTips = 0
    let sumOfTotalHours = 0
    let sumOfServersAndBartendersHours = 0
    let sumOfBarbacksExposHostsHours = 0

    // Find the shifts with most, least and median hours worked from selected dates
    mostHoursShift = filteredData.reduce(
      (mostShift: Shift | null, shift: Shift) => {
        if (!mostShift || shift.hoursWorked > (mostShift.hoursWorked || 0)) {
          return shift
        }
        return mostShift
      },
      null
    )

    // console.log(mostHoursShift?.hoursWorked || 0)

    leastHoursShift = filteredData.reduce(
      (leastShift: Shift | null, shift: Shift) => {
        if (
          !leastShift ||
          shift.hoursWorked < (leastShift.hoursWorked || Infinity)
        ) {
          return shift
        }
        return leastShift
      },
      null
    )

    // console.log(leastHoursShift ? leastHoursShift.hoursWorked : 0)

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
