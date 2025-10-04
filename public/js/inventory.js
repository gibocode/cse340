'use strict'

// Get a list of items in inventory based on the classification_id
let classificationList = document.querySelector('#classificationList')
classificationList.addEventListener("change", async function() {
    let classification_id = classificationList.value
    console.log(`classification_id is: ${classification_id}`)
    let classIdURL = "/inv/getInventory/" + classification_id
    await fetch(classIdURL)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
            throw Error("Network response was not OK")
        })
        .then(function (data) {
            console.log(data)
            buildInventoryList(data)
        })
        .catch(function (error) {
            console.log('There was a problem', error.message)
        })
})

// Build inventory items into HTML table components and inject into DOM
function buildInventoryList(data) {
    let inventoryDisplay = document.getElementById("inventoryDisplay");
    // Set up the table labels
    let dataTable = '<thead>';
    dataTable += '<tr><th>Vehicle Name</th><td>&nbsp;</td><td>&nbsp;</td></tr>';
    dataTable += '</thead>';
    // Set up the table body
    dataTable += '<tbody>';
    // Iterate over all vehicles in the array and put each in a row
    data.forEach(function (element) {
        console.log(element.inv_id + ", " + element.inv_model);
        dataTable += `<tr><td>${element.inv_make} ${element.inv_model}</td>`;
        dataTable += `<td><a href='/inv/edit/${element.inv_id}' title='Click to update' class="btn btn-sm">
            <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="m18.988 2.012 3 3L19.701 7.3l-3-3zM8 16h3l7.287-7.287-3-3L8 13z"/>
                <path d="M19 19H8.158c-.026 0-.053.01-.079.01-.033 0-.066-.009-.1-.01H5V5h6.847l2-2H5c-1.103 0-2 .896-2 2v14c0 1.104.897 2 2 2h14a2 2 0 0 0 2-2v-8.668l-2 2V19z"/>
            </svg>Modify</a></td>`;
        dataTable += `<td><a href='/inv/delete/${element.inv_id}' title='Click to delete' class="btn btn-sm btn-danger">
            <svg fill="currentColor" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                <path d="M341,128V99c0-19.1-14.5-35-34.5-35H205.4C185.5,64,171,79.9,171,99v29H80v32h9.2c0,0,5.4,0.6,8.2,3.4c2.8,2.8,3.9,9,3.9,9  l19,241.7c1.5,29.4,1.5,33.9,36,33.9h199.4c34.5,0,34.5-4.4,36-33.8l19-241.6c0,0,1.1-6.3,3.9-9.1c2.8-2.8,8.2-3.4,8.2-3.4h9.2v-32  h-91V128z M192,99c0-9.6,7.8-15,17.7-15h91.7c9.9,0,18.6,5.5,18.6,15v29H192V99z M183.5,384l-10.3-192h20.3L204,384H183.5z   M267.1,384h-22V192h22V384z M328.7,384h-20.4l10.5-192h20.3L328.7,384z"/>
            </svg>Delete</a></td></tr>`;
    })
    dataTable += '</tbody>';
    // Display the contents in the Inventory Management view
    inventoryDisplay.innerHTML = dataTable;
}
