const validator = require("validator").default;

function loginValidator(user) {
    let error = {};
    if(!user.email) {
        error.email = "Please Inter User Name";
    } else if(!validator.isEmail(user.email)) {
        error.email = "Email is Not Valid";
    }
    if(!user.password) {
        error.password = "Please Inter Password";
    } else if(user.password.length < 6) {
        error.password = "Password Must be 6 charecter";
    }
    return {
        error,
        isValid: Object.keys(error).length === 0
    }
}

const signUpValidator = (user) => {
    const error = {};
    if(!user.name) {
        error.name = "Please Inter Your Name";
    }
    if(!user.email) {
        error.email = "Please Inter Your Email";
    } else if(!validator.isEmail(user.email)) {
        error.email = "Email is not Valid";
    }
    if(!user.password) {
        error.password = "Please Provide Your Password";
    } else if(user.password.length < 6) {
        error.password = "Password Must be 6 Charecter";
    }
    if(!user.confirmPassword) {
        error.confirmPassword = "Please Provide Confirm Password";
    } else if(user.password !== user.confirmPassword) {
        error.confirmPassword = "Not Match Password";
    }

    return {
        error,
        isValid : Object.keys(error).length === 0
    }
}

module.exports = {
    loginValidator,
    signUpValidator
};