/**
 * Time utils
 */

/**
 * Return current Unix epoch *
 */
export function getEpoch() {
  return Math.floor(new Date().getTime()/1000.0)
}
