module.exports = function extract(source) {
  this.cacheable && this.cacheable();
	this.value = source;
  this._module.__extractedSource = source;
  return '// empty (nullable loader)';
}

// module.exports.pitch = function(remaining, preceding, data) {
// 	this.cacheable();
// 	return '// empty (nullable loader)';
// };