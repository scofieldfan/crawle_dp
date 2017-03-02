/**
 * Created by fanzhang on 17/2/27.
 */

let fs = require('fs');

let encode = "utf8";
module.exports = {
    appendFile: (name, data) => {
        fs.appendFile(name, data, encode,  (err) => {
            if (err) {
                console.log(err);
            }
        });
    },
    readFile: (fileName) => fs.readFileSync(fileName, encode)
}
