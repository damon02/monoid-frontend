export function setIn (object:object, path:string[], value:any) {
  if (path.length === 0) {
      return value
  }

  const key = path[0]
  const child = typeof object[key] === 'object' ? object[key] : {}
  const updated:object = clone(object)

  updated[key] = setIn(child, path.slice(1), value)

  return updated
}

function clone (object:object) {
  const cloned = {}

  Object.keys(object).forEach(key => {
      cloned[key] = object[key]
  })

  return cloned
}