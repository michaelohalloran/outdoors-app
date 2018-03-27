//FLOW: page loads w/ login prominent on top, gallery below
//user clicks login, form disappears/fades out w/ success message
// gallery appears w/ option to select their index page, edit/delete/create buttons
//user clicks register, if submitted correctly, same behavior as above w/login + success message at registering


//functions needed: logUserIn, registerUser, showRegisterForm, displayBtns, showIndexPage, create/edit/updatePosts, 
//checkPassword, checkUserName, showCreatePostForm, showUpdatePostForm, addPostToGallery, serverRequest


//misc questions: Forgotten password? (send email?)
//how to distinguish wrong password (i.e., existing user) from misspelled username?  


//BUTTONS AND INPUTS
const loginBtn = document.getElementById("loginBtn");
const loginOpen = document.getElementById("loginOpen");
const registerBtn = document.getElementById("registerBtn");
const createBtn = document.getElementById("createBtn");
const createOpen = document.getElementById("createOpen");
const updateBtn = document.getElementById("updateBtn");
const updateOpen = document.getElementById("updateOpen");
const deleteBtn = document.getElementById("deleteBtn");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
const showIndexBtn = document.getElementById("showIndexBtn");
const loginModal = document.getElementById("loginModal");
const modalContent = document.getElementById("modalContent");
const modalSection = document.getElementById("modalSection");
let modal;
const hiddenBtns = [createBtn, updateBtn, deleteBtn, showIndexBtn];
const hiddenOpens = [createOpen,updateOpen];
let userNameInput = document.getElementById("username");
let passwordInput = document.getElementById("password");
let userNameVal;
let passwordVal;
const imageGallery = document.getElementById('gallery');

//EVENT LISTENERS
loginBtn.addEventListener("click", logIn);
// registerBtn.addEventListener("click", registerNewUser);
createBtn.addEventListener("click", createPost);
updateBtn.addEventListener("click", updatePost);
deleteBtn.addEventListener("click", deletePost);
createOpen.addEventListener("click", makeCreateModal);
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


//make function to be usable everywhere that attaches bearerToken to all requests
//this is like making our own getJSON
//serverRequest will reuse bearerToken, attach it to all requests going forward
//this method allows us to attach bearerToken to all getJSON calls, which is a functionality regular getJSON
//doesn't have
function serverRequest(requestURL, data, httpVerb, callback) {
    //api/login will be the requestURL, or api/posts, etc.
    //data can be $ajax, etc.
    //also need httpVerb (GET, POST, etc.)
    //callback does this without promises, callback will process data
    //or you can return promise with $.getJSON
    //httpVerb is built in to getJSON, but in .ajax this is under the type: 
    //$.getJSON(requestURL, function(data) {
        //return data from serverRequest
        //callback(data); //if data was successfully returned, so have an if/else setup
        //will be returned wherever it was called
        //this can now be run inside logIn, with a globally set 
    // })

    // switch(httpVerb) {
    //     case "GET" : 
    //         return 
        
    //     case "POST" : 
    //         return 
        
    //     case "PUT" : 
    //         return 
        
    //     case "DELETE" : 
    //         return 
        
    //     default: 
    //         console.log("Not a valid HTTP request");
    // }
}


//sole purpose of this is to get bearerToken from server, so we can use it
function logIn(event) {
    event.preventDefault();
    userNameVal = userNameInput.value;
    passwordVal = passwordInput.value;
    const userVals = {username: userNameVal, password: passwordVal};
    console.log(userNameVal);
    // serverRequest('/api/login', userVals, POST, postJSON);

    //?postJSON switch to do a post instead of a get
    // $.getJSON('/api/login', function() {
    //     //save JWT token locally , 
    // })

    //send message if blank un or blank pw
    //hide loginOpen button if successful, close modal
    // if(successfulLogin) {

    // }
    loginOpen.style.display = "none"; 
    // modalContent.style.display = "none"; 
    // for(let i = 0; i < 10; i++) {
    //     document.getElementsByClassName("modal")[i].setAttribute("data-dismiss", "modal");
    // }
    // loginModal.modal('hide');
    // https://getbootstrap.com/docs/4.0/components/modal/
    //show hiddenBtns
    displayBtns();

} //end of Login function



function displayBtns() {
    //show all hidden buttons
    hiddenBtns.forEach((btn)=> {
        btn.style.display = "inline-block";
    });
}


function showRegisterForm() {
    //if registerBtn clicked, open modal form for registration
}

function registerNewUser(event) {
    //add this user to DB
    event.preventDefault();
    
    // serverRequest('/api/register', userVals, POST, postJSON);

    // $.getJSON('/api/routes', //global bearer token attached to every request)
    // //show registerSuccessMsg
    // //displayBtns, as w/ successful login
    // displayBtns();
}

function showUserIndexPage() {
    //only runs if user is logged in; if so, runs via "Show your posts" button
    //display modal of user's posts?  index page?
}

//if a post is clicked, or edit/delete buttons, this brings up modal of post for CRUD ops
// function showModal() {
//     //put code for BStrap modal here
//     return 
//         `
//         <modal> etc. ${this.content}
//         `;
// }

//runs on clicking delete button
function deletePost() {
    //show deleteWarning and confirmDeleteButton
    //if confirmed, delete from DB
    //add option of notdeleteBtn?
    //shows deleteSuccessMsg
}

function createPost() {
  //fires when clicking createBtn inside modal
  //if all 3 fields are filled in, then send serverRequest
//   if() {

//   }
  //sends post data to POST route on DB
//   serverRequest()
  //shows createSuccessMsg
  //adds image to gallery and to user's index page? or their DB?

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

function addPostToGallery(post) {
    //add to DB??
    
    //add div element/thumbnail to gallery
    imageGallery.innerHTML+= `
        <div class="col-xs-12 col-sm-4 col-md-3">
            <a href="#" class="thumbnail">
            <img src="${post.url}" alt="${post.content}">
            </a>
        </div>
        `;
}

// function makeCreateModal(text, httpVerb) {
function makeCreateModal() {
    alert('Button clicked');
    return modalSection.innerHTML = `
    <div class="modal fade" id="createModal" tabindex="-1" role="dialog" aria-labelledby="createModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
              <div class="modal-content" id="createmodalContent">
                <div class="modal-header">
                  <h5 class="modal-title" id="createTitle">Create stuff</h5>
  
                </div>
                <form id="createForm" action="/" method="POST"></form>
                  <div class="modal-body">
                      Title: <input type="text" name="title" placeholder="Title" required="true"><br>
                      Content: <input type="text" name="content" placeholder="Content" required="true"><br>
                      Image: <input type="text" name="image" placeholder="Image URL" required="true"><br>
                  </div>
                </form>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-primary" data-dismiss="modal" id="createBtn">Create</button>
                  </div>
              </div>
            </div>
          </div>
    `;
}

