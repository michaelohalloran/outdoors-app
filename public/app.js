let authToken;

//BUTTONS
const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const createBtn = document.getElementById("createBtn");
let deleteBtn;

//MODALS AND OPENS
const loginOpen = document.getElementById("loginOpen");
const createOpen = document.getElementById("createOpen");
let updateOpens;
let deleteOpens;
const modalSection = document.getElementById("modalSection");
const createModal = document.getElementById('createModal');
const createModalHeader = document.getElementById('createModalHeader');

//INPUT FIELDS
const loginTitle = document.getElementById('loginTitle');
const registerTitle = document.getElementById('registerTitle');
let userNameInput = document.getElementById("username");
let passwordInput = document.getElementById("password");
const userWelcome = document.getElementById('userWelcome');
const imageGallery = document.getElementById('gallery');
const galleryRow = document.getElementsByClassName('row')[0];

//REGISTER NEW USER INPUT FIELDS
let newUserNameInput = document.getElementById("newUsername");
let newPasswordInput = document.getElementById("newPassword");
let mongooseId;
let inputId;

//CAPTURE FIELDS INSIDE CREATEPOST MODAL
let elImageUrl= document.getElementById('createImageURL');
let elTitle= document.getElementById('createTitle');
let elContent= document.getElementById('createContent');
let title;
let content;
let image;

//CAPTURE FIELDS INSIDE UPDATEPOST MODAL
let updateImageInput= document.getElementById('updateImageURL');
let updateTitleInput= document.getElementById('updateTitle');
let updateContentInput= document.getElementById('updateContent');
let updatedTitle;
let updatedContent;
let updatedImage;

//EVENT LISTENERS
loginBtn.addEventListener("click", logIn);
registerBtn.addEventListener("click", registerNewUser);
createBtn.addEventListener("click", createPost);

//MESSAGES/ALERTS
const postErrorMsg = 'Please fill in all fields and try submitting again';
const wrongCreds = 'Wrong username or password';
const deleteWarning = 'Are you sure you want to delete your post?';

function serverRequest(requestURL, httpVerb, data) {
    //data parameter is the data I'm sending
    return new Promise((resolve, reject)=> { 
        
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            //readyState of 4 means done; check if it's done, then if the status is OK (200)
            if(this.readyState == 4) {
                if(this.status >= 200 && this.status < 300) {
                    // console.log('responsetext: ', this.responseText);
                    // console.log('parsed responsetext: ', JSON.parse(this.responseText));
                    // console.log('data: ', data);
                    //resolve is to promises what callback is to the callback method; this is what executes when doing a .then
                    //this parses what comes back back from the server; JSON.parse takes string and makes it into JSON
                    //data is any data I may be sending
                    resolve(JSON.parse(this.responseText), data);
                } else {
                    reject(this.status, this.responseType, this.statusText);
                }
            }
        };

        xhttp.open(httpVerb, requestURL, true);
        xhttp.setRequestHeader("Content-type", "application/json");
    
        if(authToken && authToken.length > 0) {
            xhttp.setRequestHeader("Authorization", `Bearer ${authToken}`);
        }

        if(data) {
            xhttp.send(JSON.stringify(data));
        } else {
            //if not sending data, at least still send the request
            xhttp.send();
        }
    });
}

//this consumes the data returned in serverRequest
//specifically: it saves the authToken we just grabbed, and also cleans up the UI once you log in
function handleLogin(responseObj, sentData) {
    //responseObj is this.responseText (above, from serverRequest); for a login this is an object with an authToken key
    authToken = responseObj.authToken;
    //welcome message display   
    welcomeUser(sentData.username);
    //hide login and register modal Open btns
    hideLogins();
    //show hidden createPost modal open button
    createOpen.style.display = 'inline-block';   
}

//this checks if person has entered logIn data, if so logs them in w/ server call
function logIn(event) {
    event.preventDefault();
    let userNameVal;
    let passwordVal;
    let userVals;
    if(userNameInput.value.length > 0 && passwordInput.value.length > 0) {
        userNameVal = userNameInput.value;
        passwordVal = passwordInput.value;
        userVals = {username: userNameVal, password: passwordVal};
        //log this user in w/ DB call
        serverRequest('/api/auth/login', "POST", userVals)
            .then((data)=> {
                handleLogin(data, userVals);
                //close loginModal
                $('#loginModal').modal('hide');
                //load all posts, after a successful login (this is happening in .then, meaning it was successful or else we would be in .catch)
                loadGallery();
            })
            .catch(err=> {
                //display error msg
                console.log(err);
                loginTitle.innerHTML+= addModalAlert(wrongCreds);
            });
    } else {
        //if user hasn't input username or password, give them a warning
        loginTitle.innerHTML+= addModalAlert(postErrorMsg);
    }
} //end of Login function

