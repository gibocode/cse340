const validate = require("../utilities/user-validation")
const express = require("express")
const router = new express.Router()
const userController = require("../controllers/userController")
const utilities = require("../utilities");

// Route to build user view
router.get(
    "/",
    utilities.checkLogin,
    utilities.checkAdmin,
    utilities.handleErrors(userController.buildUser)
);

// Route to get users data
router.get(
    "/getUsers",
    utilities.checkLogin,
    utilities.checkAdmin,
    utilities.handleErrors(userController.getUserJSON)
)

// Route to build edit user account type view
router.get(
    "/edit-account-type/:userId",
    utilities.checkLogin,
    utilities.checkAdmin,
    utilities.handleErrors(userController.buildEditUserAccountType)
)

// Process to update the user account type data
router.post(
    "/update-account-type",
    utilities.checkLogin,
    utilities.checkAccountType,
    validate.updateAccountTypeRules(),
    validate.checkUpdateAccountTypeData,
    utilities.handleErrors(userController.updateAccountType)
);

module.exports = router;
