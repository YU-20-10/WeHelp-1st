const signupForm = document.querySelector(".signupForm");
const signupFormBtn = document.querySelector(".signupBtn");
const signinForm = document.querySelector(".signinForm");
const signinFormBtn = document.querySelector(".signinBtn");
const signupMessage = document.querySelector(".signupMessage");
const signinMessage = document.querySelector(".signinMessage");
const signoutBtn = document.querySelector(".signoutBtn");
const contentForm = document.querySelector(".contentForm");
const contentBtn = document.querySelector(".contentBtn");
const messageDelBtn = document.querySelectorAll(".messageDelBtn");

const urlParams = new URLSearchParams(window.location.search);
let alertMessage = urlParams.get("alertMessage");
if (alertMessage) {
  alert(alertMessage);
}

function validateFormData(formdata) {
  let noEmpty = true;
  Object.entries(formdata).forEach(([key, value]) => {
    if (!value) {
      noEmpty = false;
    }
  });
  return noEmpty;
}

async function postFormData(url, formData) {
  let result = {};
  try {
    let res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    result = await res.json();
    if (result.redirect) {
      window.location.href = result.redirect;
    }
    if (result.message) {
      alert(result.message);
    }
  } catch (error) {
    result = await error;
    console.log(error);
  }
}

async function getData(url) {
  let result = {};
  try {
    let res = await fetch(url);
    result = await res.json();
    if (result.redirect) {
      window.location.href = result.redirect;
    }
  } catch (error) {
    result = await error;
    console.log(result);
  }
}

if (signupFormBtn) {
  signupFormBtn.addEventListener("click", (e) => {
    let rowFormData = new FormData(signupForm).entries();
    let formData = Object.fromEntries(rowFormData);
    let check = validateFormData(formData);
    if (check) {
      postFormData("/signup", formData);
    } else {
      signupMessage.textContent = "姓名、帳號或是密碼未輸入";
    }
  });
}

if (signinFormBtn) {
  signinFormBtn.addEventListener("click", (e) => {
    let rowFormData = new FormData(signinForm).entries();
    let formData = Object.fromEntries(rowFormData);
    let check = validateFormData(formData);
    if (check) {
      signinMessage.textContent = "";
      postFormData("/signin", formData);
    } else {
      signinMessage.textContent = "帳號或是密碼未輸入";
    }
  });
}

if (signoutBtn) {
  signoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    getData("signout");
  });
}

if (contentBtn) {
  contentBtn.addEventListener("click", (e) => {
    let rowFormData = new FormData(contentForm).entries();
    let formData = Object.fromEntries(rowFormData);
    if (formData.content) {
      postFormData("/createMessage", formData);
    } else {
      alert("內容未輸入無法送出留言");
    }
  });
}

if (messageDelBtn) {
  messageDelBtn.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      data = { id: parseInt(e.target.parentNode.dataset.messageid) };
      if (window.confirm("確定要刪除留言？")) {
        postFormData("/deleteMessage", data);
      }
    });
  });
}
