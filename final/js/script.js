// function handleMove(e) {
//   let target = document.querySelector(".dragging");

//   let siblings = [...target.parentElement.children];

//   siblings.forEach((sibling) => {
//     if (!sibling.classList.contains("dragging")) {
//       let rect = sibling.getBoundingClientRect();
//       console.log(
//         `Rect Bottom: ${rect.bottom}, Rect Top: ${rect.top}, ClientY: ${e.clientY}`
//       );
//       console.log(
//         `Top - Y: ${rect.top - e.clientY}\nBottom - Y: ${
//           rect.bottom - e.clientY
//         }`
//       );
//     }
//   });
// }

let days = document.querySelectorAll(".day-exercise-container");

days.forEach((day) => {
  day.addEventListener("dragover", handleDragOver);
  day.addEventListener("drop", handleDrop);
});

async function get_exercises() {
  let response = await fetch("js/all-exercises.json");

  if (response.ok) {
    let data = await response.json();
    return data;
  } else {
    throw new Error();
  }
}

async function insert_exercises() {
  let exercises = await get_exercises();

  let container = document.getElementById("exercise-menu");

  exercises.forEach((exercise) => {
    let element = document.createElement("p");
    element.draggable = true;
    element.textContent = exercise.name;
    element.classList.add("exercise");
    element.addEventListener("click", find_exercise);
    element.addEventListener("dragstart", handleDragStart);
    element.addEventListener("dragend", handleDragEnd);
    container.appendChild(element);
  });
}

function toSentenceCase(str) {
  return str
    ? str
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "";
}

function swapImage(e) {
  let image = document.getElementById("exercise-img");
  let sources = image.dataset.sources.split(",");

  let i = image.src.indexOf("final");
  let currentSource = `.${image.src.slice(i + 5)}`;

  let nextSource = sources.find((source) => {
    return source !== currentSource;
  });

  image.src = nextSource;
}

async function find_exercise(e) {
  let exercises = await get_exercises();

  let exercise = exercises.find((ex) => {
    return ex.name == e.target.textContent;
  });

  if (!exercise) return;

  let container = document.getElementById("info-box");
  container.innerHTML = "";

  let textContainer = document.createElement("div");
  textContainer.id = "text-container";
  let subTextContainer1 = document.createElement("div");
  subTextContainer1.id = "subtext1";
  let subTextContainer2 = document.createElement("div");
  subTextContainer2.id = "subtext2";
  let imageContainer = document.createElement("div");
  imageContainer.id = "image-container";
  let name = document.createElement("h2");
  let category = document.createElement("p");
  let equipment = document.createElement("p");
  let force = document.createElement("p");
  let level = document.createElement("p");
  let mechanic = document.createElement("p");
  let instructionTitle = document.createElement("h2");
  let instructions = document.createElement("ol");
  let image = document.createElement("img");
  let imageButton = document.createElement("button");

  name.textContent = exercise.name;
  category.innerHTML = `<strong>Category:</strong> ${toSentenceCase(
    exercise.category
  )}`;
  equipment.innerHTML = `<strong>Equipment:</strong> ${toSentenceCase(
    exercise.equipment
  )}`;
  force.innerHTML = `<strong>Force:</strong> ${toSentenceCase(exercise.force)}`;
  level.innerHTML = `<strong>Level:</strong> ${toSentenceCase(exercise.level)}`;
  mechanic.innerHTML = `<strong>Mechanic:</strong> ${toSentenceCase(
    exercise.mechanic
  )}`;
  instructionTitle.innerHTML = "Instructions";

  exercise.instructions.forEach((instruction) => {
    let element = document.createElement("li");
    element.textContent = instruction;
    instructions.appendChild(element);
  });

  image.src = exercise.image_paths[0];
  image.classList.add("exercise-img");
  image.id = "exercise-img";
  image.setAttribute("data-sources", exercise.image_paths.toString());

  imageButton.textContent = "Next Image";
  imageButton.addEventListener("click", swapImage);

  subTextContainer1.appendChild(name);
  subTextContainer1.appendChild(category);
  subTextContainer1.appendChild(equipment);
  subTextContainer1.appendChild(force);
  subTextContainer1.appendChild(level);
  subTextContainer1.appendChild(mechanic);
  subTextContainer2.appendChild(instructionTitle);
  subTextContainer2.appendChild(instructions);
  textContainer.appendChild(subTextContainer1);
  textContainer.appendChild(subTextContainer2);
  imageContainer.appendChild(image);
  imageContainer.appendChild(imageButton);

  container.appendChild(textContainer);
  container.appendChild(imageContainer);
}

