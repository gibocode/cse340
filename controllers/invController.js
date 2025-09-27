const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const classification = data[0]
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    res.render("./inventory/classification", {
        title: (classification) ? `${classification.classification_name} Vehicles` : '',
        nav,
        grid,
        res,
    })
}

/* ***************************
 *  Build inventory by inventory view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
    const inventory_id = req.params.invId
    const data = await invModel.getInventoryById(inventory_id)
    const item = data[0];
    const content = await utilities.buildInventoryItemDetailView(item)
    const nav = await utilities.getNav()
    const inventoryName = `${item.inv_year} ${item.inv_make} ${item.inv_model}`
    res.render("./inventory/item", {
        title: inventoryName,
        nav,
        content,
    })
}

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
    const nav = await utilities.getNav()
    res.render("./inventory/management", {
        title: "Vehicle Management",
        nav,
    })
}

/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
    const nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors: null,
    })
}

/* ***************************
 *  Process add classification
 * ************************** */
invCont.addClassification = async function (req, res, next) {
    const { classification_name } = req.body
    const addResult = await invModel.addClassification(classification_name)
    const nav = await utilities.getNav()
    if (addResult) {
        req.flash(
            "alert alert-success",
            `The ${classification_name} classification was successfully added.`
        )
        res.status(201).render("./inventory/management", {
            title: "Vehicle Management",
            nav,
        })
    } else {
        req.flash("alert alert-danger", "Could not add classification.")
        res.status(501).render("./inventory/add-classification", {
            title: "Add Classification",
            nav,
            errors: null,
        })
    }
}

/* ***************************
 *  Build add inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
    const nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList()
    res.render("./inventory/add-inventory", {
        title: "Add Inventory",
        nav,
        errors: null,
        classificationList: classificationList,
    })
}

/* ***************************
 *  Process add inventory
 * ************************** */
invCont.addInventory = async function (req, res, next) {
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
    const addResult = await invModel.addInventory(
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
    )
    const classificationList = await utilities.buildClassificationList(classification_id)
    const nav = await utilities.getNav()
    if (addResult) {
        req.flash(
            "alert alert-success",
            `New inventory was successfully added.`
        )
        res.status(201).render("./inventory/management", {
            title: "Vehicle Management",
            nav,
        })
    } else {
        req.flash("alert alert-danger", "Could not add inventory.")
        res.status(501).render("./inventory/add-inventory", {
            title: "Add Inventory",
            nav,
            errors: null,
            classificationList: classificationList
        })
    }
}

module.exports = invCont
