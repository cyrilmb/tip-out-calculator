export const SumOfNumbersArr = (tips: number[]) => {
    let sum = 0
    for (let i = 0; i < tips.length; i++) {
      sum += tips[i]
    }
    return sum
  }
  
export const AverageOfNumbersArr = (tips: number[]) => {
    let sum = 0
    let average = 0
    for (let i = 0; i < tips.length; i++) {
      average = (sum += tips[i]) / tips.length
          }
    return average
}
  
//Round prices to 2 decimals 
export const round2Decimal = (num: number) => 
Math.round((num + Number.EPSILON) * 100) / 100