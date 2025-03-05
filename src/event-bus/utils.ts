function isSubset<O extends SO, SO extends object>(object: O, subset: SO): boolean {
	return Object.keys(subset).every((key: string) =>
		!subset[key] || object.hasOwnProperty(key) && subset.hasOwnProperty(key)
			? typeof object[key] === typeof subset[key]
				? typeof object[key] === 'object'
					? isSubset(object[key], subset[key])
					: object[key] === subset[key]
				: false
			: false)
}