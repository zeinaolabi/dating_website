//Initialize variables
const openEditModal = document.getElementById("open_edit_modal");
const editModal = document.getElementById("edit_profile_modal");
const close = document.getElementById("close");

// When the user clicks on the button, open the modal
openEditModal.onclick = function() {
    editModal.style.display = "block";
}

//When the user clicks on x, close the modal
close.onclick = function() {
    editModal.style.display = "none";
}

//When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if(event.target == editModal) {
        editModal.style.display = "none";
    }
}