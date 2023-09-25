import { colors } from "@/enums";

export function getRandomColor() {
    const colorValues = Object.values(colors);
    const randomIndex = Math.floor(Math.random() * colorValues.length);
    return colorValues[randomIndex];
  }