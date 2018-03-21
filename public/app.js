//FLOW: page loads w/ login prominent on top, gallery below
//user clicks login, form disappears/fades out w/ success message
// gallery appears w/ option to select their index page, edit/delete/create buttons
//user clicks register, if submitted correctly, same behavior as above w/login + success message at registering


//functions needed: logUserIn, registerUser, showRegisterForm, displayBtns, showIndexPage, create/edit/updatePosts, 
//checkPassword, checkUserName, showCreatePostForm, showUpdatePostForm, addPostToGallery


//misc questions: Forgotten password? (send email?)
//how to distinguish wrong password (i.e., existing user) from misspelled username?  

//BUTTONS AND INPUTS
const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const createBtn = document.getElementById("createBtn");
const updateBtn = document.getElementById("updateBtn");
const deleteBtn = document.getElementById("deleteBtn");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
const showIndexBtn = document.getElementById("showIndexBtn");
const hiddenBtns = [createBtn, updateBtn, deleteBtn, showIndexBtn];
let userNameInput = document.getElementById("username");
let passwordInput = document.getElementById("password");
let userNameVal;
let passwordVal;

//EVENT LISTENERS
loginBtn.addEventListener("click", logIn);
registerBtn.addEventListener("click", registerNewUser);
createBtn.addEventListener("click", createPost);
updateBtn.addEventListener("click", updatePost);
deleteBtn.addEventListener("click", deletePost);
showIndexBtn.addEventListener("click", showUserIndexPage);


//MESSAGES/ALERTS
const wrongUserName = 'Sorry, this user does not exist.  Please check the spelling or register a new account.';
const wrongPassword = 'Sorry, this password is incorrect';
const nameTaken = 'Sorry, that user already exists';
const deleteWarning = 'Are you sure you want to delete your post?';
const updateSuccessMsg = 'Post updated!';
const createSuccessMsg = 'Post created!';
const deleteSuccessMsg = 'Post deleted!';
// const loginSuccessMsg = `Welcome ${username}!  Good to see you again!`;
// const registerSuccessMsg = `Thanks for registering, ${username}!  Welcome to the Great Outdoors`;


//LOGIN FUNCTION DOES THE FOLLOWING:
//grab data, pass to login route to log user in
//if no data or incorrect data, give warning message
//reveal btns (showIndex, create/update/delete)
//https://v4-alpha.getbootstrap.com/components/alerts/

//COPY JWT STUFF
function logIn(event) {
    event.preventDefault();
    userNameVal = userNameInput.value;
    passwordVal = passwordInput.value;
    console.log(userNameVal);
    //if data submitted correctly, log someone in by displaying other buttons
    //possible errors: wrong password, wrong username (misspelled or doesn't exist), or username already taken
    //checkUserName fires appropriate message based on whatever error was committed
    if(checkUserName(usernameVal)) {
        //if userName 
        if(checkPassword(passwordVal)) {
            //show buttons 
            displayBtns();        
            //send username and password to routes?
        } else {
            //wrong password message shown here
        }
    } 
} //end of Login function

function checkPassword(password) {
    //this function only runs if checkUserName has run and validated that user exists in DB
    //if user exists in DB, check his pw against the one he entered in
}

function checkUserName(username) {
    //scenarios: user exists or does not
    //if existing in DB, pass the responsibility to checkPassword
    //if not existing in DB, fire wrongUName message and invite to registerNewUser
}

function displayBtns() {
    //show all hidden buttons
    hiddenBtns.forEach((btn)=> {
        btn.style.display = "inline-block";
    });
}


function showRegisterForm() {
    //if registerBtn clicked, open modal form for registration
}

function registerNewUser() {
    //add this user to DB
    // $.getJSON('/api/routes', //global bearer token attached to every request)
    // //show registerSuccessMsg
    // //displayBtns, as w/ successful login
    // displayBtns();
}

function showUserIndexPage() {
    //only runs if user is logged in; if so, runs via "Show your posts" button
    //display modal of user's posts?  index page?
}

//runs on clicking delete button
function deletePost() {
    //show deleteWarning and confirmDeleteButton
    //if confirmed, delete from DB
    //add option of notdeleteBtn?
    //shows deleteSuccessMsg
}

function createPost() {
  //fires when clicking createBtn
  //runs showCreatePostForm  
  //sends post data to POST route on DB
  //shows createSuccessMsg
}

function showCreatePostForm() {
    //open a createPost modal
    //modifies loginForm to show title, content, and image fields
}

function updatePost() {
    //fires when clicking updateBtn
    //runs showUpdatePostForm
    //sends updated data to PUT route on DB
    //shows updateSuccessMsg
}
function showUpdatePostForm() {
    //brings up same form as w/login/createPost, shows title/content/image fields
    //allows editing and submission (how?)
}

function addPostToGallery() {
    //add div element/thumbnail to gallery
}

 

