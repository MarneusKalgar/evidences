/**
 * Method checks where msg_System dictionary row is used.
 *
 * When a subsystem start use msg_System dictionary, it shall at backend register a function, which would check
 * the dictionary row for for usage.
 *
 * @param {number} systemID
 */
function getSystemUsages(systemID) {
  if (!Number.isInteger(systemID)) {
    throw new UBAbort('<<<Numeric systemMessageTypeID parameter required>>>')
  }

  return _.flatMap(
    dependantApplications,
    depApp => depApp.loadSystemUsages(systemID).map(depName => ({objType: depApp.name, depName}))
  )
}