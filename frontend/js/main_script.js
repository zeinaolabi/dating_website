import {matchModal, baseURL, userID, config} from './modals.js';

//Initialize APIs
const getMatchesAPI = "get_matches/"
const getFemaleMatches = "get_female_matches/"
const getMaleMatches = "get_male_matches/"
const getMatchAPI = "get_match/"
const isFavoredAPI = "is_favored/";
const addtoFavAPI = "add_to_favorites";
const removeFromFavAPI = "remove_from_favorites";
const isBlockedAPI = "is_blocked/";
const blockAPI = "block";
const unblockAPI = "unblock";
const sendMessageAPI = "send_message"
let matchesAPI;

const viewMatches = async () =>{
    if(localStorage.getItem("interestedInGender") == 1){
        matchesAPI = getFemaleMatches;
    }
    else if(localStorage.getItem("interestedInGender") == 2){
        matchesAPI = getMaleMatches;
    }
    else{
        matchesAPI = getMatchesAPI;
    }
    // Send the data to the database using POST method
    axios(baseURL + matchesAPI + userID, config) 
    .then(
        response =>  {
            //Loop over the response
            for(let i = 0; i < response.data.length; i++){
                //Make a clone of the match model
                let originalMatch = document.querySelector(".match");
                let clone = originalMatch.cloneNode(true);
                clone.style.display ="block";
                clone.id= response.data[i].id;
                clone.classList.add("match");

                //Get the match's name
                let matchesNames = clone.querySelector(".matchs_name");
                matchesNames.textContent = response.data[i].name;

                //Get the match's bio
                let matchesBios = clone.querySelector(".matchs_bio");
                matchesBios.textContent = response.data[i].bio;

                //Get the match's profile picture
                let matchesPictures = clone.querySelector(".matchs_picture");
                if(response.data[i].image != ""){
                    matchesPictures.src = "data:image/png;base64," + response.data[i].image;
                }
                
                //Add div after the original match
                originalMatch.after(clone);
                clone.setAttribute("matchID", response.data[i].id);
                clone.addEventListener("click", openMatch);
            }
    })
}

const openMatch = async (event) => {
    matchModal.style.display = "block";
    const matchID = event.currentTarget.getAttribute("matchID");

    axios.get(baseURL + getMatchAPI + matchID, config)
    .then(response => {
                 //Make a clone of the tweet model
        let originalModal = document.getElementById("match_modal");
        let clone = originalModal.cloneNode(true);
        clone.style.display ="block";
        clone.id= response.data[0].id;
        clone.classList.add("modal");

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

        // Get like buttons, and save the match id
        let likeButton = clone.querySelector(".like_button");
        likeButton.setAttribute('data', response.data[0].id);

        //Check if the match is liked or not
        axios.get(baseURL + isFavoredAPI + userID + "/" + matchID, config)
        .then(response =>{
            //Save the result of the match is liked or not, change the button accordingly
            likeButton.setAttribute('isLiked', response.data.isLiked);
            likeButton.querySelector("#like_image").src = response.data.isLiked ? "styles/images/redheart.png" : "/styles/images/heart.png";
            likeButton.querySelector("#fav_status").textContent = response.data.isLiked ? "Remove from Favorites" : "Add to favorites";

            //When like button is clicked, send a request to the server
            likeButton.addEventListener('click', (event) => {
                let matchID = event.currentTarget.getAttribute('data');
                let isLiked = event.currentTarget.getAttribute('isLiked') === "true";
                let likeAPI = isLiked ? removeFromFavAPI : addtoFavAPI;

                const data = new FormData();
                data.append("favoreduser_id", matchID);
                data.append("user_id", userID);
                
                //Send data to the server using axios
                axios.post(baseURL + likeAPI, data, config)
                .then(response =>  {
                    //Change button image on click
                    likeButton.setAttribute('isLiked', !isLiked);
                    likeButton.querySelector("#like_image").src = isLiked ? "/styles/images/heart.png" : "styles/images/redheart.png";
                    likeButton.querySelector("#fav_status").textContent = isLiked ? "Add to favorites" : "Remove from Favorites";
                })
            });
        }
        )

        // Get block buttons, and save the match id
        let blockButton = clone.querySelector(".block_button");
        blockButton.setAttribute('data', response.data[0].id);

        //Check if the user is blocked or not
        axios.get(baseURL + isBlockedAPI + userID + "/" + matchID, config)
        .then(response =>{
            //Save the result of the match is liked or not, change the button accordingly
            blockButton.setAttribute('isBlocked', response.data.isBlocked);
            blockButton.querySelector("#block_image").src = response.data.isBlocked ? "styles/images/unblock.png" : "/styles/images/block.png";
            blockButton.querySelector("#block_status").textContent = response.data.isBlocked ? "Unblock" : "Block";

            //When like button is clicked, send a request to the server
            blockButton.addEventListener('click', (event) => {
                let matchID = event.currentTarget.getAttribute('data');
                let isBlocked = event.currentTarget.getAttribute('isBlocked') === "true";
                let blockingAPI = isBlocked ? unblockAPI : blockAPI;

                const data = new FormData();
                data.append("blockeduser_id", matchID);
                data.append("user_id", userID);
                
                //Send data to the server using axios
                axios.post(baseURL + blockingAPI, data, config)
                .then(response =>  {
                    //Change button image on click
                    blockButton.setAttribute('isBlocked', !isBlocked);
                    blockButton.querySelector("#block_image").src = isBlocked ? "/styles/images/block.png" : "styles/images/unblock.png";
                    blockButton.querySelector("#block_status").textContent = isBlocked ? "Block" : "Unblock";
                })
            });
        }
        )

        let sendMessageButton = clone.querySelector(".sendmessage");

        sendMessageButton.addEventListener("click", (event) => {
            const data = new FormData();
            data.append("sender_id", userID);
            data.append("receiver_id", matchID);
            data.append("message", "Hi!");
    
            axios.post(baseURL + sendMessageAPI, data, config)
            .then(response => {
                window.location.replace("chat_page.html");
            })
        })
   
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

viewMatches();