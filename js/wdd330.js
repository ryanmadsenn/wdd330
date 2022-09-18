async function getURLs() {
  let response = await fetch("js/wdd330.json");
  if (response.ok) {
    let data = await response.json();
    let urls = data["urls"];
    let list = document.getElementById("block1");

    urls.forEach((element) => {
      let listItem = document.createElement("li");
      let url = document.createElement("a");

      url.textContent = element.label;
      url.href = element.url;

      listItem.appendChild(url);

      list.appendChild(listItem);
    });
  }
}

getURLs();
