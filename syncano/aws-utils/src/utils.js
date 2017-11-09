import crypto from 'crypto'

function defaultHash(raw) {
  return crypto
    .createHash('sha256')
    .update(raw)
    .digest('hex')
}

function compareHash(raw, hash) {
  if (raw === 'undefined') {
    return false
  }
  if (raw.length === 0) {
    return false
  }
  return defaultHash(raw) === hash
}

export {defaultHash, compareHash}
