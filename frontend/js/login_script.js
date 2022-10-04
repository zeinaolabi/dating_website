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
const getPosition = document.getElementById("demo");
const errorCreate = document.getElementById("error_create");
let gender_id = 3;
let latitude = "";
let longitude = "";

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

    //Calculate age
    const gender = document.querySelector('input[name="gender"]:checked');
    const chosenYear = year.options[year.selectedIndex];
    const currentYear = new Date().getFullYear() ;

    if(chosenYear == null || gender == null || newName == null || 
        newEmail == null || newPassword == null || longitude == "" || latitude == ""){
        errorCreate.textContent = "Missing field";
        return;
    }
    
    const age = currentYear - chosenYear.value;

    //Get the checked values
    const checkedValue = []; 
    const inputElements = document.getElementsByClassName('interest');
    for(let i=0; i < inputElements.length; i++){
        if(inputElements[i].checked){
            checkedValue.push(inputElements[i].value);
        }
    }

    //Save the id of the interested gender
    if(checkedValue.length == 1 && checkedValue[0] == "Female"){
        gender_id = 1
    }
    else if(checkedValue.length == 1 && checkedValue[0] == "Male"){
        gender_id = 2
    }

    //Save user's data
    const data = new FormData();
    data.append("name", newName.value);
    data.append("email", newEmail.value);
    data.append("password", newPassword.value);
    data.append("age", age);
    data.append("gender", gender.value);
    data.append("gender_id", gender_id)
    data.append("longitude", longitude);
    data.append("latitude", latitude);

    //Send data to the server using axios
    axios.post(registerAPI, data)
    .then(
        response =>  {

        //Save token and ID in the local storage
        localStorage.setItem("userID", response.data.id)
        localStorage.setItem("token", response.data.token)

        //Redirect to main page
        window.location.replace("main_page.html");
        errorCreate.textContent = "";
    })
    .catch((e)=>
        errorCreate.textContent = "Invalid input");
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

loginButton.addEventListener("click", login);
registerButton.addEventListener("click", createNewAccount);
locationButton.addEventListener("click", (event)=>{
    getPosition.innerHTML = "Please wait!";
    getLocation();
})