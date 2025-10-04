const invModel = require("../models/inventory-model")
const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/* ************************
 * Classification Data Validation Rules
 ************************** */
validate.classificationRules = () => {
    return [
        body("classification_name")
            .trim()
            .escape()
            .notEmpty().withMessage("Provide a correct classification name.")
            .isAlpha().withMessage("Provide a correct classification name.")
            .custom(async (classification_name) => {
                const classExists = await invModel.checkExistingClassName(classification_name)
                if (classExists) {
                    throw new Error("Classification name already exists. Please add a unique name.")
                }
            }),
    ]
}

/* ************************
 * Check data and return errors or continue to add classification
 ************************** */
validate.checkClassData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            errors,
            title: "Add Classification",
            nav,
            classification_name,
        })
        return
    }
    next()
}

/* ************************
 * Inventory Data Validation Rules
 ************************** */
validate.inventoryRules = () => {
    return [
        // Inventory classification
        body("classification_id")
            .notEmpty().withMessage("Select a vehicle classification."),

        // Inventory make
        body("inv_make")
            .trim()
            .escape()
            .notEmpty().withMessage("Provide a vehicle make."),

        // Inventory model
        body("inv_model")
            .trim()
            .escape()
            .notEmpty().withMessage("Provide a vehicle model."),

        // Inventory description
        body("inv_description")
            .trim()
            .escape()
            .notEmpty().withMessage("Provide a vehicle description."),

        // Inventory image
        body("inv_image")
            .trim()
            .escape()
            .notEmpty().withMessage("Provide a vehicle image."),

        // Inventory thumbnail
        body("inv_thumbnail")
            .trim()
            .escape()
            .notEmpty().withMessage("Provide a vehicle thumbnail."),

        // Inventory thumbnail
        body("inv_price")
            .trim()
            .escape()
            .notEmpty().withMessage("Provide a vehicle price.")
            .isNumeric().withMessage("Please enter a number."),

        // Inventory thumbnail
        body("inv_year")
            .trim()
            .escape()
            .notEmpty().withMessage("Provide a vehicle year.")
            .isNumeric().withMessage("Please enter a number."),

        // Inventory thumbnail
        body("inv_miles")
            .trim()
            .escape()
            .notEmpty().withMessage("Provide a vehicle mileage.")
            .isNumeric().withMessage("Please enter a number."),

        // Inventory color
        body("inv_color")
            .trim()
            .escape()
            .notEmpty().withMessage("Provide a vehicle color."),
    ]
}

/* ************************
 * Check data and return errors or continue to add inventory
 ************************** */
validate.checkInvData = async (req, res, next) => {
    const {
        classification_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color
    } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        const classificationList = await utilities.buildClassificationList(classification_id)
        res.render("inventory/add-inventory", {
            errors,
            title: "Add Inventory",
            nav,
            classification_id,
            inv_make,
            inv_model,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_year,
            inv_miles,
            inv_color,
            classificationList: classificationList
        })
        return
    }
    next()
}

/* ************************
 * New Inventory Data Validation Rules
 ************************** */
validate.newInventoryRules = () => {
    return [
        // Inventory ID
        body("inv_id")
            .trim()
            .escape()
            .notEmpty().withMessage("Inventory ID is required."),

        // Inventory classification
        body("classification_id")
            .notEmpty().withMessage("Select a vehicle classification."),

        // Inventory make
        body("inv_make")
            .trim()
            .escape()
            .notEmpty().withMessage("Provide a vehicle make."),

        // Inventory model
        body("inv_model")
            .trim()
            .escape()
            .notEmpty().withMessage("Provide a vehicle model."),

        // Inventory description
        body("inv_description")
            .trim()
            .escape()
            .notEmpty().withMessage("Provide a vehicle description."),

        // Inventory image
        body("inv_image")
            .trim()
            .escape()
            .notEmpty().withMessage("Provide a vehicle image."),

        // Inventory thumbnail
        body("inv_thumbnail")
            .trim()
            .escape()
            .notEmpty().withMessage("Provide a vehicle thumbnail."),

        // Inventory thumbnail
        body("inv_price")
            .trim()
            .escape()
            .notEmpty().withMessage("Provide a vehicle price.")
            .isNumeric().withMessage("Please enter a number."),

        // Inventory thumbnail
        body("inv_year")
            .trim()
            .escape()
            .notEmpty().withMessage("Provide a vehicle year.")
            .isNumeric().withMessage("Please enter a number."),

        // Inventory thumbnail
        body("inv_miles")
            .trim()
            .escape()
            .notEmpty().withMessage("Provide a vehicle mileage.")
            .isNumeric().withMessage("Please enter a number."),

        // Inventory color
        body("inv_color")
            .trim()
            .escape()
            .notEmpty().withMessage("Provide a vehicle color."),
    ]
}

/* ************************
 * Check update data and return errors or continue to edit inventory
 ************************** */
validate.checkUpdateData = async (req, res, next) => {
    const {
        inv_id,
        classification_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color
    } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        const classificationList = await utilities.buildClassificationList(classification_id)
        res.render("inventory/edit-inventory", {
            errors,
            title: `Edit ${inv_make} ${inv_model}`,
            nav,
            inv_id,
            classification_id,
            inv_make,
            inv_model,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_year,
            inv_miles,
            inv_color,
            classificationList: classificationList
        })
        return
    }
    next()
}

module.exports = validate
