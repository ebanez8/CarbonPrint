import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function debounce(func: (...args: any[]) => void, wait: number) {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function parseQuantity(quantity: string): number {
  const match = quantity.match(/(\d+(\.\d+)?)\s*(g|kg|ml|l)/i);
  if (!match) return 0;

  const value = parseFloat(match[1]);
  const unit = match[3].toLowerCase();

  switch (unit) {
    case "kg":
    case "l":
      return value * 1000;
    case "g":
    case "ml":
    default:
      return value;
  }
}
