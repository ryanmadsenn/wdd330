// Get buttons.
let findButton = document.getElementById("find-edit");
let saveButton = document.getElementById("save");
let displayButton = document.getElementById("display");

// Add event listeners.
findButton.addEventListener("click", loadStory);
saveButton.addEventListener("click", saveStory);
displayButton.addEventListener("click", displayStory);

function loadStory() {
  let storyTitle = document.getElementById("story-title").value;
  let storyHTML = localStorage.getItem(storyTitle);
  document.getElementById("story-content").value = storyHTML;
}

function saveStory() {
  let storyTitle = document.getElementById("story-title").value;
  let storyHTML = document.getElementById("story-content").value;
  localStorage.setItem(storyTitle, storyHTML);
}

function displayStory() {
  let storyHTML = document.getElementById("story-content").value;
  document.getElementById("story-display").innerHTML = storyHTML;
}
