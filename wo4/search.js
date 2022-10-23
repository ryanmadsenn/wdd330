const form = document.forms.search;
const input = form.elements.searchInput;
input.value = "Search Here";

let p = document.createElement("p");
document.querySelector("body").appendChild(p);

input.addEventListener("focus", () => {
  if (input.value == "Search Here") {
    input.value = "";
  }
});

input.addEventListener("blur", () => {
  if (input.value == "") {
    input.value = "Search Here";
  }
});

// input.addEventListener("change", () => {
//   p.textContent = "changed";
// });

form.addEventListener("submit", search);

function search(event) {
  event.preventDefault();
  p.textContent = input.value;
}

const heroForm = document.forms.hero;
heroForm.addEventListener("submit", makeHero);

function makeHero() {
  event.preventDefault();
  const hero = {};

  hero.name = heroForm.heroName.value;

  p.textContent = JSON.stringify(hero);
}
