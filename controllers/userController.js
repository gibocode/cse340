const userModel = require("../models/user-model")
const utilities = require("../utilities/")

const userCont = {}

/* ***************************
 *  Build user view
 * ************************** */
userCont.buildUser = async (req, res, next) => {
    const nav = await utilities.getNav()
    res.render("./user/index", {
        title: "User Management",
        nav,
        errors: null,
    })
}

/* ***************************
 *  Return User As JSON
 * ************************** */
userCont.getUserJSON = async (req, res, next) => {
    const currentUserId = res.locals.accountData.account_id
    const userData = await userModel.getAll(currentUserId)
    return res.json(userData)
}

/* ***************************
 *  Build edit user account type view
 * ************************** */
userCont.buildEditUserAccountType = async function (req, res, next) {
    const account_id = parseInt(req.params.userId)
    const nav = await utilities.getNav()
    const user = await userModel.getUserById(account_id)
    delete user.account_password
    res.render("./user/edit-account-type", {
        title: `Edit Account Type`,
        nav,
        errors: null,
        account_id,
        account_firstname: user.account_firstname,
        account_lastname: user.account_lastname,
        account_type: user.account_type,
    })
}

/* ***************************
 *  Process update account type
 * ************************** */
userCont.updateAccountType = async function (req, res, next) {
    const {
        account_id,
        account_type,
        account_firstname,
        account_lastname,
    } = req.body
    const updateResult = await userModel.updateAccountType(
        account_id,
        account_type,
    )
    if (updateResult) {
        req.flash(
            "alert alert-success",
            `Account type was succesfully updated.`
        )
        res.redirect("/user")
    } else {
        const nav = await utilities.getNav()
        req.flash("alert alert-danger", "Sorry, could not update account type.")
        res.status(501).render("./user/edit-account-type", {
            title: `Edit Account Type`,
            nav,
            errors: null,
            account_id,
            account_type,
            account_firstname,
            account_lastname,
        })
    }
}

module.exports = userCont
