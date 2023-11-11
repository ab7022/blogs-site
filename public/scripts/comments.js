// Get elements
const loadCommentsBtnWElement = document.getElementById("load-comments-btn");
const commentsSectionElement = document.getElementById("comments-section");
const commentsListElement = document.getElementById("comments-list");
const commentsFormElement = document.querySelector("#comments-form form");
const commentTitleElement = document.getElementById("title");
const commentTextElement = document.getElementById("text");
function displayErrorMessage(message) {
  const errorMessageElement = document.getElementById("error-message");
  errorMessageElement.textContent = message;
}  

// Function to fetch comments for a post
// Function to fetch comments for a post
async function fetchCommentForPost() {
  const postId = loadCommentsBtnWElement.dataset.postid;
  const url = `/posts/${postId}/comments`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Fetching comments failed!");
    }

    const responseData = await response.json();

    clearCommentsList();
    if (responseData && responseData.length > 0) {
      const commentsListFragment = createCommentsList(responseData);
      commentsListElement.appendChild(commentsListFragment);
    } else {
      displayNoCommentsMessage();
    }
  } catch (error) {
    console.error(error);
    // Instead of using alert, you can update a status message element on your page.
    displayErrorMessage("Fetching comments failed!");
  }
}

// Function to create a comments list element
function createCommentsList(comments) {
  const fragment = document.createDocumentFragment();

  for (const comment of comments) {
    const commentElement = createCommentElement(comment);
    fragment.appendChild(commentElement);
  }

  return fragment;
}

// Function to create a single comment element
function createCommentElement(comment) {
  const commentElement = document.createElement("li");
  commentElement.innerHTML = `
    <div class="comment-header">
      <h2 class="comment-title">${comment.title}</h2>
    </div>
    <div class="comment-body">
      <p class="comment-text">${comment.text}</p>
    </div>
  `;
  return commentElement;
}

// Function to clear the comments list
function clearCommentsList() {
  commentsListElement.innerHTML = "";
}

// Function to display a message when there are no comments
function displayNoCommentsMessage() {
  const messageElement = document.createElement("p");
  messageElement.textContent = "No Comments Found...";
  commentsListElement.appendChild(messageElement);
}

// Function to display an error message
function displayErrorMessage(message) {
  alert(message);
}

// Function to save a new comment
// Function to save a new comment
async function saveComment(event) {
  event.preventDefault();

  const postId = commentsFormElement.dataset.postid;
  const enteredTitle = commentTitleElement.value;
  const enteredText = commentTextElement.value;
  const comment = {
    title: enteredTitle,
    text: enteredText,
  };

  try {
    const response = await fetch(`/posts/${postId}/comments`, {
      method: "POST",
      body: JSON.stringify(comment),
      headers: {
        'Content-Type': "application/json",
      },
    });

    if (response.ok) {
      commentTitleElement.value = '';
      commentTextElement.value = '';
      
      // After successfully submitting a comment, fetch and display comments
      fetchCommentForPost(); // Call the function to load comments

      // You can choose to reload comments or simply display a success message
      displaySuccessMessage("Comment added successfully!");
    } else {
      displayErrorMessage("Couldn't send comment!");
    }
  } catch (error) {
    displayErrorMessage("Couldn't send request, Maybe try again later");
  }
}


// Function to display a success message
function displaySuccessMessage(message) {
  alert(message);
}

// Event listeners
loadCommentsBtnWElement.addEventListener("click", fetchCommentForPost);
commentsFormElement.addEventListener("submit", saveComment);
