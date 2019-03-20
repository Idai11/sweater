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

module.exports = {
    stringValidator
}
