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
router.get("/", utilities.checkLogin, utilities.handleErrors(invController.buildManagement))

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
router.get("/add", utilities.handleErrors(invController.buildAddInventory))

// Route to build edit inventory view
router.get("/edit/:invId", utilities.handleErrors(invController.buildEditInventory))

// Route to build delete inventory view
router.get("/delete/:invId", utilities.handleErrors(invController.buildDeleteInventory))

// Process to add the inventory data
router.post(
    "/add",
    validate.inventoryRules(),
    validate.checkInvData,
    utilities.handleErrors(invController.addInventory)
);

// Process to update the inventory data
router.post(
    "/update",
    validate.newInventoryRules(),
    validate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory)
);

// Process to delete the inventory data
router.post( "/delete", utilities.handleErrors(invController.deleteInventory));

// Route to get the inventory data based on classification_id
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

module.exports = router;
