const bcrypt = require("bcryptjs")
const accountModel = require("../models/account-model")
const utilities = require("../utilities/")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ***************************
 *  Deliver login view
 * ************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null,
    })
}

/* ***************************
 *  Process Login
 * ************************** */
async function loginAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_email, account_password } = req.body
    const accountData = await accountModel.getAccountByEmail(account_email)
    if (!accountData) {
        req.flash("alert alert-danger", "Please check your credentials and try again.")
        res.status(400).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            account_email
        })
        return
    }
    try {
        if (await bcrypt.compare(account_password, accountData.account_password)) {
            delete accountData.account_password
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
            if (process.env.NODE_ENV === 'development') {
                res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
            } else {
                res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
            }
            return res.redirect("/account/")
        }
        else {
            req.flash("alert alert-danger", "Please check your credentials and try again.")
            res.status(400).render("account/login", {
                title: "Login",
                nav,
                errors: null,
                account_email
            })
            return
        }
    } catch (error) {
        throw new Error("Access Forbidden")
    }
}

/* ***************************
 *  Deliver registration view
 * ************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null,
    })
}

/* ***************************
 *  Process Registration
 * ************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    // Hash the password before storing
    let hashedPassword
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("alert alery-danger", "Sorry, there was an error processing the registration.")
        res.status(500).render("account/register", {
            title: "Registration",
            nav,
            errors: null
        })
    }

    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
    )

    if (regResult) {
        req.flash(
            "alert alert-success",
            `Congratulations, you\'re registered ${account_firstname}. Please log in.`
        )
        res.status(201).render("account/login", {
            title: "Login",
            nav,
            errors: null,
        })
    } else {
        req.flash("alert alert-danger", "Sorry, registration failed.")
        res.status(501).render("account/register", {
            title: "Registration",
            nav,
            errors: null,
        })
    }
}

/* ***************************
 *  Deliver account view
 * ************************** */
async function buildAccount(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/index", {
        title: "My Account",
        nav,
        errors: null,
    })
}

/* ***************************
 *  Process logout account
 * ************************** */
async function logoutAccount(req, res, next) {
    res.clearCookie("jwt")
    req.flash(
        "alert alert-success",
        "You have logged out successfully."
    )
    return res.redirect("/account/login")
}

module.exports = { buildLogin, buildRegister, loginAccount, registerAccount, buildAccount, logoutAccount }
