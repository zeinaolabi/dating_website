//Initialize APIS
const loginAPI = "http://127.0.0.1:8001/api/login";
const registerAPI = "http://127.0.0.1:8001/api/register";

//Initialize variables
const openSignin = document.getElementById("open_signin");
const openSignup = document.getElementById("open_signup");
const signinModal = document.getElementById("signin_container");
const signupModal = document.getElementById("signup_container");

const loginButton = document.getElementById("login");
const email = document.getElementById("email");
const password = document.getElementById("password");
const error = document.getElementById("error");

const registerButton = document.getElementById("create_account");
const locationButton = document.getElementById("location_btn");
const newName = document.getElementById("new_name");
const newEmail = document.getElementById("new_email");
const newPassword = document.getElementById("new_password");
const newLocation = document.getElementById("new_address");
const gender_id = 3;
const x = document.getElementById("demo");

//On click, show signup block
openSignin.onclick = () =>{
    signinModal.style.display = "flex";
    signupModal.style.display = "none";
}

//On click, show signin block
openSignup.onclick = () =>{
    signupModal.style.display = "flex";
    signinModal.style.display = "none";
}

const login = () => {
    
    //Save data
    const data = new FormData();
    data.append("email", email.value);
    data.append("password", password.value);

    //Send request to the server using axios
    axios.post(loginAPI, data)
    .then(function (response) {
        console.log(response);
        if(response.message != null ){
            error.textContent = "Invalid input";
            return;
        }

        //Save the token and the user ID on login
        localStorage.setItem("userID", response.data.user.id)
        localStorage.setItem("token", response.data.access_token)

        window.location.replace("main_page.html");   
        error.textContent = "";
    })
    .catch((e)=>
        error.textContent = "Invalid input");
}

const createNewAccount = () => {
    //Save user's data
    const chosenYear = year.options[year.selectedIndex];
    const currentYear = new Date().getFullYear() ;
    const age = currentYear - chosenYear.value;
    const gender = document.querySelector('input[name="gender"]:checked').value;

    var checkedValue = []; 
    var inputElements = document.getElementsByClassName('interest');
    for(var i=0; i < inputElements.length; i++){
          if(inputElements[i].checked){
               checkedValue.push(inputElements[i].value);
          }
    }

    if(checkedValue.length == 1 && checkedValue[0] == "Female"){
        gender_id = 1
    }
    else if(checkedValue.length == 1 && checkedValue[0] == "Male"){
        gender_id = 2
    }

    const data = new FormData();
    data.append("name", newName.value);
    data.append("email", newEmail.value);
    data.append("password", newPassword.value);
    data.append("age", age);
    data.append("gender", gender);
    data.append("gender_id", gender_id)
    data.append("longitude", longitude);
    data.append("latitude", latitude);

    //Send data to the server using axios
    axios.post(signupAPI, data)
    .then(
        response =>  {

        //Save token and ID in the local storage
        localStorage.setItem("userID", response.data.id)
        localStorage.setItem("token", response.data.token)

        //refresh page
        window.location.replace("landingPage.html");
    })
    .catch((e)=>
        errorCreate.textContent = "Invalid input");
}

async function getLocation() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(position => {
        resolve(showPosition(position)); 
      } , reject);
    });
}
  
function showPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude
    x.innerHTML = "Latitude: " + latitude + 
    "<br>Longitude: " + longitude;
}

loginButton.addEventListener("click", login);
registerButton.addEventListener("click", createNewAccount);
locationButton.addEventListener("click", getLocation())