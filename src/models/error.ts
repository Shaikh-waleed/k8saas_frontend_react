/**
 * For throwing app errors.
 *
 * Usage: throw new fetchError("foo")
 *
 * @param message
 * @constructor
 */
export function fetchError(message) {
  this.name = "fetchError";
  this.message = message;
}