function registerNewUser(event) {
    event.preventDefault();
    let newUserNameVal;
    let newPasswordVal;
    let newUserVals;
    if(newUserNameInput.value.length > 0 && newPasswordInput.value.length > 0) {
        newUserNameVal = newUserNameInput.value;
        newPasswordVal = newPasswordInput.value;
        newUserVals = {username: newUserNameVal, password: newPasswordVal};
        //register this user
        serverRequest('/api/users', "POST", newUserVals)
            .then((data)=> {
                // console.log(`newUser added is ${newUserVals}; his username is ${newUserVals.username}`);
                serverRequest('/api/auth/login', "POST", newUserVals)
                    .then((data)=> {
                        // console.log(data); //this is an object containing a single authToken key and its value
                        //log in the newly created user
                        handleLogin(data, newUserVals);
                        //close registerModal
                        $('#registerModal').modal('hide');
                        //load all posts
                        loadGallery();
                       })
                    .catch((err)=>{
                        console.log(err);
                    });
            })
            .catch((err)=> {
                registerTitle.innerHTML+= addModalAlert(wrongCreds);
                
                // console.error(err);
                // if(err == 422) {
                //     registerTitle.innerHTML+= addModalAlert('Username already taken');
                // } else {
                //     registerTitle.innerHTML+= addModalAlert(wrongCreds);
                // }
            });
    } else {
        registerTitle.innerHTML+= addModalAlert(postErrorMsg);
    }    
} //end of registerNewUser function

function welcomeUser(username) {
    //reveal welcome message for logged in user where loginOpen used to be
    userWelcome.style.display = 'inline-block';
    userWelcome.innerHTML = `Welcome ${username}`;
}

function hideLogins() {
    //hide loginOpen and registerOpen
    loginOpen.style.display = "none"; 
    registerOpen.style.display = "none"; 
}

function loadGallery() {
    serverRequest('/posts', "GET")
    .then((postsObj)=> {
        let postsArray = postsObj.data;
        modalSection.innerHTML = ''; //everytime we load a new gallery, remove any outstanding modals
        // appendCreateModal();
        postsArray.forEach((post)=> {
            galleryRow.innerHTML+= `
            <div id="${post.id}" class="col-xs-12 col-sm-6 col-md-4 postItem">
                <h3>${post.title}</h3>
                <div class="thumbnail">
                <img src="${post.image}" alt="${post.title}">
                </div>
                <p>${post.content}</p>
                <button type="button" class="btn btn-primary updateOpens" data-toggle="modal" data-target="#${post.id}-updateModal">
                    Update post
                </button>
                <button type="button" class="btn btn-danger deleteOpens" data-toggle="modal" data-target="#${post.id}-deleteModal">Delete</button>
            </div>
            `;
            appendUpdateModal(post);
            appendDeleteModal(post);
        });
    });
}

function createPost() {
  //if all 3 fields are filled in, then send serverRequest
   if(elTitle.value.length > 0 && elContent.value.length > 0 && elImageUrl.value.length > 0) {

        //make post object consisting of the 3 fields you're passing in:
        title = elTitle.value;
        content = elContent.value;
        image = elImageUrl.value;
        let newPost = {title: title, content: content, image: image};

        //sends post data to POST route on DB
        serverRequest('/posts', "POST", newPost)
        .then((newPost)=> {
            //add div element/thumbnail to gallery
            galleryRow.innerHTML+= `
            <div id="${newPost.id}" class="col-xs-12 col-sm-6 col-md-4 postItem">
                <h3>${newPost.title}</h3>
                <div class="thumbnail">
                <img src="${newPost.image}" alt="${newPost.title}">
                </div>
                <p>${newPost.content}</p>
                <button type="button" class="btn btn-primary updateOpens" data-toggle="modal" data-target="#${newPost.id}-updateModal">
                    Update post
                </button>
                <button type="button" class="btn btn-danger deleteOpens" data-toggle="modal" data-target="#${newPost.id}-deleteModal">Delete</button>
            </div>
            `;
            appendUpdateModal(newPost);
            appendDeleteModal(newPost);
            elTitle.value = '';
            elContent.value = '';
            elImageUrl.value = '';
            $('#createModal').modal('hide'); 
        })
        .catch((err)=> {
            createModalHeader.innerHTML= addModalAlert(`Server returned ${err}`);
        }); 
    }
    else {
         createModalHeader.innerHTML= addModalAlert(postErrorMsg);
    }
}//end of createPost function

function addModalAlert(warning) {
    return `
    <div class="alert alert-danger alert-dismissible">
        <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
        <strong>Oh snap!</strong> ${warning}.
    </div>
    `;
}

