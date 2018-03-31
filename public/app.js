//FLOW: page loads w/ login prominent on top, gallery below
//user clicks login, form disappears/fades out w/ success message
// gallery appears w/ option to select their index page, edit/delete/create buttons
//user clicks register, if submitted correctly, same behavior as above w/login + success message at registering

//functions needed: logUserIn, registerUser, showRegisterForm, displayBtns, showIndexPage, create/edit/updatePosts, 
//checkPassword, checkUserName, showCreatePostForm, showUpdatePostForm, addPostToGallery, serverRequest

//misc questions: Forgotten password? (send email?)
//how to distinguish wrong password (i.e., existing user) from misspelled username?  


let loggedIn = false;

//BUTTONS
const pageTitle = document.getElementsByTagName('h1')[0];
const loginTitle = document.getElementById('loginTitle');
const loginBtn = document.getElementById("loginBtn");
const loginOpen = document.getElementById("loginOpen");
const registerBtn = document.getElementById("registerBtn");
const createBtn = document.getElementById("createBtn");
const updateBtn = document.getElementById("updateBtn");
const deleteBtn = document.getElementById("deleteBtn");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
const showIndexBtn = document.getElementById("showIndexBtn");
const hiddenBtns = [createBtn, updateBtn, deleteBtn, showIndexBtn];

//MODALS AND OPENS
const createOpen = document.getElementById("createOpen");
// const updateOpens = [];
// for(let i = 0; i < 10; i++) {
//     updateOpens.push(document.getElementsByClassName('updateOpens')[i]);
// }
const updateOpen = document.getElementById('updateOpen');
const indexOpen = document.getElementById("indexOpen");
const loginModal = document.getElementById("loginModal");
const modalContent = document.getElementById("modalContent");
const modalSection = document.getElementById("modalSection");
let modal;
const createModal = document.getElementById('createModal');
const createModalHeader = document.getElementById('createModalHeader');
const hiddenOpens = [createOpen];

//INPUT FIELDS
let userNameInput = document.getElementById("username");
let passwordInput = document.getElementById("password");
let userNameVal;
let passwordVal;
const userWelcome = document.getElementById('userWelcome');
const imageGallery = document.getElementById('gallery');
const galleryRow = document.getElementsByClassName('row')[0];

//CAPTURE FIELDS INSIDE CREATEPOST MODAL
let imageUrlInput= document.getElementById('createImageURL');
let titleInput= document.getElementById('createTitle');
let contentInput= document.getElementById('createContent');
let titleVal;
let contentVal;
let imageVal;

//CAPTURE FIELDS INSIDE UPDATEPOST MODAL
let updateImageInput= document.getElementById('updateImageURL');
let updateTitleInput= document.getElementById('updateTitle');
let updateContentInput= document.getElementById('updateContent');
let updatedTitle;
let updatedContent;
let updatedImage;

//EVENT LISTENERS
loginBtn.addEventListener("click", logIn);
// registerBtn.addEventListener("click", registerNewUser);
createBtn.addEventListener("click", createPost);
// updateBtn.addEventListener("click", updatePost);
// deleteBtn.addEventListener("click", deletePost);
createOpen.addEventListener("click", showCreateModal);
// updateOpen.addEventListener("click", showUpdateModal);
// showIndexBtn.addEventListener("click", showUserIndexPage);


//MESSAGES/ALERTS
const wrongUserName = 'Sorry, this user does not exist.  Please check the spelling or register a new account.';
const wrongPassword = 'Sorry, this password is incorrect';
const nameTaken = 'Sorry, that user already exists';
const postErrorMsg = 'Please fill in all fields and try submitting again';
const deleteWarning = 'Are you sure you want to delete your post?';
const updateSuccessMsg = 'Post updated!';
const createSuccessMsg = 'Post created!';
const deleteSuccessMsg = 'Post deleted!';
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
//if success, change loggedIn to = true
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
    if(userNameInput.value && passwordInput.value) {
        userNameVal = userNameInput.value;
        passwordVal = passwordInput.value;
        const userVals = {username: userNameVal, password: passwordVal};
        console.log(userNameVal);
        //close loginModal
        loginBtn.setAttribute('data-dismiss', 'modal');
        //reveal welcome message for logged in user where loginOpen used to be
        userWelcome.style.display = 'inline-block';
        userWelcome.innerHTML = `Welcome ${userNameVal}`;
        //hide loginOpen
        loginOpen.style.display = "none"; 
        //show hidden modalOpens
        displayOpens();
    } else {
        loginTitle.innerHTML+= addModalAlert();
    }

    // serverRequest('/api/login', userVals, POST, postJSON);

    //?postJSON switch to do a post instead of a get
    // $.getJSON('/api/login', function() {
    //     //save JWT token locally , 
    // })

    //send message if blank un or blank pw
    //hide loginOpen button if successful, close modal
    // if(successfulLogin) {

    // }
 

} //end of Login function



function displayBtns() {
    //show all hidden buttons
    hiddenBtns.forEach((btn)=> {
        btn.style.display = "inline-block";
    });
}

