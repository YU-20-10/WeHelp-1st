const signinForm = document.querySelector(".signinForm");
const signinBtn = document.querySelector(".signinBtn");
const agreeAllCheckBox = document.querySelector(".agreeAllCheckBox");
const signinFormMessage = document.querySelector(".signinFormMessage");
const signoutBtn = document.querySelector(".signoutBtn");

// 若存在後端傳回的alertMessage則顯示
const urlParams = new URLSearchParams(window.location.search);
const alertMessage = urlParams.get("alertMessage");
if (alertMessage) {
  alert(alertMessage);
}

// 傳送表單資料到後端
async function postFormData(url, formData) {
  let result = {};
  try {
    let res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(formData),
    });
    result = await res.json();
    if (result.redirect) {
      window.location.href = result.redirect;
    }
  } catch (err) {
    result = await err;
    console.log(result);
  }
}

async function getSignout(url) {
  let result = {};
  try {
    let res = await fetch(url, {
      method: "GET",
      redirect: "manual",
      credentials: "same-origin",
    });
    result = await res.json();
    if (result.redirect) {
      window.location.href = result.redirect;
    }
  } catch (err) {
    result = await err;
    console.log(result);
  }
}

// 當登入按鈕被點擊時觸發
if (signinBtn) {
  signinBtn.addEventListener("click", (e) => {
    e.preventDefault();

    let data = Object.fromEntries(new FormData(signinForm).entries());
    if (!agreeAllCheckBox.checked) {
      signinFormMessage.textContent = "請勾選同意條款";
    } else {
      signinFormMessage.textContent = "";
      postFormData("/signin", data);
    }
  });
}

if (signoutBtn) {
  signoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    getSignout("/signout");
  });
}
