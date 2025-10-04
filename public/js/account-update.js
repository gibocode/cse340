const form = document.querySelector("#updateAccountForm")
form.addEventListener("change", function () {
    const updateBtn = document.querySelector(".update-account-button")
    updateBtn.removeAttribute("disabled")
})