function displayOpens() {
    hiddenOpens.forEach((open)=>{
        open.style.display = 'inline-block';
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
    //make API call to retrieve user's posts from DB
    // serverRequest()
    //create modal displaying those?
    //or remove from gallery all but that user's posts?
}

//runs on clicking delete button
function deletePost() {
    //show deleteWarning and confirmDeleteButton
    //if confirmed, delete from DB
    //add option of notdeleteBtn?
    //shows deleteSuccessMsg
}

function showCreateModal() {
    createModal.style.display = 'display-block';
}

function createPost() {
  //if all 3 fields are filled in, then send serverRequest
   if(titleInput.value && contentInput.value && imageUrlInput.value) {
    //make post object consisting of the 3 fields you're passing in:
    titleVal = titleInput.value;
    contentVal = contentInput.value;
    imageVal = imageUrlInput.value;

    //add div element/thumbnail to gallery
    galleryRow.innerHTML+= `
        <div class="col-xs-12 col-sm-4 col-md-3">
            <h3>${titleVal}</h3>
            <a href="#" class="thumbnail">
            <img src="${imageVal}" alt="${contentVal}">
            </a>
            <p>${contentVal}</p><br>
            <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#updateModal" onclick="showUpdateModal()" id="updateOpen" class="updateOpens">
                Update post
            </button>
            <button type="button" class="btn btn-danger" id="deleteBtn">Delete</button>
        </div>
        `;
        createBtn.setAttribute('data-dismiss', 'modal');
   }
   else {
        createModalHeader.innerHTML+= addModalAlert();
   }
  //sends post data to POST route on DB
//   serverRequest()
  //shows createSuccessMsg
  //adds image to gallery and to user's index page? or their DB?
//   createBtn.setAttribute('data-dismiss', 'modal');
}

function addModalAlert() {
    return `
    <div class="alert alert-danger alert-dismissible">
        <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
        <strong>Oh snap!</strong> ${postErrorMsg}.
    </div>
    `;
}


function updatePost() {
    //fires when clicking updateBtn
    //sends updated data to PUT route on DB
    //shows updateSuccessMsg
    updatedImage = document.getElementById('updateImageURL');
    updatedTitle = document.getElementById('updateTitle');
    updatedContent = document.getElementById('updateContent');
    galleryRow.innerHTML+= `
        <div class="col-xs-12 col-sm-4 col-md-3">
            <h3>${updatedTitle}</h3>
            <a href="#" class="thumbnail">
            <img src="${updatedImage}" alt="${updatedContent}">
            </a>
            <p>${updatedContent}</p><br>
            <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#updateModal" id="updateOpen" class="updateOpens">
                Update post
            </button>
            <button type="button" class="btn btn-danger" id="deleteBtn">Delete</button>
        </div>
        `;
        updateBtn.setAttribute('data-dismiss', 'modal');

//    else {
//         createModalHeader.innerHTML+= addModalAlert();
//    }
}
function showUpdateModal() {
    //brings up same form as w/login/createPost, shows title/content/image fields
    //allows editing and submission (how?)
    return modalSection.innerHTML = `
    <div class="modal fade" id="updateModal" tabindex="-1" role="dialog" aria-labelledby="updateModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
              <div class="modal-content" id="updatemodalContent">
                <div class="modal-header">
                  <h5 class="modal-title" id="updateModalHeader">Update post</h5>
                  <button type="button" class="close" data-dismiss="modal">&times;</button>
                </div>
                <form id="updateForm" action="/" method="PUT"></form> 
                  <div class="modal-body">
                      Title: <input type="text" name="title" placeholder="Title" id="updateTitle" required="true"><br>
                      Content: <input type="text" name="content" placeholder="Content" id="updateContent" required="true"><br>
                      Image: <input type="text" name="image" placeholder="Image URL" id="updateImageURL" required="true"><br>
                  </div>
                </form>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-primary" onclick="updatePost()" id="updateBtn">Update</button>
                  </div>
              </div>
            </div>
    </div>
    `;
}

// function addPostToGallery() {
//     titleVal = titleInput.value;
//     contentVal = contentInput.value;
//     imageVal = imageUrlInput.value;

//     //add div element/thumbnail to gallery
//     imageGallery.innerHTML+= `
//         <div class="col-xs-12 col-sm-4 col-md-3">
//             <h3>${titleVal}</h3>
//             <a href="#" class="thumbnail">
//             <img src="${imageVal}" alt="${contentVal}">
//             </a>
//             <p>${contentVal}</p>
//         </div>
//         `;
// }

// function makeCreateModal(text, httpVerb) {
// function makeCreateModal() {
//     alert('Button clicked');
    // return modalSection.innerHTML = `
    // <div class="modal fade" id="createModal" tabindex="-1" role="dialog" aria-labelledby="createModalLabel" aria-hidden="true">
    //         <div class="modal-dialog" role="document">
    //           <div class="modal-content" id="createmodalContent">
    //             <div class="modal-header">
    //               <h5 class="modal-title" id="createModalHeader">Create stuff</h5>
  
    //             </div>
    //             <form id="createForm" action="/" method="POST"></form> 
    //               <div class="modal-body">
    //                   Title: <input type="text" name="title" placeholder="Title" id="createTitle" required="true"><br>
    //                   Content: <input type="text" name="content" placeholder="Content" id="createContent" required="true"><br>
    //                   Image: <input type="text" name="image" placeholder="Image URL" id="createImageURL" required="true"><br>
    //               </div>
    //             </form>
    //               <div class="modal-footer">
    //                 <button type="button" class="btn btn-primary" data-dismiss='modal' onclick="createPost()" id="createBtn">Create</button>
    //               </div>
    //           </div>
    //         </div>
    // </div>
    // `;
// }

