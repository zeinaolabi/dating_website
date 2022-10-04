//Initialize APIs
export const baseURL = "http://127.0.0.1:8001/api/auth/"
const updateProfileAPI = "update_profile";
const getInfoAPI = "get_profile_info/";

//Initialize variables
export const userID = localStorage.getItem("userID");
const openEditModal = document.getElementById("open_edit_modal");
const openMatchModal = document.getElementById("open_match_modal");
const openHomeBtn = document.getElementById("open_home");
const openChatBtn = document.getElementById("open_chat");
const openFavBtn = document.getElementById("open_fav");
const openBlockedPage = document.getElementById("open_blocked");
const editModal = document.getElementById("edit_profile_modal");
export const matchModal = document.getElementById("match_modal");
const close = document.getElementById("close");
const close2 = document.getElementById("close2");

const editButton = document.getElementById("edit_profile");
const locationButton = document.getElementById("location_btn");
const visibilityButton = document.getElementById("visibility_btn");
const visibilityStatus = document.getElementById("visibility");
const newName = document.getElementById("new_name");
const newBio = document.getElementById("new_bio");
const getPosition = document.getElementById("demo");
const error = document.getElementById("error");
let latitude = "";
let longitude = "";
let visibility;
let gender_id;

const addedImage = document.getElementById("added_image");
const profilePicture = document.querySelector(".profile_picture");
const name = document.getElementById("name");
const bio = document.getElementById("bio");
const logoutButton = document.getElementById("logout");
export const config = {
    headers: {
      Authorization: localStorage.getItem("token")
    }
}

//Remove info from local storage and redirect to login page
logoutButton.onclick = function() {
    localStorage.clear();
    window.location.replace("login_page.html");
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

openBlockedPage.onclick = function() {
    window.location.replace("blocked_page.html");
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

const getUserInfo = async () =>{
    axios(baseURL + getInfoAPI + userID, config)
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

        //Change the visibility accordingly
        visibility = response.data[0].visibility;
        if(visibility == 1){
            visibilityStatus.textContent = "ON";
        }
        else{
            visibilityStatus.textContent = "OFF";
        }

        localStorage.setItem("interestedInGender", response.data[0].gender_id)
    })
}

const updateProfile = async () => {
    //Save user's data
    const data = new FormData();
    data.append("id", userID);

    if(newName.value != ""){
        data.append("name", newName.value);
    }

    if(newBio.value != ""){
        if(newBio.value.length > 50){
            error.textContent = "Bio should be less than 50 chars"
            return;
        }
        data.append("bio", newBio.value);
    }

    //Calculate age
    const chosenYear = year.options[year.selectedIndex];
    const currentYear = new Date().getFullYear();

    if(chosenYear.value != "Year"){
        const age = currentYear - chosenYear.value;
        data.append("age", age);
    }
    
    //Get the checked values
    const checkedValue = []; 
    const inputElements = document.getElementsByClassName('interest');
    for(let i=0; i < inputElements.length; i++){
        if(inputElements[i].checked){
            checkedValue.push(inputElements[i].value);
        }
    }

    if(checkedValue.length != 0){
        //Save the id of the interested gender
        if(checkedValue.length == 1 && checkedValue[0] == "Female"){
            gender_id = 1;
        }
        else if(checkedValue.length == 1 && checkedValue[0] == "Male"){
            gender_id = 2;
        }
        else{
            gender_id = 3;
        }
        data.append("gender_id", gender_id)
    }

    if(longitude != "" && latitude != ""){
        data.append("longitude", longitude);
        data.append("latitude", latitude);
    }

    data.append("visibility", visibility);

    //Send data to the server using axios
    axios.post(baseURL + updateProfileAPI, data, config)
    .then(
        response =>  {

        localStorage.setItem("InterestedIn", response.data.user.interested_in);

        //Redirect to main page
        window.location.replace("main_page.html");
        error.textContent = "";
    })
    .catch((e)=>
        error.textContent = "Invalid input");
}

const getLocation = async () => {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(position => {
            resolve(showPosition(position)); 
        } , reject);
    });
}
  
const showPosition = (position) => {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    getPosition.innerHTML = "Latitude: " + latitude + 
    "<br>Longitude: " + longitude;
}

editButton.addEventListener("click", updateProfile);
visibilityButton.addEventListener("click", (event) =>{
    if(visibility == 1){
        visibility = 0;
        visibilityStatus.textContent = "OFF";
    }
    else{
        visibility = 1;
        visibilityStatus.textContent = "ON";
    }
})
locationButton.addEventListener("click", (event)=>{
    getPosition.innerHTML = "Please wait!";
    getLocation();
})
getUserInfo();
