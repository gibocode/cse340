'use strict'

document.addEventListener("DOMContentLoaded", async () => {
    // Get all users
    await fetch("/user/getUsers")
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw Error("Network response was not OK");
        })
        .then(data => {
            console.log(data);
            buildUserList(data);
        })
        .catch(error => {
            console.log("There was a problem", error.message);
        });
});

// Build users list
function buildUserList(data) {
    const loader = document.querySelector(".loader-container");
    const userDisplay = document.getElementById("userDisplay");
    let html = `<thead>
            <tr>
                <th>Name</th><th>Type</th><td></td>
            </tr>
        </thead>
        <tbody>`;
    data.forEach(user => {
        html += `<tr>
            <td>${user.account_firstname} ${user.account_lastname}</td>
            <td>${user.account_type}</td>
            <td>
                <a href='/user/edit-account-type/${user.account_id}' title='Click to update' class="btn btn-sm">
                    <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="m18.988 2.012 3 3L19.701 7.3l-3-3zM8 16h3l7.287-7.287-3-3L8 13z"/>
                        <path d="M19 19H8.158c-.026 0-.053.01-.079.01-.033 0-.066-.009-.1-.01H5V5h6.847l2-2H5c-1.103 0-2 .896-2 2v14c0 1.104.897 2 2 2h14a2 2 0 0 0 2-2v-8.668l-2 2V19z"/>
                    </svg>
                    Change Account Type
                </a>
            </td>`;
    })
    html += "</tbody>";
    loader.classList.toggle("hide");
    userDisplay.innerHTML = html;
}
