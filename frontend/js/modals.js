//Initialize APIs
const baseURL = "http://127.0.0.1:8001/api/auth/"
const updateProfileAPI = "update_profile";
const getInfoAPI = "get_profile_info/";


//Initialize variables
const userID = localStorage.getItem("userID");
const openEditModal = document.getElementById("open_edit_modal");
const openMatchModal = document.getElementById("open_match_modal");
const openHomeBtn = document.getElementById("open_home");
const openChatBtn = document.getElementById("open_chat");
const openFavBtn = document.getElementById("open_fav");
const editModal = document.getElementById("edit_profile_modal");
const matchModal = document.getElementById("match_modal");
const close = document.getElementById("close");
const close2 = document.getElementById("close2");

const addedImage = document.getElementById("added_image");
const profilePicture = document.querySelector(".profile_picture");
const name = document.getElementById("name");
const bio = document.getElementById("bio");
const config = {
    headers: {
      Authorization: localStorage.getItem("token")
    }
}

// When the user clicks on the button, open the modal
openEditModal.onclick = function() {
    editModal.style.display = "block";
}

openMatchModal.onclick = function() {
    matchModal.style.display = "block";
}

//When the user clicks on x, close the modal
close.onclick = function() {
    editModal.style.display = "none";
}

close2.onclick = function() {
    matchModal.style.display = "none";
}

// When the user clicks on the button, open the given page
openHomeBtn.onclick = function() {
    window.location.replace("main_page.html");
}

openChatBtn.onclick = function() {
    window.location.replace("chat_page.html");
}

openFavBtn.onclick = function() {
    window.location.replace("favorites_page.html");
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

addedImage.addEventListener('change',()=>{
    //Save added image value and files
    const addedImageValue = addedImage.value;
    const [file] = addedImage.files;
    
    //If picture is empty, do nothing
    if(addedImageValue == ""){
        return
    }
        
    const updateProfilePicture = (base64Image) => {
        const data = new FormData();
        data.append("id", userID);
        data.append("image", base64Image);
    
        //Send data to the server using axios
        axios.post(baseURL + updateProfileAPI, data, config)
        .then(
            response =>  {
    
                if(file){
                    profilePicture.src = base64Image;
                }
        })
        .catch((e)=>{
            console.log(e);
        })
    }
    
    const reader = new FileReader();
    reader.addEventListener("load", (event) => {
        // convert image file to base64 string
        updateProfilePicture(event.currentTarget.result)
    }, false);
    
    if(file){
        reader.readAsDataURL(file);
    }
})

const getUserInfo = () =>{
    //Get request to get the users info from the server
    axios(baseURL + getInfoAPI + userID)
    .then( response =>{

        //If a profile image is assigned, display it
        if(response.data[0].image != null){
            profilePicture.src = 'data:image/png;base64,' + response.data[0].image;
        }

        //If a name is assigned, display it
        if(response.data[0].name != null){
            name.innerText = response.data[0].name;
        }

        //If a bio is assigned, display it
        if(response.data[0].bio != null){
            bio.innerText = response.data[0].bio;
        }
    })
}

getUserInfo();
