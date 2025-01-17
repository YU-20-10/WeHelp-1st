const navbarBtn = document.querySelector(".navbar-btn");
const navbarList = document.querySelector(".navbar-list");
const navbarListCloseBtn = document.querySelector(".navbar-list-closebtn");

document.addEventListener("click", (e) => {
  const target = e.target;
  let navbarListBeTarget = navbarList.contains(target);
  let navbarBtnBeTarget = navbarBtn.contains(target);
  let navbarCloseBtnBeTarget = navbarListCloseBtn.contains(target);
  let classExistCheck = navbarList.classList.contains("navbar-list-open");
  if (classExistCheck) {
    if (
      navbarCloseBtnBeTarget ||
      target === navbarListCloseBtn ||
      (!navbarListBeTarget && target !== navbarList)
    ) {
      navbarList.classList.remove("navbar-list-open");
    }
  } else {
    if (navbarBtnBeTarget || target === navbarBtn)
      navbarList.classList.add("navbar-list-open");
  }
});
