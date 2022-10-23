let addToDo = document.getElementById("add-to-do");
let closeButton = document.getElementById("close");
let checkButton = document.getElementById("check");
let allButton = document.getElementById("all-button");
let activeButton = document.getElementById("active-button");
let completedButton = document.getElementById("completed-button");

addToDo.addEventListener("click", showAddItem);
closeButton.addEventListener("click", closeAddItem);
checkButton.addEventListener("click", addItem);
allButton.addEventListener("click", loadItems);
activeButton.addEventListener("click", () => displayFiltered(event, 0));
completedButton.addEventListener("click", () => displayFiltered(event, 1));

function showAddItem() {
  let input = document.getElementById("item-input");
  let inputBox = document.getElementById("item-text");
  input.style.opacity = 100;
  inputBox.focus();
}

function closeAddItem() {
  let input = document.getElementById("item-input");
  input.style.opacity = 0;

  let inputBox = document.getElementById("item-text");
  inputBox.value = "";
}

function itemChecked() {
  if (event.target.checked) {
    event.target.nextSibling.classList.add("complete");
    let obj = JSON.parse(localStorage.getItem("todos"));

    obj[event.target.parentElement.parentElement.id].complete = 1;

    obj = JSON.stringify(obj);

    localStorage.setItem("todos", obj);
  } else {
    event.target.nextSibling.classList.remove("complete");

    let obj = JSON.parse(localStorage.getItem("todos"));

    obj[event.target.parentElement.parentElement.id].complete = 0;

    obj = JSON.stringify(obj);

    localStorage.setItem("todos", obj);
  }

  countItems();
}

function removeItem() {
  let obj = JSON.parse(localStorage.getItem("todos"));

  delete obj[event.target.parentElement.parentElement.id];

  localStorage.setItem("todos", JSON.stringify(obj));

  event.target.parentElement.parentElement.remove();

  countItems();
}

function addItem(e, loading = false, itemLoading = "") {
  let textboxContent = "default";

  !loading
    ? (textboxContent = document.getElementById("item-text").value)
    : (textboxContent = JSON.parse(localStorage.todos)[itemLoading].content);

  // Create elements.
  let container = document.createElement("div");
  let checkboxButtonContainer = document.createElement("div");
  let checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  let toDoContent = document.createElement("p");
  let trashIconContainer = document.createElement("div");
  let trashIcon = document.createElement("i");

  // Add classes.
  container.classList.add("to-do");
  checkboxButtonContainer.classList.add("checkbox-button");
  checkbox.classList.add("checkbox");
  trashIcon.classList.add("gg-trash");
  trashIcon.classList.add("trash-icon");

  // Add event listeners.
  checkbox.addEventListener("click", itemChecked);
  trashIcon.addEventListener("click", removeItem);

  // Add content.
  toDoContent.textContent = textboxContent;

  // Append children to parents.
  checkboxButtonContainer.appendChild(checkbox);
  checkboxButtonContainer.appendChild(toDoContent);

  trashIconContainer.appendChild(trashIcon);

  container.appendChild(checkboxButtonContainer);
  container.appendChild(trashIconContainer);

  let toDoContainer = document.getElementById("to-dos-container");

  toDoContainer.appendChild(container);

  if (!loading) {
    if (!localStorage.getItem("todos")) {
      let obj = { todoID: 0, todo0: { content: textboxContent, complete: 0 } };
      obj = JSON.stringify(obj);

      localStorage.setItem("todos", obj);

      container.setAttribute("id", "todo0");
    } else {
      let obj = JSON.parse(localStorage.getItem("todos"));

      obj.todoID++;

      obj[`todo${obj.todoID}`] = { content: textboxContent, complete: 0 };

      container.setAttribute("id", `todo${obj.todoID}`);

      localStorage.setItem("todos", JSON.stringify(obj));
    }
  } else {
    container.setAttribute("id", itemLoading);

    let obj = JSON.parse(localStorage.getItem("todos"));

    if (obj[itemLoading].complete == 1) {
      toDoContent.classList.add("complete");
      checkbox.checked = true;
    }
  }

  closeAddItem();
  countItems();
}

function loadItems() {
  removeAllItems();

  let selected = document.getElementsByClassName("filter-button-selected");

  if (selected.length != 0)
    selected[0].classList.remove("filter-button-selected");

  let allButton = document.getElementById("all-button");

  allButton.classList.add("filter-button-selected");

  if (localStorage.todos) {
    let obj = JSON.parse(localStorage.todos);

    for (const key in obj) {
      if (key != "todoID") addItem("", true, key);
    }
  }
}

function countItems() {
  let countElement = document.getElementById("items-left");
  let obj = JSON.parse(localStorage.getItem("todos"));
  let itemsLeft = 0;

  for (const key in obj) {
    if (key != "todoID" && obj[key].complete == 0) itemsLeft++;
  }

  itemsLeft != 0
    ? (countElement.textContent = `Items left: ${itemsLeft}`)
    : (countElement.textContent = `All items complete!`);
}

function displayFiltered(e, complete) {
  let obj = JSON.parse(localStorage.getItem("todos"));

  let selected = document.getElementsByClassName("filter-button-selected");

  if (selected.length != 0)
    selected[0].classList.remove("filter-button-selected");

  e.target.classList.add("filter-button-selected");

  removeAllItems();

  for (const key in obj) {
    if (key != "todoID" && obj[key].complete == complete) {
      addItem("", true, key);
    }
  }
}

function removeAllItems() {
  let container = document.getElementById("to-dos-container");

  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
}

loadItems();
