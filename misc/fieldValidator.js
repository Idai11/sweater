/*
FILE: fieldValidator.js
*/

/*
Validates that all values in [vals] are strings in the correct length
*/
const stringValidator = (vals, {min_length, max_length}) => {
    for (let val of vals) {
        if (!(typeof val == "string"
            && val.length < max_length
            && val.length > min_length)) {
            return false;
        }
    }

    return true;
}

/*
Validates that all values in [vals] are ints
*/
const intValidator = vals => {
    for (let val of vals) {
        if (!typeof(val) == "number") {
            return false;
        }
    }

    return true;
}

module.exports = {
    stringValidator,
    intValidator
}
