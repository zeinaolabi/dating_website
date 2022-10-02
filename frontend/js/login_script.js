//Initialize variables
const openSignin = document.getElementById("open_signin");
const openSignup = document.getElementById("open_signup");
const signinModal = document.getElementById("signin_container");
const signupModal = document.getElementById("signup_container");

openSignin.onclick = () =>{
    signinModal.style.display = "flex";
    signupModal.style.display = "none";
}

openSignup.onclick = () =>{
    signupModal.style.display = "flex";
    signinModal.style.display = "none";
}

