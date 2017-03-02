var path = require('path');
var citys = require('./city');
console.log(__dirname);
console.log(__filename);
console.log(process.cwd());
console.log(path.resolve('./'));
console.log(citys.findCity('1'))
console.log(citys.findCity('34'))
console.log(citys.findCity('34','2336'))
