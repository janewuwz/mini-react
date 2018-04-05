export default function isEqual (one, other) {
  if (JSON.stringify(one) === JSON.stringify(other)) {
    return true
  }
  return false
}
