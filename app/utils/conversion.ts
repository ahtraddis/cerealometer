/**
 * Conversion utils
 */

/**
 * @param kilograms Convert kilograms to ounces
 */
export const kilogramsToOunces = (kilograms: number) => {
  return (kilograms * 2.2046 * 16.0);
}

export const gramsToOunces = (grams: number) => {
  return (grams * 2.2046 * 16.0 / 1000.0);
}