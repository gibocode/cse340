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
    const className = classification.classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
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

module.exports = invCont
