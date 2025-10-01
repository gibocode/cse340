const form = document.querySelector("#updateForm")
form.addEventListener("change", function () {
    const updateBtn = document.querySelector(".update-inventory-button")
    updateBtn.removeAttribute("disabled")
})
