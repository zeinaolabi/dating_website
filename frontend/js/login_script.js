//Initialize APIS
const loginAPI = "http://127.0.0.1:8001/api/login";

//Initialize variables
const openSignin = document.getElementById("open_signin");
const openSignup = document.getElementById("open_signup");
const signinModal = document.getElementById("signin_container");
const signupModal = document.getElementById("signup_container");

const loginButton = document.getElementById("login");
const email = document.getElementById("email");
const password = document.getElementById("password");
const error = document.getElementById("error");

const new_email = document.getElementById("new_email");
const new_username = document.getElementById("new_username");
const new_password = document.getElementById("new_password");
const new_firstName = document.getElementById("new_first_name");
const new_lastName = document.getElementById("new_last_name");
const new_address = document.getElementById("new_address");
const new_phoneNumber = document.getElementById("new_phone_number");

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
    const data = new FormData();
    data.append("email", new_email.value);
    data.append("username", new_username.value);
    data.append("password", new_password.value);
    data.append("firstName", new_firstName.value);
    data.append("lastName", new_lastName.value);
    data.append("address", new_address.value);
    data.append("phoneNumber", new_phoneNumber.value);

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

loginButton.addEventListener("click", login);
