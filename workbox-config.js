module.exports = {
	globDirectory: 'application/',
	globPatterns: [
		'**/*.{tsbuildinfo,png,html,json,svg,css,tsx,ts}'
	],
	swDest: 'application/sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};