const accountModel = require("../models/account-model")
const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/* ************************
 * Registration Data Validation Rules
 ************************** */
validate.registrationRules = () => {
    return [
        // firstname is required and must be string
        body("account_firstname")
            .trim()
            .escape()
            .notEmpty().withMessage("Please provide a first name.")
            .isLength({ min: 1 }).withMessage("First name must be more than 1 character in length."),

        // lastname is required and must be string
        body("account_lastname")
            .trim()
            .escape()
            .notEmpty().withMessage("Please provide a last name.")
            .isLength({ min: 2 }).withMessage("Last name must be more than 2 characters in length."),

        // valid email is required and cannot already exists in the DB
        body("account_email")
            .trim()
            .escape()
            .notEmpty().withMessage("A valid email is required.")
            .isEmail().withMessage("A valid email is required.")
            .normalizeEmail()
            .custom(async (account_email) => {
                const emailExists = await accountModel.checkExistingEmail(account_email)
                if (emailExists) {
                    throw new Error("Email exists. Please log in or use different email")
                }
            }),

        // Password is required and must be strong password
        body("account_password")
            .trim()
            .notEmpty().withMessage("Password must not be empty.")
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            }).withMessage("Password does not meet requirements.")
    ]
}

/* ************************
 * Check data and return errors or continue to registration
 ************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/register", {
            errors,
            title: "Register",
            nav,
            account_firstname,
            account_lastname,
            account_email,
        })
        return
    }
    next()
}

/* ************************
 * Login Data Validation Rules
 ************************** */
validate.loginRules = () => {
    return [
        // valid email is required and cannot already exists in the DB
        body("account_email")
            .trim()
            .escape()
            .notEmpty().withMessage("A valid email is required.")
            .isEmail().withMessage("A valid email is required.")
            .normalizeEmail(),

        // Password is required and must be strong password
        body("account_password")
            .trim()
            .notEmpty().withMessage("Password must not be empty.")
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            }).withMessage("Password does not meet requirements.")
    ]
}

/* ************************
 * Check data and return errors or continue to login
 ************************** */
validate.checkLoginData = async (req, res, next) => {
    const { account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/login", {
            errors,
            title: "Login",
            nav,
            account_email,
        })
        return
    }
    next()
}

/* ************************
 * Update Account Data Validation Rules
 ************************** */
validate.updateRules = () => {
    return [
        // firstname is required and must be string
        body("account_firstname")
            .trim()
            .escape()
            .notEmpty().withMessage("Please provide a first name.")
            .isLength({ min: 1 }).withMessage("First name must be more than 1 character in length."),

        // lastname is required and must be string
        body("account_lastname")
            .trim()
            .escape()
            .notEmpty().withMessage("Please provide a last name.")
            .isLength({ min: 2 }).withMessage("Last name must be more than 2 characters in length."),

        // valid email is required and cannot already exists in the DB
        body("account_email")
            .trim()
            .escape()
            .notEmpty().withMessage("A valid email is required.")
            .isEmail().withMessage("A valid email is required.")
            .normalizeEmail()
            .custom(async (account_email, { req }) => {
                const account_id = req.body.account_id
                const emailTaken = await accountModel.checkTakenEmail(account_id, account_email)
                if (emailTaken) {
                    throw new Error("Email already taken. Please use a different email.")
                }
            }),
    ]
}


/* ************************
 * Check data and return errors when updating
 ************************** */
validate.checkUpdateData = async (req, res, next) => {
    const {
        account_id,
        account_firstname,
        account_lastname,
        account_email
    } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        const nav = await utilities.getNav()
        const accountData = await accountModel.getAccountById(account_id)
        res.locals.accountData = accountData
        res.render("account/edit", {
            errors,
            title: "Edit Account",
            nav,
            account_id,
            account_firstname,
            account_lastname,
            account_email,
        })
        return
    }
    next()
}

/* ************************
 * Update Account Password Data Validation Rules
 ************************** */
validate.updatePasswordRules = () => {
    return [
        // Password is required and must be strong password
        body("account_password")
            .trim()
            .notEmpty().withMessage("Password must not be empty.")
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            }).withMessage("Password does not meet requirements.")
    ]
}

/* ************************
 * Check data and return errors when updating password
 ************************** */
validate.checkUpdatePasswordData = async (req, res, next) => {
    const {
        account_id,
        account_password,
    } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        const accountData = await accountModel.getAccountById(account_id)
        res.render("account/edit", {
            errors,
            title: "Edit Account",
            nav,
            account_id,
            account_password,
            account_firstname: accountData.account_firstname,
            account_lastname: accountData.account_lastname,
            account_email: accountData.account_email,
        })
        return
    }
    next()
}

module.exports = validate
