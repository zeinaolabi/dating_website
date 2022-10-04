import {matchModal, baseURL, userID, config} from './modals.js';

//Initialize APIs
const getBlockedAPI = "get_blocked/"
const getMatchAPI = "get_match/"
const isBlockedAPI = "is_blocked/";
const blockAPI = "block";
const unblockAPI = "unblock";

const viewMatches = async () =>{
    // Send the data to the database using axios
    axios(baseURL + getBlockedAPI +userID, config) 
    .then(
        response =>  {
            //Loop over the response
            for(let i = 0; i < response.data.length; i++){
                //Make a clone of the match model
                let originalMatch = document.querySelector(".match");
                let clone = originalMatch.cloneNode(true);
                clone.style.display ="block";
                clone.id= response.data[i].blockeduser_id;
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
                clone.setAttribute("matchID", response.data[i].blockeduser_id);
                clone.addEventListener("click", openMatch);
            }
    })
}

const openMatch = async (event) => {
    matchModal.style.display = "block";
    const matchID = event.currentTarget.getAttribute("matchID");

    axios.get(baseURL + getMatchAPI + matchID, config)
    .then(response => {

        //Make a clone of the match modal
        let originalModal = document.getElementById("match_modal");
        let clone = originalModal.cloneNode(true);
        clone.style.display ="block";
        clone.id= response.data[0].user_id;
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
        let blockButton = clone.querySelector(".block_button");
        blockButton.setAttribute('data', response.data[0].id);

        //Check if the user is blocked or not
        axios.get(baseURL + isBlockedAPI + userID + "/" + response.data[0].id, config)
        .then(response =>{
            console.log(response)
            //Save the result of the match is blocked or not, change the button accordingly
            blockButton.setAttribute('isBlocked', response.data.isBlocked);
            blockButton.querySelector("#block_image").src = response.data.isBlocked ? "styles/images/unblock.png" : "/styles/images/block.png";
            blockButton.querySelector("#block_status").textContent = response.data.isBlocked ? "Unblock" : "Block";

            //When block button is clicked, send a request to the server
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