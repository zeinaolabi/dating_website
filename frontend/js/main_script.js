//Initialize variables
const openEditModal = document.getElementById("open_edit_modal");
const openMatchModal = document.getElementById("open_match_modal");
const openChatBtn = document.getElementById("open_chat");
const openFavBtn = document.getElementById("open_fav");
const editModal = document.getElementById("edit_profile_modal");
const matchModal = document.getElementById("match_modal");
const close = document.getElementById("close");
const close2 = document.getElementById("close2");

// When the user clicks on the button, open the modal
openEditModal.onclick = function() {
    editModal.style.display = "block";
}

// When the user clicks on the button, open the modal
openMatchModal.onclick = function() {
    matchModal.style.display = "block";
}

//When the user clicks on x, close the modal
close.onclick = function() {
    editModal.style.display = "none";
}

//When the user clicks on x, close the modal
close2.onclick = function() {
    matchModal.style.display = "none";
}

// When the user clicks on the button, open the modal
openChatBtn.onclick = function() {
    window.replace
}

// When the user clicks on the button, open the modal
openFavBtn.onclick = function() {
    editModal.style.display = "block";
}

//When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if(event.target == editModal) {
        editModal.style.display = "none";
    }
    if(event.target == matchModal) {
        matchModal.style.display = "none";
    }
}
