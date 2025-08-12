import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function hourlyToYearly(hourlyRateNZD: number, hoursPerWeek = 40, weeksPerYear = 52): number {
  return Math.round(hourlyRateNZD * hoursPerWeek * weeksPerYear)
}

export function roundToNearest5(n: number): number {
  return Math.round(n / 5) * 5
}
