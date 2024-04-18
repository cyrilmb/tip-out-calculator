export type Entry = {
    position: string
    date: Date
    am_pm: string
    hoursWorked: number
    foodSales: number
    liquorSales: number
    totalTips: number
    barTipOut?: number
    bBackTipOut?: number
    expoTipOut?: number
    hostTipOut?: number
}