function handleDragStart(e) {
  e.target.classList.add("dragging");
}

function handleDragEnd(e) {
  e.target.classList.remove("dragging");
}

function handleDragOver(e) {
  e.preventDefault();
}

function removeItem(e) {
  let day =
    e.target.parentElement.parentElement.parentElement.children[0].textContent.toLowerCase();
  let i = e.target.parentElement.dataset.i;

  console.log(i);
  console.log(day);

  let stored = JSON.parse(localStorage.getItem("workouts"));

  stored[day].splice(i, 1);

  let str = JSON.stringify(stored);

  localStorage.setItem("workouts", str);

  e.target.parentElement.remove();
}

function appendLocalStorage(item, day) {
  if (localStorage.getItem("workouts")) {
    let stored = JSON.parse(localStorage.getItem("workouts"));

    stored[day.toLowerCase()].push(item);

    let str = JSON.stringify(stored);

    localStorage.setItem("workouts", str);
  } else {
    let storageStruct = {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: [],
    };

    storageStruct[day.toLowerCase()].push(item);

    let str = JSON.stringify(storageStruct);

    localStorage.setItem("workouts", str);
  }
}

function loadExercises() {
  let obj = JSON.parse(localStorage.getItem("workouts"));

  for (const key in obj) {
    let container = document.getElementById(key);

    for (let i = 0; i < obj[key].length; i++) {
      let element = document.createElement("p");
      element.textContent = obj[key][i];
      element.addEventListener("click", find_exercise);
      element.style.display = "flex";
      element.style.justifyContent = "space-between";
      element.classList.add("exercise");
      element.dataset.i = i;

      let trashIcon = document.createElement("i");
      trashIcon.classList.add("gg-trash");
      trashIcon.classList.add("trash-icon");
      trashIcon.addEventListener("click", removeItem);
      element.appendChild(trashIcon);

      container.appendChild(element);
    }
  }
}

function handleDrop(e) {
  e.preventDefault();

  let day = e.target.parentElement.children[0].textContent;
  let item = document.querySelector(".dragging").textContent;
  appendLocalStorage(item, day);

  let children = [...e.target.children];

  if (!children.includes(document.querySelector(".dragging"))) {
    let copy = document.querySelector(".dragging").cloneNode(true);
    copy.classList.remove("dragging");
    copy.addEventListener("click", find_exercise);
    copy.addEventListener("dragstart", handleDragStart);
    copy.addEventListener("dragend", handleDragEnd);
    copy.style.display = "flex";
    copy.style.justifyContent = "space-between";
    copy.dataset.i =
      JSON.parse(localStorage.getItem("workouts"))[
        e.target.parentElement.children[0].textContent.toLowerCase()
      ].length - 1;

    let trashIcon = document.createElement("i");
    trashIcon.classList.add("gg-trash");
    trashIcon.classList.add("trash-icon");
    trashIcon.addEventListener("click", removeItem);
    copy.appendChild(trashIcon);

    if (e.target.tagName != "P") {
      e.target.appendChild(copy);
    } else {
      e.target.parentElement.appendChild(copy);
    }
  }
}

insert_exercises();
loadExercises();
