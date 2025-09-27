// Needed Resources
const validate = require("../utilities/inventory-validation")
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities");

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory item detail view
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInventoryId));

// Route to build management view
router.get("/", utilities.handleErrors(invController.buildManagement))

// Route to build add classification view
router.get("/classification/add", utilities.handleErrors(invController.buildAddClassification))

// Process the classification data
router.post(
    "/classification/add",
    validate.classificationRules(),
    validate.checkClassData,
    utilities.handleErrors(invController.addClassification)
);

// Route to build add inventory view
// router.get("/add", utilities.handleErrors(invController.buildAddInventory))

module.exports = router;
