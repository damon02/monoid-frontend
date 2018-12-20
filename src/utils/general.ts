/**
 * Sort object by key
 * @param {String} key 
 */
export function keysrt(key: string) {
	return (a : any, b : any) => {
		if (a[key] > b[key]) {
			return 1
		} else if (a[key] < b[key]) {
			return -1
		} else {
			return 0
		}		
	}
}

/**
 * Sort object by key inversely
 * @param {String} key 
 */
export function invkeysrt(key: string) {
	return (a : any, b : any) => {
		if (a[key] < b[key]) {
			return 1
		} else if (a[key] > b[key]) {
			return -1
		} else {
			return 0
		}		
	}
}