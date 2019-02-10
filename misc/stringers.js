const stringers = {};

stringers.generateRandomString = length => {
    var out = "";

    for (let i = 1; i <= length; i++) {
        out += String.fromCharCode(Math.floor(Math.random() * 94) + 33);
    }

    return out;
};

stringers.generateRandomStringPretty = length => {
    var out = "";

    for (let i = 1; i <= length; i++) {
        let choice = Math.floor(Math.random() * 3);
        switch (choice) {
            case 0:
                out += Math.floor(Math.random() * 10);
                break;
            case 1:
                out += String.fromCharCode(Math.floor(Math.random() * 26) + 65);
                break;
            case 2:
                out += String.fromCharCode(Math.floor(Math.random() * 26) + 97);
                break;
        }
    }

    return out;
};

module.exports = stringers;
