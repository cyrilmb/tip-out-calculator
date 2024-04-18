const data = {
    shifts: [
    // Day 1
    {
        position: "Server",
        date: new Date("2024-04-01T08:00:00"),
        am_pm: "AM",
        hoursWorked: 6.5,
        foodSales: 215.32,
        liquorSales: 141.72,
        totalTips: 128.43,
        barTipOut: 9.92,
        expoTipOut: 10.57,
        hostTipOut: 8.31,
    },
    {
        position: "Server",
        date: new Date("2024-04-01T08:00:00"),
        am_pm: "AM",
        hoursWorked: 3.5,
        foodSales: 145.26,
        liquorSales: 98.47,
        totalTips: 93.81,
        barTipOut: 7.25,
        expoTipOut: 7.68,
        hostTipOut: 6.15,
    },
    {
        position: "Bartender",
        date: new Date("2024-04-01T08:00:00"),
        am_pm: "AM",
        hoursWorked: 5.2,
        foodSales: 132.78,
        liquorSales: 215.39,
        totalTips: 175.96,
        bBackTipOut: 13.2,
        expoTipOut: 8.44,
        hostTipOut: 9.82,
    },
    {
        position: "Server",
        date: new Date("2024-04-01T14:00:00"),
        am_pm: "PM",
        hoursWorked: 4.2,
        foodSales: 298.45,
        liquorSales: 208.23,
        totalTips: 255.78,
        barTipOut: 18.05,
        expoTipOut: 14.34,
        hostTipOut: 14.59,
    },
    {
        position: "Server",
        date: new Date("2024-04-01T14:00:00"),
        am_pm: "PM",
        hoursWorked: 5.5,
        foodSales: 200.87,
        liquorSales: 117.65,
        totalTips: 179.62,
        barTipOut: 12.57,
        expoTipOut: 9.24,
        hostTipOut: 7.92,
    },
    {
        position: "Bartender",
        date: new Date("2024-04-01T14:00:00"),
        am_pm: "PM",
        hoursWorked: 7.8,
        foodSales: 142.78,
        liquorSales: 233.21,
        totalTips: 185.96,
        bBackTipOut: 13.95,
        expoTipOut: 7.14,
        hostTipOut: 8.7,
    },
    // Day 2
    {
        position: "Server",
        date: new Date("2024-04-02T08:00:00"),
        am_pm: "AM",
        hoursWorked: 3.6,
        foodSales: 164.82,
        liquorSales: 98.75,
        totalTips: 85.46,
        barTipOut: 6.09,
        expoTipOut: 8.24,
        hostTipOut: 6.46,
    },
    {
        position: "Server",
        date: new Date("2024-04-02T08:00:00"),
        am_pm: "AM",
        hoursWorked: 5.1,
        foodSales: 245.76,
        liquorSales: 174.39,
        totalTips: 179.28,
        barTipOut: 12.65,
        expoTipOut: 10.94,
        hostTipOut: 8.73,
    },
    {
        position: "Server",
        date: new Date("2024-04-02T08:00:00"),
        am_pm: "AM",
        hoursWorked: 6.2,
        foodSales: 189.52,
        liquorSales: 135.28,
        totalTips: 153.79,
        barTipOut: 10.56,
        expoTipOut: 9.13,
        hostTipOut: 7.61,
    },
    {
        position: "Bartender",
        date: new Date("2024-04-02T08:00:00"),
        am_pm: "AM",
        hoursWorked: 7.8,
        foodSales: 142.78,
        liquorSales: 233.21,
        totalTips: 185.96,
        bBackTipOut: 13.95,
        expoTipOut: 7.14,
        hostTipOut: 8.7,
    },
    {
        position: "Bartender",
        date: new Date("2024-04-02T08:00:00"),
        am_pm: "AM",
        hoursWorked: 5.4,
        foodSales: 215.73,
        liquorSales: 122.84,
        totalTips: 155.64,
        bBackTipOut: 11.67,
        expoTipOut: 7.83,
        hostTipOut: 9.43,
    },
    {
        position: "Server",
        date: new Date("2024-04-02T14:00:00"),
        am_pm: "PM",
        hoursWorked: 7.4,
        foodSales: 395.12,
        liquorSales: 318.57,
        totalTips: 218.75,
        barTipOut: 22.3,
        expoTipOut: 19.78,
        hostTipOut: 15.88,
    },
    {
        position: "Server",
        date: new Date("2024-04-02T14:00:00"),
        am_pm: "PM",
        hoursWorked: 5.5,
        foodSales: 212.98,
        liquorSales: 154.76,
        totalTips: 183.24,
        barTipOut: 14.25,
        expoTipOut: 10.38,
        hostTipOut: 9.45,
    },
    {
        position: "Bartender",
        date: new Date("2024-04-02T14:00:00"),
        am_pm: "PM",
        hoursWorked: 5.2,
        foodSales: 236.41,
        liquorSales: 89.37,
        totalTips: 115.67,
        bBackTipOut: 8.67,
        expoTipOut: 11.82,
        hostTipOut: 9.62,
    },
    // Day 3
    {
        position: "Server",
        date: new Date("2024-04-03T08:00:00"),
        am_pm: "AM",
        hoursWorked: 6.8,
        foodSales: 178.33,
        liquorSales: 343.72,
        totalTips: 218.35,
        barTipOut: 24.06,
        expoTipOut: 8.92,
        hostTipOut: 10.34,
    },
    {
        position: "Server",
        date: new Date("2024-04-03T08:00:00"),
        am_pm: "AM",
        hoursWorked: 4.5,
        foodSales: 207.69,
        liquorSales: 138.47,
        totalTips: 159.73,
        barTipOut: 11.18,
        expoTipOut: 9.64,
        hostTipOut: 7.79,
    },
    {
        position: "Server",
        date: new Date("2024-04-03T08:00:00"),
        am_pm: "AM",
        hoursWorked: 7.1,
        foodSales: 298.46,
        liquorSales: 214.32,
        totalTips: 195.64,
        barTipOut: 16.92,
        expoTipOut: 14.38,
        hostTipOut: 11.26,
    },
    {
        position: "Bartender",
        date: new Date("2024-04-03T08:00:00"),
        am_pm: "AM",
        hoursWorked: 6.3,
        foodSales: 184.52,
        liquorSales: 293.21,
        totalTips: 235.87,
        bBackTipOut: 17.69,
        expoTipOut: 9.32,
        hostTipOut: 10.72,
    },
    {
        position: "Bartender",
        date: new Date("2024-04-03T08:00:00"),
        am_pm: "AM",
        hoursWorked: 3.7,
        foodSales: 132.89,
        liquorSales: 167.25,
        totalTips: 145.32,
        bBackTipOut: 10.9,
        expoTipOut: 7.12,
        hostTipOut: 8.25,
    },
    {
        position: "Server",
        date: new Date("2024-04-03T14:00:00"),
        am_pm: "PM",
        hoursWorked: 7.3,
        foodSales: 278.14,
        liquorSales: 408.19,
        totalTips: 291.76,
        barTipOut: 27.48,
        expoTipOut: 14.69,
        hostTipOut: 15.48,
    },
    {
        position: "Server",
        date: new Date("2024-04-03T14:00:00"),
        am_pm: "PM",
        hoursWorked: 5.2,
        foodSales: 197.85,
        liquorSales: 142.59,
        totalTips: 185.46,
        barTipOut: 12.95,
        expoTipOut: 10.87,
        hostTipOut: 8.92,
    },
    {
        position: "Bartender",
        date: new Date("2024-04-03T14:00:00"),
        am_pm: "PM",
        hoursWorked: 4.1,
        foodSales: 119.87,
        liquorSales: 287.66,
        totalTips: 173.82,
        bBackTipOut: 13.04,
        expoTipOut: 5.99,
        hostTipOut: 8.12,
    },
    // Day 4
    {
        position: "Server",
        date: new Date("2024-04-04T08:00:00"),
        am_pm: "AM",
        hoursWorked: 7.1,
        foodSales: 353.21,
        liquorSales: 157.89,
        totalTips: 156.29,
        barTipOut: 11.62,
        expoTipOut: 17.66,
        hostTipOut: 12.17,
    },
    {
        position: "Server",
        date: new Date("2024-04-04T08:00:00"),
        am_pm: "AM",
        hoursWorked: 6.4,
        foodSales: 299.87,
        liquorSales: 218.65,
        totalTips: 215.76,
        barTipOut: 15.17,
        expoTipOut: 13.86,
        hostTipOut: 10.78,
    },
    {
        position: "Server",
        date: new Date("2024-04-04T08:00:00"),
        am_pm: "AM",
        hoursWorked: 5.7,
        foodSales: 278.93,
        liquorSales: 183.24,
        totalTips: 189.73,
        barTipOut: 13.28,
        expoTipOut: 11.92,
        hostTipOut: 9.37,
    },
    {
        position: "Bartender",
        date: new Date("2024-04-04T08:00:00"),
        am_pm: "AM",
        hoursWorked: 7.6,
        foodSales: 192.32,
        liquorSales: 483.89,
        totalTips: 321.47,
        bBackTipOut: 24.11,
        expoTipOut: 10.17,
        hostTipOut: 16.11,
    },
    {
        position: "Bartender",
        date: new Date("2024-04-04T08:00:00"),
        am_pm: "AM",
        hoursWorked: 6.8,
        foodSales: 276.45,
        liquorSales: 184.32,
        totalTips: 245.32,
        bBackTipOut: 18.4,
        expoTipOut: 9.84,
        hostTipOut: 11.25,
    },
    {
        position: "Server",
        date: new Date("2024-04-04T14:00:00"),
        am_pm: "PM",
        hoursWorked: 5.5,
        foodSales: 196.78,
        liquorSales: 413.65,
        totalTips: 273.45,
        barTipOut: 24.95,
        expoTipOut: 11.04,
        hostTipOut: 11.67,
    },
    {
        position: "Server",
        date: new Date("2024-04-04T14:00:00"),
        am_pm: "PM",
        hoursWorked: 4.3,
        foodSales: 298.43,
        liquorSales: 284.21,
        totalTips: 144.75,
        barTipOut: 20.89,
        expoTipOut: 12.92,
        hostTipOut: 11.22,
    },
    {
        position: "Server",
        date: new Date("2024-04-04T14:00:00"),
        am_pm: "PM",
        hoursWorked: 6.2,
        foodSales: 237.65,
        liquorSales: 142.89,
        totalTips: 198.56,
        barTipOut: 15.72,
        expoTipOut: 9.83,
        hostTipOut: 8.42,
    },
    {
        position: "Bartender",
        date: new Date("2024-04-04T14:00:00"),
        am_pm: "PM",
        hoursWorked: 7.6,
        foodSales: 192.32,
        liquorSales: 483.89,
        totalTips: 321.47,
        bBackTipOut: 24.11,
        expoTipOut: 10.17,
        hostTipOut: 16.11,
    },
    // Day 5
    {
        position: "Server",
        date: new Date("2024-04-05T08:00:00"),
        am_pm: "AM",
        hoursWorked: 3.2,
        foodSales: 127.56,
        liquorSales: 478.29,
        totalTips: 227.36,
        barTipOut: 33.62,
        expoTipOut: 4.57,
        hostTipOut: 13.35,
    },
    {
        position: "Server",
        date: new Date("2024-04-05T08:00:00"),
        am_pm: "AM",
        hoursWorked: 2.8,
        foodSales: 98.76,
        liquorSales: 165.43,
        totalTips: 112.67,
        barTipOut: 7.95,
        expoTipOut: 5.28,
        hostTipOut: 8.11,
    },
    {
        position: "Server",
        date: new Date("2024-04-05T08:00:00"),
        am_pm: "AM",
        hoursWorked: 4.9,
        foodSales: 156.32,
        liquorSales: 118.67,
        totalTips: 138.56,
        barTipOut: 9.72,
        expoTipOut: 7.44,
        hostTipOut: 6.82,
    },
    {
        position: "Bartender",
        date: new Date("2024-04-05T08:00:00"),
        am_pm: "AM",
        hoursWorked: 6.1,
        foodSales: 209.43,
        liquorSales: 267.89,
        totalTips: 187.32,
        bBackTipOut: 14.04,
        expoTipOut: 8.62,
        hostTipOut: 10.28,
    },
    {
        position: "Bartender",
        date: new Date("2024-04-05T08:00:00"),
        am_pm: "AM",
        hoursWorked: 5.4,
        foodSales: 185.43,
        liquorSales: 189.32,
        totalTips: 163.75,
        bBackTipOut: 12.28,
        expoTipOut: 7.94,
        hostTipOut: 9.87,
    },
    {
        position: "Server",
        date: new Date("2024-04-05T14:00:00"),
        am_pm: "PM",
        hoursWorked: 6.7,
        foodSales: 430.67,
        liquorSales: 129.87,
        totalTips: 169.85,
        barTipOut: 9.33,
        expoTipOut: 22.63,
        hostTipOut: 12.89,
    },
    {
        position: "Server",
        date: new Date("2024-04-05T14:00:00"),
        am_pm: "PM",
        hoursWorked: 7.7,
        foodSales: 208.74,
        liquorSales: 212.89,
        totalTips: 112.56,
        barTipOut: 14.83,
        expoTipOut: 9.23,
        hostTipOut: 7.66,
    },
    {
        position: "Bartender",
        date: new Date("2024-04-05T14:00:00"),
        am_pm: "PM",
        hoursWorked: 2.8,
        foodSales: 393.21,
        liquorSales: 229.47,
        totalTips: 98.75,
        bBackTipOut: 7.37,
        expoTipOut: 18.12,
        hostTipOut: 12.33,
    }
]
}

export default data