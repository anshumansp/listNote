// Function to remove the List item on clicking the delete Btn
function removeIt(button) {
    button.parentElement.remove();
    var list = document.querySelector(".list-group");
    if (list.children.length === 0) {
      let newEmptyMsg = document.createElement("h3");
      newEmptyMsg.textContent = "Nothing is Here, Please Add a List Item!!";
      newEmptyMsg.className = "form-control";
      list.appendChild(newEmptyMsg);
    }
  }








  // Function to Edit the List item on clicking the delete Btn
  function editIt(button) {
    var liTag = button.parentNode;
    var value = liTag.firstChild.textContent;
    liTag.textContent = "";

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
  function addIt() {
    // Creating the New List Item
    var newItem = document.createElement("li");
    newItem.textContent = userInput;
    newItem.className = "list-group-item pt-2 pb-2 mt-0 fs-5";

    // Saving the text into Database

    const submitToDatabase = async()=> {
      try {
        const body = {
          description : userInput 
        }
    
        const response = await fetch("http://localhost:5000/todos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(body)
        });

        if (response.ok) {
          console.log("Todo successfully saved to the database");
        } else {
          console.log("Failed to save todo to the database");
        }
      } catch (err) {
        console.log(err.message)
      }
    }

    submitToDatabase();


    // Adding the list Item in the parent tag
    var list = document.querySelector(".list-group");
    list.appendChild(newItem);

    // Checking for List Items and showing msg and removing the message if any item is added
    if (list.children.length === 0) {
      let newEmptyMsg = document.createElement("h3");
      newEmptyMsg.textContent = "Nothing is Here, Please Add a List Item!!";
      newEmptyMsg.className = "form-control";
      list.appendChild(newEmptyMsg);
    } else {
      let newEmptyMsg = list.querySelector("h3");
      if (newEmptyMsg && newEmptyMsg.textContent === "Nothing is Here, Please Add a List Item!!") {
        newEmptyMsg.remove();
      }
    }

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
