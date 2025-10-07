const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/* ************************
 * Update Account Type Data Validation Rules
 ************************** */
validate.updateAccountTypeRules = () => {
    return [
        body("account_type")
            .trim()
            .notEmpty().withMessage("Account type must not be empty.")
            .isIn(["Admin", "Employee", "Client"]).withMessage("Invalid account type selected.")
    ]
}

/* ************************
 * Check data and return errors when updating account type
 ************************** */
validate.checkUpdateAccountTypeData = async (req, res, next) => {
    const account_id = req.body.account_id
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("user/edit-account-type", {
            errors,
            title: "Edit Account Type",
            nav,
            account_id,
        })
    }
    next()
}

module.exports = validate
