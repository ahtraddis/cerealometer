/**
 * Math utils
 */

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 *
 * @param min Minimum (inclusive)
 * @param max Maximum (exclusive)
 */
export const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Convert ratio to percentage bounded by 0 and 100
 *
 * @param {number} numerator Numerator
 * @param {number} denominator Denominator
 * @return {number} Percentage, bounded by 0 and 100
 */
export const getBoundedPercentage = (numerator: number, denominator: number) => {
  return Math.min(Math.max(100.0 * numerator / denominator, 0), 100);
}
