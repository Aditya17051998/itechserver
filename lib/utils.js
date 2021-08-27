const bcrypt = require('bcrypt');
const randomString = require('randomstring');
const crypto =require("crypto");

const generateBcryptHash = (password) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
};

const compareHash = (password, hash) => bcrypt.compareSync(password, hash);

const toTitleCase = (str) => {
    const strArr = str.toLowerCase().split(' ');
    const final = [];
    strArr.forEach((word) => {
        final.push(word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
    });
    return final.join(' ');
};

const generateRandomString = (length) => randomString.generate({
    length: length || 12,
    charset: 'alphanumeric',
});
const generateToken = () => {
    return crypto.randomBytes(20).toString('hex')
};

const validateName = (name) => {
    if (name.length == 0) {
        return "Empty name field."
    }
    if (name.length > 0 && name.length < 50) {
        let regex = /^[\sa-zA-Z\s]+(\s[a-zA-Z\s]+)?$/i;
        if (!regex.test(name)) {
            return "The name field should only contain alphabets."
        }
    } else {
        return "Minimum length for name should be 1 and maximum should be 50."
    }
    return "";
}

const validateEmail = (email) => {
    if (email.length == 0) {
        return "Empty email field."
    }
    if (email.length > 0 && email.length < 64) {
        let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!regex.test(email)) {
            return "The email field has invalid email id."
        }
    } else {
        return "Minimum length for email id should be 1 and maximum should be 64."
    }
    return "";
}

const validateInput = (data, message) => {
    if(!data) { throw new Error(message); }
    return true;
}

const cleanUserData = (userData) => {
    if (userData) {
        return {
            userId: userData._id,
            name: userData.name,
            email: userData.email,
            publicKey: userData.publicKey,
            isGranted: userData.isGranted,
            isVerified: userData.isVerified,
            isBlocked: userData.isBlocked,
            role: userData.role
        };
    }
    return true;
};

module.exports = {
    compareHash,
    generateBcryptHash,

    toTitleCase,
    generateRandomString,
    validateName,
    validateEmail,

    generateToken,

    validateInput,
    cleanUserData
}