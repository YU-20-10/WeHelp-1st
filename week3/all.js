const navbarBtn = document.querySelector(".navbar-btn");
const navbarList = document.querySelector(".navbar-list");
const navbarListCloseBtn = document.querySelector(".navbar-list-closebtn");
const loadBtn = document.querySelector(".loadbtn");
const box2List = document.querySelector(".box2-list");

const remoteDataUrl1 =
  "https://padax.github.io/taipei-day-trip-resources/taipei-attractions-assignment-1";
const remoteDataUrl2 =
  "https://padax.github.io/taipei-day-trip-resources/taipei-attractions-assignment-2";

let insertData = [];

// 手機板選單點擊出現及消失
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

// 發送Request取得遠端資料
function getSpotData() {
  return new Promise((resolve, reject) => {
    let req = new XMLHttpRequest();
    req.open("get", remoteDataUrl1);
    req.onload = function () {
      resolve(JSON.parse(this.responseText)["data"]["results"]);
    };
    req.onerror = function () {
      reject("error");
    };
    req.send();
  });
}

// 接收遠端資料，並渲染畫面
let getSpotDataPromise = getSpotData();
getSpotDataPromise
  .then((res) => {
    res.forEach((e) => {
      let newImg = e["filelist"].split(/jpg/i);
      insertData.push([e["stitle"], newImg[0] + "jpg"]);
    });
    const box1TextNodeList = [...document.querySelectorAll(".box1-text")];
    const box1ImgNodeList = [...document.querySelectorAll(".box1-img")];
    const box2TitleNodeList = [...document.querySelectorAll(".box2-title")];
    const box2NodeList = [...document.querySelectorAll(".box2")];

    box1TextNodeList.forEach((element, index) => {
      let insertContent = document.createTextNode(insertData[index][0]);
      element.appendChild(insertContent);
    });

    box1ImgNodeList.forEach((element, index) => {
      element.style.background = `url("${insertData[index][1]}")
    no-repeat center / cover`;
    });

    box2TitleNodeList.forEach((element, index) => {
      let insertContent = document.createTextNode(insertData[index + 3][0]);
      element.appendChild(insertContent);
    });

    box2NodeList.forEach((element, index) => {
      element.style.background = `url("${insertData[index + 3][1]}")
    no-repeat center / cover`;
    });
  })
  .catch((err) => {
    console.log(err);
  });

// 確認螢幕寬度並給予不同CSS
const mediaQueryCheckAndRender = (e) => {
  const box2NodeList = [...document.querySelectorAll(".box2")];
  if (window.matchMedia("(min-width: 1200px)").matches) {
    box2List.style.gridTemplateColumns = "auto auto auto auto auto auto";
  } else if (window.matchMedia("(min-width: 600px)").matches) {
    box2List.style.gridTemplateColumns = "auto auto auto auto";
  } else {
    box2List.style.gridTemplateColumns = "1fr";
  }
  box2NodeList.forEach((element, index) => {
    if (window.matchMedia("(min-width: 1200px)").matches) {
      switch (index % 5) {
        case 0:
          element.style.gridColumn = "2 span";
          break;

        default:
          element.style.gridColumn = "auto";
          break;
      }
    } else if (window.matchMedia("(min-width: 600px)").matches) {
      if (index >= 8) {
        switch (index % 8) {
          case 0:
            element.style.gridColumn = "2 span";
            break;
          case 1:
            element.style.gridColumn = "2 span";
            break;
          default:
            element.style.gridColumn = "auto";
            break;
        }
      } else {
        element.style.gridColumn = "auto";
      }
    } else {
    }
  });
};

// 初始化 第一次載入時確認window.innerWidth給予不同css
window.addEventListener("load", mediaQueryCheckAndRender);

//之後window窗口變化時，確認寬度，寬度如果大於或小於變更css
window.addEventListener("resize", mediaQueryCheckAndRender);

//點擊load加入更多內容
loadBtn.addEventListener("click", (e) => {
  const box2TitleNodeList = [...document.querySelectorAll(".box2-title")];
  const box2NodeList = [...document.querySelectorAll(".box2")];
  for (let i = box2NodeList.length; i <= box2NodeList.length + 9; i++) {
    if (insertData[i + 3] === undefined) {
      return;
    }
    let insertLi = document.createElement("li");
    insertLi.classList.add("box2");
    let starIcon = document.createElement("i");
    starIcon.classList.add("box-icon-star");
    starIcon.classList.add("bi");
    starIcon.classList.add("bi-star-fill");
    let box2Content = document.createElement("div");
    box2Content.classList.add("box-content");
    let box2Text = document.createElement("p");
    box2Text.classList.add("box2-title");
    let box2InsertText = document.createTextNode(insertData[i + 3][0]);
    box2Text.appendChild(box2InsertText);
    insertLi.style.background = `url("${insertData[i + 3][1]}")
    no-repeat center / cover`;
    box2Content.appendChild(box2Text);
    insertLi.appendChild(starIcon);
    insertLi.appendChild(box2Content);
    box2List.appendChild(insertLi);
    mediaQueryCheckAndRender();
  }
});
