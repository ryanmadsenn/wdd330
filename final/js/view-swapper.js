window.onresize = () => {
  if (window.innerWidth < 1000) {
    document.getElementById("sunday").parentElement.style.display = "none";
  } else {
    document.getElementById("sunday").parentElement.style.display = "block";
  }

  if (window.innerWidth < 900) {
    document.getElementById("saturday").parentElement.style.display = "none";
  } else {
    document.getElementById("saturday").parentElement.style.display = "block";
  }
};
