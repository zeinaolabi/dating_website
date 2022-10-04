//Initialize APIs
const baseURL = "http://127.0.0.1:8001/api/auth/";
const getChattedWithAPI = "get_chatted_with/";
const getMessagesAPI = "get_chat/";

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
    const chattedWithID = event.currentTarget.getAttribute("userID");

    axios.get(baseURL + getMessagesAPI + userID + "/" + chattedWithID, config)
    .then(response => {
        document.querySelector(".messages").innerHTML = "<div id='message' class='message'><p class='message_content'></p></div>";

        for(let i = 0; i < response.data.data.length; i++){
            //Make a clone of the match model
            let originalModel = document.querySelector(".message");
            let clone = originalModel.cloneNode(true);

            clone.style.display ="block";
            clone.id= response.data.data[i].id;
            clone.classList.add("message");

            if(response.data.data[i].sender_id == userID){
                console.log(clone.classList.add("darker"));
            }

            //Get the user's name
            let message = clone.querySelector(".message_content");
            message.textContent = response.data.data[i].message;

            //Add div after the original match
            originalModel.after(clone);
            }
        }
    )
}

viewChattedWith();