//***************************** */
//DELETE FUNCTIONS
//***************************** */
// fires when clicking deleteOpen
function appendDeleteModal(post) {
    modalSection.innerHTML += `
    <div class="modal fade" id="${post.id}-deleteModal" tabindex="-1" role="dialog" aria-labelledby="deleteModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content" id="deletemodalContent">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                </div>
                <div class="modal-body alert alert-danger alert-dismissible">
                    <strong>${deleteWarning}</strong>
                </div>
                <div class="modal-footer">
                <button type="button" class="btn btn-primary" onclick="deletePost('${post.id}')"id="${post.id}deleteBtn">Delete</button>
                </div>
            </div>
        </div>
    </div>
    `;
    deleteBtn = document.getElementById(`${post.id}deleteBtn`);
}

//runs on clicking delete button
function deletePost(postId) {
    //if clicked, delete this post from DB
    serverRequest('/posts/'+postId, "DELETE")
    .then((postObj)=>{
        //my backend route still returns the ID as data object, even though it's deleted
        // console.log(`postObj is ${postObj}, postObj data is ${postObj.data}`);
        //postObj.data is the post ID; use this instead of postId, which will cause undefined
        let deletedPostId = postObj.data;

        //DELETE FROM DOM: find this ID in the DOM, remove it
        let postItem = document.getElementById(`${deletedPostId}`);
             postItem.remove();
            $(`#${deletedPostId}-deleteModal`).modal('hide');
            //delete the update and deleteModals from the DOM after hiding
            // $(`#${deletedPostId}-updateModal`).remove();
            // $(`#${deletedPostId}-deleteModal`).remove();
            // $('.modal-backdrop').remove();
    });
}

function addDeleteWarning() {
    return `
    <div class="alert alert-danger alert-dismissible">
        <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
        <strong>${deleteWarning}</strong>
    </div>
    `;
}

//*************************************************************************************** */
//UPDATE FUNCTIONS
//*************************************************************************************** */
//fires when clicking updateOpen; its interior updateBtn fires updatePost to redo DOM, also fires serverRequest (PUT)
function appendUpdateModal(post) {
    modalSection.innerHTML += `
    <div class="modal fade" id="${post.id}-updateModal" tabindex="-1" role="dialog" aria-labelledby="updateModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
              <div class="modal-content" id="updatemodalContent">
                <div class="modal-header">
                  <h5 class="modal-title" id="updateModalHeader">Update post</h5>
                  <button type="button" class="close" data-dismiss="modal">&times;</button>
                </div>
                  <div class="modal-body" id="${post.id}-modalBody">
                      Title: <input type="text" name="title" placeholder="Title" id="${post.id}updateTitle" required="true" value="${post.title}"><br>
                      Content: <input type="text" name="content" placeholder="Content" id="${post.id}updateContent" required="true" value="${post.content}"><br>
                      Image: <input type="text" name="image" placeholder="Image URL" id="${post.id}updateImageURL" required="true" value="${post.image}"><br>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-primary" onclick="updatePost('${post.id}')" id="${post.id}updateBtn">Update</button>
                  </div>
              </div>
            </div>
    </div>
    `;
}

//fires when clicking updateBtn inside updateModal, updates DOM and DB
function updatePost(postId) {
    //get the ID of the modal body which you're about to update
    let modalId = `${postId}-modalBody`;
    //in the DOM, each post item is a div with an id and all title/image content; the following grabs
    //the specific post we are in process of updating
    let postItem = document.getElementById(`${postId}`);

    const updateBtn = document.getElementById(`${postId}updateBtn`);
    updatedImage = document.getElementById(`${postId}updateImageURL`).value;
    updatedTitle = document.getElementById(`${postId}updateTitle`).value;
    updatedContent = document.getElementById(`${postId}updateContent`).value;
    let updatedPost = {id: postId, title: updatedTitle, content: updatedContent, image: updatedImage};
    //sends updated data to PUT route on DB
    serverRequest(`/posts/${postId}`, "PUT", updatedPost)
    .then((updatedPost)=>{
        postItem.innerHTML = `
        <h3>${updatedPost.title}</h3>
        <a href="#" class="thumbnail">
        <img src="${updatedPost.image}" alt="${updatedPost.content}">
        </a>
        <p>${updatedPost.content}</p><br>
        <button type="button" class="btn btn-primary updateOpens" data-toggle="modal" data-target="#${updatedPost._id}-updateModal">
            Update post
        </button>
        <button type="button" class="btn btn-danger deleteBtns" data-toggle="modal" data-target="#${updatedPost._id}-deleteModal">Delete</button>
        `;
        $(`#${updatedPost._id}-updateModal`).modal('hide');
    })
    .catch((err)=> {
        console.log(err);
    });
}



