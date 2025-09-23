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

module.exports = validate
