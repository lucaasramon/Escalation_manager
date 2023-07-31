import { randomBytes } from 'crypto';

export function generateUniqueNumber(min: number, max: number) {
  const byteArray = randomBytes(4);
  const randomValue = byteArray.readUInt32BE(0);
  return min + (randomValue % (max - min + 1));
}
