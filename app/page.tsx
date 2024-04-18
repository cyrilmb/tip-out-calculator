import data from '@/lib/data'
import ShiftsTable from '@/components/ShiftsTable'

export default function Home() {
  return (
    <main>
      <h1>TABLE of SHIFTS</h1>
      <div>
        {data.shifts.map((shift, i) => (
          <ShiftsTable key={i} shift={shift} />
        ))}
      </div>
    </main>
  )
}
