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
// createOpen.addEventListener("click", showCreateModal);


//MESSAGES/ALERTS
const wrongUserName = 'Sorry, this user does not exist.  Please check the spelling or register a new account.';
const wrongPassword = 'Sorry, this password is incorrect';
const nameTaken = 'Sorry, that user already exists';
const postErrorMsg = 'Please fill in all fields and try submitting again';
const deleteWarning = 'Are you sure you want to delete your post?';

function serverRequest(requestURL, httpVerb, data) {
    //data parameter is the data I'm sending
    return new Promise((resolve, reject)=> { 
        
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            //readyState of 4 means done; check if it's done, then if the status is OK (200)
            if(this.readyState == 4) {
                if(this.status >= 200 && this.status < 300) {
                    // console.log(this.responseText);
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
    authToken = responseObj.authToken;
    console.log('authToken is',authToken)
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
    if(userNameInput.value && passwordInput.value) {
        userNameVal = userNameInput.value;
        passwordVal = passwordInput.value;
        userVals = {username: userNameVal, password: passwordVal};
        //log this user in w/ DB call
        serverRequest('/api/auth/login', "POST", userVals)
            .then((data)=> {
                console.log(data);
                handleLogin(data, userVals);
                //close loginModal
                $('#loginModal').modal('hide');
                //load all posts, after a successful login (this is happening in .then, meaning it was successful or else we would be in .catch)
                loadGallery();
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
    if(newUserNameInput.value && newPasswordInput.value) {
        newUserNameVal = newUserNameInput.value;
        newPasswordVal = newPasswordInput.value;
        newUserVals = {username: newUserNameVal, password: newPasswordVal};
        //register this user
        serverRequest('/api/users', "POST", newUserVals)
            .then((data)=> {
                handleLogin(data, newUserVals);
                //load all posts
                loadGallery();
                //close registerModal
                registerBtn.setAttribute('data-dismiss', 'modal');
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
            // mongooseId = post.id;
            // console.log(post, typeof post);
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
            //attach appendUpdateModal listener to each updateOpen button as it is generated
            //this binds post ID to each eventListener's callback; when you click it from here on, it remembers this unique post ID
            // document.getElementById(`${post.id}-update`).addEventListener('click', appendUpdateModal.bind(this, post.id));
            // document.getElementById(`${post.id}-delete`).addEventListener('click', appendDeleteModal.bind(this, post.id));
            // let deleteOpens = document.getElementsByClassName('deleteOpens')
            // for(let i = 0; i<deleteOpens.length; i++) {
            //     deleteOpens[i].addEventListener('click', appendDeleteModal);
            // }
        });
    });
}

function createPost() {
    console.log('createBtn clicked and createPost called');
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
            console.log('new post is: ', newPost);
            galleryRow.innerHTML+= `
            <div id="${newPost._id}" class="col-xs-12 col-sm-6 col-md-4 postItem">
                <h3>${newPost.title}</h3>
                <div class="thumbnail">
                <img src="${newPost.image}" alt="${newPost.title}">
                </div>
                <p>${newPost.content}</p>
                <button type="button" class="btn btn-primary updateOpens" data-toggle="modal" data-target="#${newPost._id}-updateModal">
                    Update post
                </button>
                <button type="button" class="btn btn-danger deleteOpens" data-toggle="modal" data-target="#${newPost._id}-deleteModal">Delete</button>
            </div>
            `;
            $('#createModal').modal('hide');
            // createBtn.setAttribute('data-dismiss', 'modal');      
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
    // console.log('reached delete modal', postId);
    // console.log('appended delete modal');
    //other way: id="deleteModal${postId}"
    modalSection.innerHTML += `
    <div class="modal fade" id="${post.id}-deleteModal" tabindex="-1" role="dialog" aria-labelledby="deleteModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content" id="deletemodalContent">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                </div>
                <div class="modal-body alert alert-danger alert-dismissible">
                    <strong>${deleteWarning}</strong>.
                </div>
                <div class="modal-footer">
                <button type="button" class="btn btn-primary" onclick="deletePost('${post.id}')"id="${post.id}deleteBtn">Delete</button>
                </div>
            </div>
        </div>
    </div>
    `;
    deleteBtn = document.getElementById(`${post.id}deleteBtn`);
    // console.log('showing deleteBtn exists ' + deleteBtn);
    // deleteBtn.addEventListener("click", deletePost.bind(this, postId));
    // deleteBtn.addEventListener("click", deletePost.bind(this, post.id));
}

//runs on clicking delete button
// function deletePost(postId) {
function deletePost(postId) {
    console.log('reached delete post and we have the ID to delete: ', postId);
    //if clicked, delete this post from DB
    serverRequest('/posts/'+postId, "DELETE")
    .then((postObj)=>{
        console.log('reached delete cb');
        //my backend route still returns the ID as data object, even though it's deleted
        console.log(`postObj is ${postObj}, postObj data is ${postObj.data}`)
        //postObj.data is the post ID
        let deletedPostId = postObj.data;

        //DELETE FROM DOM: find this ID in the DOM, remove it
        let postItem = document.getElementById(`${postId}`);
        console.log('Post item is', postItem);
        postItem.remove();
        $(`#${postItem.id}-deleteModal`).modal('hide');

        // let ids = [];
        // for(let i = 0; i < postArray.length; i++) {
        //     ids.push(postArray[i].id);
        // }
        // console.log(ids);
        // mongooseId = postArray[0].id;
        // console.log(postArray);
        // console.log(postArray[0]);
        // //this returns the ID):
        // console.log(postArray[0].id);
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
    // console.log('append updateModal fired; post to be updated is: ', post);
    
    // console.log(`The postID is ${post.id}`);
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
    // document.getElementById(`${post.id}updateBtn`).addEventListener('click', updatePost.bind(this, post.id));
}

//fires when clicking updateBtn inside updateModal, updates DOM and DB
function updatePost(postId) {
    console.log(`clicked updatePost; updating post ${postId}`);
    //get the ID of the modal body which you're about to update
    let modalId = `${postId}-modalBody`;
    //in the DOM, each post item is a div with an id and all title/image content; the following grabs
    //the specific post we are in process of updating
    let postItem = document.getElementById(`${postId}`);

    //get modal content by modalId, then find its individual inputs inside it by using updateTitle, updateContent id's
    //use .find('#updateTitle').value, etc. or .children
    
    //grab updateBtn

    const updateBtn = document.getElementById(`${postId}updateBtn`);
    updatedImage = document.getElementById(`${postId}updateImageURL`).value;
    updatedTitle = document.getElementById(`${postId}updateTitle`).value;
    updatedContent = document.getElementById(`${postId}updateContent`).value;
    let updatedPost = {id: postId, title: updatedTitle, content: updatedContent, image: updatedImage};
    console.log('updatedPost is: ', updatedPost);

    //sends updated data to PUT route on DB
    serverRequest(`/posts/${postId}`, "PUT", updatedPost)
    .then((updatedPost)=>{
        postItem.innerHTML = `
        <h3>${updatedPost.title}</h3>
        <a href="#" class="thumbnail">
        <img src="${updatedPost.image}" alt="${updatedPost.content}">
        </a>
        <p>${updatedPost.content}</p><br>
        <button type="button" class="btn btn-primary updateOpens" data-toggle="modal" data-target="#${updatedPost.id}-updateModal">
            Update post
        </button>
        <button type="button" class="btn btn-danger deleteBtns" data-toggle="modal" data-target="#${updatedPost.id}-deleteModal">Delete</button>
        `;
        $(`#${updatedPost._id}-updateModal`).modal('hide');
        // postItem.style.display = 'none';
        // updateBtn.setAttribute('data-dismiss', 'modal');
    })
    .catch((err)=> {
        console.log(err);
    });
//    else {
//         createModalHeader.innerHTML+= addModalAlert();
//    }
}


















//************************************************************************************************************************** */
//UNUSED/DISCARDED */
//************************************************************************************************************************** */
// function updatecb(msg, data) {
//     console.log('reached updatecb');
//     msg = JSON.parse(msg);
//     console.log('msg data', msg);
//     console.log('data', data); 
// }

//flow: log in (or register), have all posts show, along w/ update/delete buttons, and createNewPost

//functions needed: logUserIn, registerUser, showRegisterForm, displayBtns, showIndexPage, create/edit/updatePosts, 
//checkPassword, checkUserName, showCreatePostForm, showUpdatePostForm, addPostToGallery, serverRequest

//misc questions: Forgotten password? (send email?)
//how to distinguish wrong password (i.e., existing user) from misspelled username?  





// function showUserIndexPage() {
    //     //only runs if user is logged in; if so, runs via "Show your posts" button
    //     //display modal of user's posts?  index page?
    //     //make API call to retrieve user's posts from DB
    //     // serverRequest()
    //     //create modal displaying those?
    //     //or remove from gallery all but that user's posts?
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

// function addModalOpenListeners(open) {
//     //$$$$$$$$$$$$$$$$$$$define opens below
//     //open is the name of an array of opens sharing the same class name
//     for(let i = 0; i < opens.length; i++) {
//         opens.push(document.getElementsByClassName(`${open}`)[i]);
//     }
//     open.addEventListener('click', appendUpdateModal);
// }

// window.addEventListener('load', loadGallery);

// function showCreateModal() {
//     console.log('clicked createOpen');
//     createModal.style.display = 'block';
// }

// function appendCreateModal() {
//     modalSection.innerHTML += `
//     <div class="modal fade" id="createModal" tabindex="-1" role="dialog" aria-labelledby="createModalLabel" aria-hidden="true">
//             <div class="modal-dialog" role="document">
//               <div class="modal-content" id="createmodalContent">
//                 <div class="modal-header">
//                   <h5 class="modal-title" id="createModalHeader">Create a new post</h5>
//                   <button type="button" class="close" data-dismiss="modal">&times;</button>
//                 </div>
//                 <div class="modal-body">
//                     Title: <input type="text" name="title" placeholder="Title" id="createTitle" required="true"><br>
//                     Content: <input type="text" name="content" placeholder="Content" id="createContent" required="true"><br>
//                     Image: <input type="text" name="image" placeholder="Image URL" id="createImageURL" required="true"><br>
//                 </div>
//                   <div class="modal-footer">
//                     <button type="button" class="btn btn-primary" onclick="createPost()" id="createBtn">Create</button>
//                   </div>
//               </div>
//             </div>
//           </div>
//           `;
//         //   createBtn = document.getElementById('createBtn');
//         //   console.log('createBtn exists ', createBtn);
//         //   createBtn.addEventListener("click", createPost);
// }


//make function to be usable everywhere that attaches bearerToken to all requests
//this is like making our own getJSON
//serverRequest will reuse bearerToken, attach it to all requests going forward
//this method allows us to attach bearerToken to all getJSON calls, which is a functionality regular getJSON
//doesn't have
//if success, change loggedIn to = true
// function serverRequest(requestURL, data, httpVerb, callback) {
//     //api/login will be the requestURL, or api/posts, etc.
//     //data can be $ajax, etc.
//     //also need httpVerb (GET, POST, etc.)
//     //callback does this without promises, callback will process data
//     //or you can return promise with $.getJSON
//     //httpVerb is built in to getJSON, but in .ajax this is under the type: 
//     // $.getJSON(requestURL, function(data) {
//     //     return data from serverRequest
//     //     callback(data); //if data was successfully returned, so have an if/else setup
//     //     will be returned wherever it was called
//     //     this can now be run inside logIn, with a globally set 
//     // })

//     // switch(httpVerb) {
//     //     case "GET" : 
//     //         return 
        
//     //     case "POST" : 
//     //         return 
        
//     //     case "PUT" : 
//     //         return 
        
//     //     case "DELETE" : 
//     //         return 
        
//     //     default: 
//     //         console.log("Not a valid HTTP request");
//     // }
// }


// function checkPassword() {
//     //run this inside logIn
//     //find user in DB by passing in userNameInput

//     let userNameToCheck;
//     userNameToCheck = userNameInput.value;
//     //check his password with what was just entered
    
//     let passwordToCheck;
//     passwordToCheck = passwordInput.value;

//     //if they don't match, give warning message and keep login open
//     //if they match, go to next()


// }