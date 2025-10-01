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
        title: ((classification) ? `${classification.classification_name} ` : '') + 'Vehicles',
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
    const classificationList = await utilities.buildClassificationList()
    res.render("./inventory/management", {
        title: "Vehicle Management",
        nav,
        classificationList: classificationList,
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
    const classificationList = await utilities.buildClassificationList()
    if (addResult) {
        req.flash(
            "alert alert-success",
            `The ${classification_name} classification was successfully added.`
        )
        res.status(201).render("./inventory/management", {
            title: "Vehicle Management",
            nav,
            classificationList: classificationList,
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
 *  Build edit inventory view
 * ************************** */
invCont.buildEditInventory = async function (req, res, next) {
    const inventory_id = parseInt(req.params.invId)
    const nav = await utilities.getNav()
    const data = await invModel.getInventoryById(inventory_id)
    const item = data[0];
    const classificationList = await utilities.buildClassificationList(item.classification_id)
    res.render("./inventory/edit-inventory", {
        title: `Edit ${item.inv_make} ${item.inv_model}`,
        nav,
        errors: null,
        classificationList: classificationList,
        inv_id: item.inv_id,
        inv_make: item.inv_make,
        inv_model: item.inv_model,
        inv_year: item.inv_year,
        inv_description: item.inv_description,
        inv_image: item.inv_image,
        inv_thumbnail: item.inv_thumbnail,
        inv_price: item.inv_price,
        inv_miles: item.inv_miles,
        inv_color: item.inv_color,
        classification_id: item.classification_id,
    })
}

/* ***************************
 *  Build delete inventory view
 * ************************** */
invCont.buildDeleteInventory = async function (req, res, next) {
    const inventory_id = parseInt(req.params.invId)
    const nav = await utilities.getNav()
    const data = await invModel.getInventoryById(inventory_id)
    const item = data[0];
    res.render("./inventory/delete-confirm", {
        title: `Delete ${item.inv_make} ${item.inv_model}`,
        nav,
        errors: null,
        inv_id: item.inv_id,
        inv_make: item.inv_make,
        inv_model: item.inv_model,
        inv_year: item.inv_year,
        inv_price: item.inv_price,
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

    const nav = await utilities.getNav()
    if (addResult) {
        const classificationList = await utilities.buildClassificationList()
        req.flash(
            "alert alert-success",
            `New inventory was successfully added.`
        )
        res.status(201).render("./inventory/management", {
            title: "Vehicle Management",
            nav,
            classificationList: classificationList,
        })
    } else {
        const classificationList = await utilities.buildClassificationList(classification_id)
        req.flash("alert alert-danger", "Could not add inventory.")
        res.status(501).render("./inventory/add-inventory", {
            title: "Add Inventory",
            nav,
            errors: null,
            classificationList: classificationList,
        })
    }
}

/* ***************************
 *  Process update inventory
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
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
    const updateResult = await invModel.updateInventory(
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
    )
    if (updateResult) {
        const itemName = `${updateResult.inv_make} ${updateResult.inv_model}`
        req.flash(
            "alert alert-success",
            `The ${itemName} was succesfully updated.`
        )
        res.redirect("/inv")
    } else {
        const itemName = `${inv_make} ${inv_model}`
        const classificationList = await utilities.buildClassificationList(classification_id)
        const nav = await utilities.getNav()
        req.flash("alert alert-danger", "Sorry, could not update inventory.")
        res.status(501).render("./inventory/edit-inventory", {
            title: `Edit ${itemName}`,
            nav,
            errors: null,
            classificationList: classificationList,
            inv_id: inv_id,
            inv_make: inv_make,
            inv_model: inv_model,
            inv_year: inv_year,
            inv_description: inv_description,
            inv_image: inv_image,
            inv_thumbnail: inv_thumbnail,
            inv_price: inv_price,
            inv_miles: inv_miles,
            inv_color: inv_color,
            classification_id: classification_id,
        })
    }
}

/* ***************************
 *  Process delete inventory
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
    const {
        inv_id,
        inv_make,
        inv_model,
        inv_price,
        inv_year,
    } = req.body
    const deleteResult = await invModel.deleteInventory(parseInt(inv_id))
    if (deleteResult) {
        req.flash(
            "alert alert-success",
            `The deletion was succesful.`
        )
        res.redirect("/inv")
    } else {
        const itemName = `${inv_make} ${inv_model}`
        const nav = await utilities.getNav()
        req.flash("alert alert-danger", "Sorry, could not delete inventory.")
        res.status(501).render("./inventory/delete-inventory", {
            title: `Edit ${itemName}`,
            nav,
            errors: null,
            inv_id: inv_id,
            inv_make: inv_make,
            inv_model: inv_model,
            inv_year: inv_year,
            inv_price: inv_price,
        })
    }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    if (invData[0].inv_id) {
        return res.json(invData)
    } else {
        next(new Error("No data returned"))
    }
}

module.exports = invCont
