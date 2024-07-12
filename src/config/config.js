
const config = {
    borrowPeriod: 14, 
    maxBooks: 5, 
    rsvnPeriod: 6,
    maxOfRsvn: 3,
    finePerDay: 1 
};

function setValue(key, value) {
    if (config.hasOwnProperty(key)) {
        config[key] = value;
    } else {
        throw new Error(`Key ${key} does not exist in config`);
    }
}

function getValue(key) {
    if (config.hasOwnProperty(key)) {
        return config[key];
    } else {
        throw new Error(`Key ${key} does not exist in config`);
    }
}

module.exports = {
    getValue,
    setValue
};
