import ShiftsTableView from '@/components/ShiftsTableView'
import DateSelection from '@/components/DateSelection'

export default function Home() {
  return (
    <main>
      <DateSelection />
      <ShiftsTableView />
    </main>
  )
}
