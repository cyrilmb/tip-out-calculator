import { Shift } from './ShiftEntryModel';

function generateRandomNumber(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

function generateRandomDate(): Date {
    const startDate = new Date('2024-04-01');
    const endDate = new Date('2024-04-30');
    return new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
}

function generateRandomEntry(position: string): Shift {
    const date = generateRandomDate();
    const hoursWorked = generateRandomNumber(1, 8);
    const foodSales = generateRandomNumber(50, 500);
    const liquorSales = generateRandomNumber(50, 500);
    const totalSales = foodSales + liquorSales;
    const totalTips = generateRandomNumber(45, 375);
    let barTipOut;
    let bBackTipOut;
    let expoTipOut;
    let hostTipOut;

    if (position === 'Server') {
        barTipOut = liquorSales * 0.07;
    } else if (position === 'Bartender') {
        bBackTipOut = totalTips * 0.075;
    }

    expoTipOut = foodSales * 0.05;
    hostTipOut = totalSales * 0.02;

    return {
        position,
        date,
        hoursWorked,
        foodSales,
        liquorSales,
        totalTips,
        barTipOut,
        bBackTipOut,
        expoTipOut,
        hostTipOut,
    };
}

function generateData(): Shift[] {
    const data: Shift[] = [];
    const positions = ['Server', 'Server', 'Bartender'];

    for (let i = 0; i < 3; i++) {
        positions.forEach((position) => {
            data.push(generateRandomEntry(position));
        });
    }

    positions.push('Server', 'Server', 'Server', 'Bartender', 'Bartender');

    for (let i = 0; i < 2; i++) {
        positions.forEach((position) => {
            data.push(generateRandomEntry(position));
        });
    }

    return data;
}

const entries = generateData();
console.log(entries);
