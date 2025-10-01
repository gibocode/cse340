// Needed Resources
const validate = require("../utilities/account-validation")
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities");

// Route to build account login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to build account registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Route to build account view
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccount));

// Process the login attempt
router.post(
    "/login",
    validate.loginRules(),
    validate.checkLoginData,
    utilities.handleErrors(accountController.loginAccount)
);

// Process the registration data
router.post(
    "/register",
    validate.registrationRules(),
    validate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
);

module.exports = router;
