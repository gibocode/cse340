const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    let mobile = `<button type="button" class="mobile-nav" aria-label="Mobile Nav Button">
            <svg class="mobile-nav-button-icon" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <path fill="currentColor" d="M3,9H29a2,2,0,0,0,0-4H3A2,2,0,0,0,3,9Z"/>
                <path fill="currentColor" d="M29,14H3a2,2,0,0,0,0,4H29a2,2,0,0,0,0-4Z"/>
                <path fill="currentColor" d="M29,23H3a2,2,0,0,0,0,4H29a2,2,0,0,0,0-4Z"/>
            </svg>
        </button>`
    let list = '<ul class="hide">' +
        '<li class="active"><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list += "<li>"
        list +=
            '<a href="/inv/type/' +
            row.classification_id +
            '" title="See our inventory of ' +
            row.classification_name +
            ' vehicles">' +
            row.classification_name +
            "</a>"
        list += "</li>"
    })
    list += "</ul>"
    return mobile + list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data) {
    let grid = ''
    if( data.length > 0) {
        grid = '<ul id="inv-display">'
        data.forEach(vehicle => {
            grid += '<li>'
            grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id
            + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model
            + 'details"><img src="' + vehicle.inv_thumbnail
            +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model
            +' on CSE Motors"></a>'
            grid += '<div class="namePriceContainer">'
            grid += '<div class="namePrice">'
            grid += '<h3>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View '
            + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
            + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
            grid += '</h3>'
            grid += '<span>'
            + new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(vehicle.inv_price) + '</span>'
            grid += '</div>'
            grid += '<div><a class="btn view-details-button" href="../../inv/detail/' + vehicle.inv_id +'">View Details</a></div>'
            grid += '</div>'
            grid += '</li>'
        })
        grid += '</ul>'
    } else {
        grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}

/* **************************************
* Build the inventory item detail view HTML
* ************************************ */
Util.buildInventoryItemDetailView = async function(item) {
    let content
    if (item) {
        // Format price
        const price = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(item.inv_price)
        // Format miles
        const miles = new Intl.NumberFormat('en-US').format(item.inv_miles)
        content = `
            <div class="inventory-header">
                <h2>${item.inv_year} ${item.inv_make} ${item.inv_model}</h2>
                <div class="inventory-price">
                    Price: ${price}
                </div>
            </div>
            <div class="inventory-image">
                <img src="${item.inv_image}" alt="${item.inv_year} ${item.inv_make} ${item.inv_model}">
            </div>
            <div class="inventory-details-container">
                <div class="inventory-details">
                    <div class="inventory-details-header">
                        Vehicle Details
                    </div>
                    <div style="padding: 1rem 0;">
                        <div class="inventory-details-section">
                            <div>
                                <div>
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 256 256" style="width: 25px;height: auto;">
                                            <path fill="currentColor" d="M207.06 80.67A111.24 111.24 0 0 0 128 48h-.4C66.07 48.21 16 99 16 161.13V184a16 16 0 0 0 16 16h192a16 16 0 0 0 16-16v-24a111.25 111.25 0 0 0-32.94-79.33ZM224 184H119.71l54.76-75.3a8 8 0 0 0-12.94-9.42L99.92 184H32v-22.87c0-3.08.15-6.12.43-9.13H56a8 8 0 0 0 0-16H35.27c10.32-38.86 44-68.24 84.73-71.66V88a8 8 0 0 0 16 0V64.33A96.14 96.14 0 0 1 221 136h-21a8 8 0 0 0 0 16h23.67c.21 2.65.33 5.31.33 8Z"/>
                                        </svg>
                                    </div>
                                    <div>Mileage</div>
                                </div>
                                <div class="inventory-details-value">${miles}</div>
                            </div>
                        </div>
                        <div class="inventory-details-section">
                            <div>
                                <div>
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 2048 2048" style="width: 20px;height: auto;">
                                            <path fill="currentColor" d="M1024 0q141 0 272 36t245 103t207 160t160 208t103 245t37 272q0 141-36 272t-103 245t-160 207t-208 160t-245 103t-272 37q-53 0-99-20t-81-55t-55-81t-21-100q0-49 9-85t24-67t31-56t31-52t23-56t10-68q0-52-20-99t-55-81t-82-55t-99-21q-38 0-67 9t-56 24t-53 31t-56 31t-67 23t-85 10q-53 0-99-20t-81-55t-55-81t-21-100q0-141 36-272t103-245t160-207t208-160T751 37t273-37zm0 1920q123 0 237-32t214-90t182-141t140-181t91-214t32-238q0-123-32-237t-90-214t-141-182t-181-140t-214-91t-238-32q-123 0-237 32t-214 90t-182 141t-140 181t-91 214t-32 238q0 27 10 50t27 40t41 28t50 10q38 0 67-9t56-24t52-31t55-31t67-23t87-10q80 0 150 30t122 82t82 122t30 150q0 49-9 86t-24 67t-31 55t-31 52t-23 56t-10 68q0 27 10 50t27 40t41 28t50 10zM512 640q27 0 50 10t40 27t28 41t10 50q0 27-10 50t-27 40t-41 28t-50 10q-27 0-50-10t-40-27t-28-41t-10-50q0-27 10-50t27-40t41-28t50-10zm384-256q27 0 50 10t40 27t28 41t10 50q0 27-10 50t-27 40t-41 28t-50 10q-27 0-50-10t-40-27t-28-41t-10-50q0-27 10-50t27-40t41-28t50-10zm512 384q-27 0-50-10t-40-27t-28-41t-10-50q0-27 10-50t27-40t41-28t50-10q27 0 50 10t40 27t28 41t10 50q0 27-10 50t-27 40t-41 28t-50 10zm128 256q27 0 50 10t40 27t28 41t10 50q0 27-10 50t-27 40t-41 28t-50 10q-27 0-50-10t-40-27t-28-41t-10-50q0-27 10-50t27-40t41-28t50-10zm-256 384q27 0 50 10t40 27t28 41t10 50q0 27-10 50t-27 40t-41 28t-50 10q-27 0-50-10t-40-27t-28-41t-10-50q0-27 10-50t27-40t41-28t50-10z"/>
                                        </svg>
                                    </div>
                                    <div>Color</div>
                                </div>
                                <div class="inventory-details-value">
                                    <div style="background-color:${item.inv_color};"></div>
                                    ${item.inv_color}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="inventory-description">
                    <div class="inventory-details-header">Description</div>
                    <div>
                        <p>${item.inv_description}</p>
                    </div>
                </div>
            </div>
        `;
    }
    return content;
}

/* **************************************
* Build management view HTML
* ************************************ */
Util.buildManagementView = async function(req, res, next) {
    const content = `<div>
        <a class="btn" href="/inv/classification/add">
            <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path fill="currentColor" d="M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm10 22h-8v8h-4v-8h-8v-4h8v-8h4v8h8v4z"/>
            </svg>
            Add New Classification
        </a>
        <a class="btn" href="/inv/add">
            <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path fill="currentColor" d="M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm10 22h-8v8h-4v-8h-8v-4h8v-8h4v8h8v4z"/>
            </svg>
            Add New Vehicle
        </a>
    </div>`;
    return content;
}

/* **************************************
* Build classification input list
* ************************************ */
Util.buildClassificationList = async function(classification_id = null) {
    let classificationList = ""
    const classifications = await invModel.getClassifications()
    const list = classifications.rows
    if (list.length > 0) {
        list.forEach((item) => {
            let classId = item.classification_id;
            classificationList += `<option value="${classId}"`
            if (classId == classification_id) {
                classificationList += " selected"
            }
            classificationList += `>${item.classification_name}</option>`
        })
    }
    return classificationList;
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util
