import React, { useState } from 'react'
import { Shift } from '@/lib/models/ShiftEntryModel'

const ShiftForm: React.FC = () => {
  const [formData, setFormData] = useState<Shift>({
    position: '',
    date: new Date(),
    hoursWorked: 0,
    foodSales: undefined,
    liquorSales: undefined,
    totalTips: undefined,
    barTipOut: undefined,
    bBackTipOut: undefined,
    expoTipOut: undefined,
    hostTipOut: undefined,
  })
  const [shifts, setShifts] = useState<Shift[]>([])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === 'date' ? new Date(value) : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShifts((prevShifts) => [...prevShifts, formData])
    setFormData({
      position: '',
      date: new Date(),
      hoursWorked: 0,
      foodSales: undefined,
      liquorSales: undefined,
      totalTips: undefined,
      barTipOut: undefined,
      bBackTipOut: undefined,
      expoTipOut: undefined,
      hostTipOut: undefined,
    })
  }

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(shifts, null, 2)], {
      type: 'text/plain',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'shift_data.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <h2>Shift Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Position:</label>
          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={formData.date.toISOString().split('T')[0]}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Hours Worked:</label>
          <input
            type="number"
            name="hoursWorked"
            value={formData.hoursWorked}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Food Sales:</label>
          <input
            type="number"
            name="foodSales"
            value={formData.foodSales || ''}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Liquor Sales:</label>
          <input
            type="number"
            name="liquorSales"
            value={formData.liquorSales || ''}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Total Tips:</label>
          <input
            type="number"
            name="totalTips"
            value={formData.totalTips || ''}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Bar Tip Out:</label>
          <input
            type="number"
            name="barTipOut"
            value={formData.barTipOut || ''}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Barback Tip Out:</label>
          <input
            type="number"
            name="bBackTipOut"
            value={formData.bBackTipOut || ''}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Expo Tip Out:</label>
          <input
            type="number"
            name="expoTipOut"
            value={formData.expoTipOut || ''}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Host Tip Out:</label>
          <input
            type="number"
            name="hostTipOut"
            value={formData.hostTipOut || ''}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Add Shift</button>
      </form>
      {shifts.length > 0 && (
        <button onClick={handleDownload}>Download Shift Data</button>
      )}
    </div>
  )
}

export default ShiftForm
