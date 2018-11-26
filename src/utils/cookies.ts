/**
 * Function to load values from local storage through a key
 * @param key Key to load from local storage
 * @param defaultValue Default value if the key is not found inside local storage
 */
export function loadProperty(key: string, defaultValue: any) {
  try {
    const value = localStorage[key]

    return value !== undefined ? JSON.parse(value) : defaultValue
  } catch (err) {
    console.error(err)
    return defaultValue
  }
}

/**
 * Function to save values to local storage with a key
 * @param key Key to save inside the local storage
 * @param value Value to save with the key inside local storage
 */
export function saveProperty(key: string, value: any) {
  try {
    localStorage[key] = JSON.stringify(value)
  } catch (err) {
    console.error(err)
  }
}

/**
 * Removes a key/value pair from local storage
 * @param key Key to remove from local storage
 */
export function removeProperty(key: string) {
  try {
    delete localStorage[key]
  } catch (err) {
    console.error(err)
  }
}