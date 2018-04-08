// deep clone obejct
// return the new object
export default function cloneDeep (srcObj) {
  let result, v, k
  result = Array.isArray(srcObj) ? [] : {}
  for (k in srcObj) {
    v = srcObj[k]
    result[k] = (typeof v === 'object') ? cloneDeep(v) : v
  }
  return result
}
