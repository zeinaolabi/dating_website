//Initialize APIs
const baseURL = "http://127.0.0.1:8001/api/auth/";
const getChattedWithAPI = "get_chatted_with/";
const getMessagesAPI = "get_chat/";
const sendMessageAPI = "send_message"

//Initialize variables
const openHomeBtn = document.getElementById("open_home");
const openChatBtn = document.getElementById("open_chat");
const openFavBtn = document.getElementById("open_fav");
const sendMessageBtn = document.getElementById("send_message");
const messageToSend = document.getElementById("written_message");
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
    // Send the data to the database using axios
    axios(baseURL + getChattedWithAPI + userID, config) 
    .then(
        response =>  {
            //Loop over the response
            for(let i = 0; i < response.data.length; i++){
                
                //Make a clone of the user chat
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
    document.getElementById("send_message_container").style.display = "flex";

    axios.get(baseURL + getMessagesAPI + userID + "/" + chattedWithID, config)
    .then(response => {
        //Empty the div each time a new chat is open
        document.querySelector(".messages").innerHTML = "<div id='message' class='message'><p class='message_content'></p></div>";

        for(let i = 0; i < response.data.data.length; i++){
            //Make a clone of the chat
            let originalModel = document.querySelector(".message");
            let clone = originalModel.cloneNode(true);

            clone.style.display ="block";
            clone.id= response.data.data[i].id;
            clone.classList.add("message");

            //If the message is from the user, add a new style class
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

    sendMessageBtn.addEventListener("click", (event)=>{
        if(messageToSend.value == null || messageToSend.length > 150){
            return;
        }

        //Send message according to the user's input
        const data = new FormData();
        data.append("sender_id", userID);
        data.append("receiver_id", chattedWithID);
        data.append("message", messageToSend.value);

        axios.post(baseURL + sendMessageAPI, data, config)
        .then(response => {
            //Refresh page on response
            window.location.replace("chat_page.html");
        })
    })    
}

viewChattedWith();