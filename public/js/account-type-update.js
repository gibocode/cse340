const form = document.querySelector("#updateAccountTypeForm")
form.addEventListener("change", function () {
    const updateBtn = document.querySelector(".update-account-type-button")
    updateBtn.removeAttribute("disabled")
})
