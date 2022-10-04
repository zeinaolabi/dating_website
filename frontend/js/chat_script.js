//Initialize APIs
const baseURL = "http://127.0.0.1:8001/api/auth/";
const getChattedWithAPI = "get_chatted_with/";
const getMessagesAPI = "/get_chat";

//Initialize variables
const openHomeBtn = document.getElementById("open_home");
const openChatBtn = document.getElementById("open_chat");
const openFavBtn = document.getElementById("open_fav");
const userID = localStorage.getItem("userID");
const config = {
    headers: {
      Authorization: localStorage.getItem("token")
    }
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

const viewChattedWith = async () =>{
    // Send the data to the database using POST method
    axios(baseURL + getChattedWithAPI + userID, config) 
    .then(
        response =>  {
            console.log(response);
            //Loop over the response
            for(let i = 0; i < response.data.length; i++){
                
                //Make a clone of the match model
                let originalModel = document.querySelector(".user_chat");
                let clone = originalModel.cloneNode(true);
                clone.style.display ="flex";
                clone.id= response.data[i].id;
                clone.classList.add("user_chat");

                //Get the user's name
                let username = clone.querySelector(".user_name");
                username.textContent = response.data[i].name;

                //Get the user's profile picture
                let userPicture = clone.querySelector(".user_profile");
                if(response.data[i].image != ""){
                    userPicture.src = "data:image/png;base64," + response.data[i].image;
                }

                //Add div after the original match
                originalModel.after(clone);
                clone.setAttribute("userID", response.data[i].id);
                clone.addEventListener("click", openChat);
            }
    })
}

const openChat = async (event) => {
    matchModal.style.display = "block";
    const chattedWithID = event.currentTarget.getAttribute("userID");

    axios.get(baseURL + getMessagesAPI + userID + "/" + chattedWithID, config)
    .then(response => {
        //Make a clone of the tweet model
        let originalModal = document.getElementById("message");
        let clone = originalModal.cloneNode(true);
        clone.style.display ="block";
        clone.id= response.data[0].id;
        if(response.data[0].sender_id == userID){
            clone.classList.add("darker");
        }

        //Get the match's name
        let matchName = clone.querySelector(".match_name");
        matchName.textContent = response.data[0].name;

        //Get the match's bio
        let matchBio = clone.querySelector(".match_bio");
        matchBio.textContent = response.data[0].bio;

        //Get the match's age
        let matchAge = clone.querySelector(".match_age");
        matchAge.textContent = response.data[0].age + " years old";

        //Get the match's profile picture
        let matchPicture = clone.querySelector(".match_picture");
        if(response.data[0].image != ""){
            matchPicture.src = "data:image/png;base64," + response.data[0].image;
        }
   
        //Add div after the original modal
        originalModal.before(clone);
        originalModal.style.display = "none";

        window.onclick = function(event) {
            if (event.target == clone) {
                clone.style.display = "none";
            }
        }
        }
    )
}

viewChattedWith();