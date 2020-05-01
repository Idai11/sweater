/*
FILE: stringers.js
*/

const stringers = {};

/*
Generate a random string with the specified length
*/
stringers.generateRandomString = length => {
    var out = "";

    for (let i = 1; i <= length; i++) {
        out += String.fromCharCode(Math.floor(Math.random() * 94) + 33);
    }

    return out;
};

/*
Genrate a random string with the specified length
The string can contain only letters and numbers
*/
stringers.generateRandomStringPretty = length => {
    var out = "";

    for (let i = 1; i <= length; i++) {
        let choice = Math.floor(Math.random() * 3);
        switch (choice) {
            // Numbers
            case 0:
                out += Math.floor(Math.random() * 10);
                break;
            // Uppercase
            case 1:
                out += String.fromCharCode(Math.floor(Math.random() * 26) + 65);
                break;
            // Lowercase
            case 2:
                out += String.fromCharCode(Math.floor(Math.random() * 26) + 97);
                break;
        }
    }

    return out;
};

module.exports = stringers;
