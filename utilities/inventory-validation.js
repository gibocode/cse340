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

module.exports = validate
