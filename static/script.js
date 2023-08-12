// Function to remove the List item on clicking the delete Btn
function removeIt(button) {
  var liTag = button.parentNode;
  var id = liTag.getAttribute("id");

  // Removing the todo from  Database
  const removeFromDatabase = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/todos/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        console.log("Todo successfully Deleted from the database");
      } else {
        console.log("Failed to delete todo to the database");
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  removeFromDatabase(id);
  button.parentElement.remove();
  var list = document.querySelector(".list-group");
  if (list.children.length === 0) {
    let newEmptyMsg = document.createElement("h3");
    newEmptyMsg.textContent = "Nothing is Here, Please Add a List Item!!";
    newEmptyMsg.className = "form-control";
    list.appendChild(newEmptyMsg);
  }
}

// Function to Edit the List item on clicking the Edit Btn
function editIt(button) {
  var liTag = button.parentNode;
  var id = liTag.getAttribute("id");
  var value = liTag.firstChild.textContent;
  liTag.textContent = "";

  // Declare the newValue variable in the outer scope
  var newValue;

  // Create a new input element
  var input = document.createElement("input");
  input.type = "text";
  input.className = "form control form-control-m";
  input.value = value;
  input.placeholder = "";

  // Create a new save button
  var saveBtn = document.createElement("button");
  saveBtn.textContent = "Save";
  saveBtn.className = "btn btn-outline-dark btn-sm float-end me-2 mt-2";

  // Add the input and save button to the li tag
  liTag.appendChild(input);
  liTag.appendChild(saveBtn);

  // Creating the remove and edit buttons
  var editBtn = document.createElement("button");
  var removeBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  removeBtn.textContent = "Remove";
  editBtn.className = "btn btn-outline-dark btn-sm float-end me-2";
  removeBtn.className = "btn btn-sm btn-outline-dark float-end";

  // Event listener for the save button
  saveBtn.addEventListener("click", function () {
    var newValue = input.value.trim();
    if (newValue !== "") {
      // Saving the text into Database
      const updateInDatabase = async (id) => {
        try {
          const body = {
            description: newValue,
          };

          const response = await fetch(`http://localhost:5000/todos/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          });

          if (response.ok) {
            console.log("Todo successfully Updated to the database");
          } else {
            console.log("Failed to update todo to the database");
          }
        } catch (err) {
          console.log(err.message);
        }
      };

      updateInDatabase(id);

      liTag.textContent = newValue;
      liTag.appendChild(removeBtn);
      liTag.appendChild(editBtn);

      // Call the removeIt function when the Remove button is clicked
      removeBtn.addEventListener("click", function () {
        removeIt(removeBtn);
      });

      // Call the editIt function when the Edit button is clicked
      editBtn.addEventListener("click", function () {
        editIt(editBtn);
      });
    }
  });
}

// Function to add the List item and removing it
async function addIt() {
  // Saving the text into Database

  const submitToDatabase = async () => {
    try {
      const body = {
        description: userInput,
      };

      await fetch("http://localhost:5000/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })
        .then((response) => response.json())
        .then((data) => {
          const newItemId = data.id;
          // Creating the New List Item
          var newItem = document.createElement("li");
          newItem.textContent = userInput;
          newItem.setAttribute("id", `${newItemId}`);
          newItem.className = "list-group-item pt-2 pb-2 mt-0 fs-5";
          // Adding the list Item in the parent tag
          var list = document.querySelector(".list-group");
          list.appendChild(newItem);
          // Adding the Remove and Edit buttons to Li Tag
          var editBtn = document.createElement("button");
          var removeBtn = document.createElement("button");
          editBtn.textContent = "Edit";
          removeBtn.textContent = "Remove";
          editBtn.className = "btn btn-outline-dark btn-sm float-end me-2";
          removeBtn.className = "btn btn-sm btn-outline-dark float-end";
          newItem.appendChild(removeBtn);
          newItem.appendChild(editBtn);

          // Making the Placeholder Empty
          userInputField.value = "";

          // Calling the removeIt function when the Remove button is clicked
          removeBtn.addEventListener("click", function () {
            removeIt(removeBtn);
          });

          // Calling the editIt function when the Edit button is clicked
          editBtn.addEventListener("click", function () {
            editIt(editBtn);
          });
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } catch (err) {
      console.log(err.message);
    }
  };

  submitToDatabase();

  // Checking for List Items and showing msg and removing the message if any item is added
  var list = document.querySelector(".list-group");
  if (list.children.length === 0) {
    let newEmptyMsg = document.createElement("h3");
    newEmptyMsg.textContent = "Nothing is Here, Please Add a List Item!!";
    newEmptyMsg.className = "form-control";
    list.appendChild(newEmptyMsg);
  } else {
    let newEmptyMsg = list.querySelector("h3");
    if (
      newEmptyMsg &&
      newEmptyMsg.textContent === "Nothing is Here, Please Add a List Item!!"
    ) {
      newEmptyMsg.remove();
    }
  }
}

// Storing the User Input in "userInput" Variable
var userInputField = document.querySelector(".form-control");
var userInput = "";
userInputField.addEventListener("input", function (event) {
  userInput = event.target.value;
});

// Calling the addIt function on clicking the Enter Key
userInputField.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    addIt();
  }
});

// Calling the addIt function on clicking the Add Btn
let getButton = document.querySelector(".btn");
getButton.addEventListener("click", addIt);

// Adding all Todos on Window loading
async function fetchAndDisplayTodos() {
  try {
    const response = await fetch("http://localhost:5000/todos/");
    const todos = await response.json();
    const list = document.querySelector(".list-group");
    const todoArray = todos.yourTodos;

    for (let i = 0; i < todoArray.length; i++) {
      const listMessage = todoArray[i].description;
      const listId = todoArray[i].id;

      const listItem = document.createElement("li");
      listItem.textContent = listMessage;
      listItem.setAttribute("id", `${listId}`);
      listItem.className = "list-group-item pt-2 pb-2 mt-0 fs-5";

      // Add remove and edit buttons
      const editBtn = document.createElement("button");
      const removeBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      removeBtn.textContent = "Remove";
      editBtn.className = "btn btn-outline-dark btn-sm float-end me-2";
      removeBtn.className = "btn btn-sm btn-outline-dark float-end";
      listItem.appendChild(removeBtn);
      listItem.appendChild(editBtn);

      // Add event listeners for remove and edit buttons
      removeBtn.addEventListener("click", function () {
        removeIt(removeBtn);
      });

      editBtn.addEventListener("click", function () {
        editIt(editBtn);
      });

      list.appendChild(listItem);
    }
  } catch (err) {
    console.log(err.message);
  }
}

// Call the fetchAndDisplayTodos function to populate the list on page load
window.onload = fetchAndDisplayTodos;
