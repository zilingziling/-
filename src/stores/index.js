// @flow
const context = require.context('.', true, /\.js$/);
const obj = {};

const matchReg = /[\w_-]*(?=\.js)/gi; // (?<=./)[\w\_-]*(?=\.js)
const SPECIAL_CHARS_REGEXP = /[:\-_]+(.)/g;

const camelCase = function (name) {
	return name.replace(SPECIAL_CHARS_REGEXP, function (match, letter, offset) {
		return offset ? letter.toUpperCase() : letter;
	});
};

context.keys().forEach(function (key) {
	const matchResult = key.match(matchReg);

	if (matchResult.length !== 0 && matchResult[0] !== 'index') {
		obj[camelCase(matchResult[0])] = context(key).default ? context(key).default : context(key);
	}
});
// console.log(obj);

export default obj;