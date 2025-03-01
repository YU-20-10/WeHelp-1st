const signupForm = document.querySelector(".signupForm");
const signupBtn = document.querySelector(".signupBtn");
const signupMessage = document.querySelector(".signupMessage");

const signinForm = document.querySelector(".signinForm");
const signinBtn = document.querySelector(".signinBtn");
const signinMessage = document.querySelector(".signinMessage");

const signoutBtn = document.querySelector(".signoutBtn");

const userDataName = document.querySelectorAll(".userDataName");

const memberMessageForm = document.querySelector(".memberMessageForm");
const memberMessageBtn = document.querySelector(".memberMessageBtn");

const delMessageBtn = document.querySelectorAll(".delMessageBtn");

const editNameForm = document.querySelector(".editNameForm");
const editNameInput = document.querySelector(".editNameInput");
const editNameBtn = document.querySelector(".editNameBtn");
const editNameResult = document.querySelector(".editNameResult");

const memberSearchForm = document.querySelector(".memberSearchForm");
const memberSearchBtn = document.querySelector(".memberSearchBtn");
const memberResult = document.querySelector(".memberResult");

const fnTab = document.querySelectorAll("[data-tab]");
const fnBlock = document.querySelectorAll("[data-block]")

const urlParms = new URLSearchParams(window.location.search);
let alertMessage = urlParms.get("alertMessage");
if (alertMessage) {
  alert(alertMessage);
}

async function getFetchData(url) {
  try {
    let reponse = await fetch(url);
    let result = await reponse.json();
    return result;
  } catch (error) {
    throw error;
  }
}

async function postFetchData(url, data) {
  try {
    let reponse = await fetch(url, {
      body: JSON.stringify(data),
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
    });
    let result = await reponse.json();
    return result;
  } catch (error) {
    throw error;
  }
}

async function patchFetchData(url, data) {
  try {
    let reponse = await fetch(url, {
      body: JSON.stringify(data),
      headers: {
        "content-type": "application/json",
      },
      method: "PATCH",
    });
    let result = await reponse.json();

    return result;
  } catch (error) {
    throw error;
  }
}

function checkFormDataExist(formData) {
  let data = formData;
  for (const [key, value] of Object.entries(formData)) {
    if (!value) {
      return false;
    } else {
      data[key] = value.trim();
    }
  }
  return data;
}

if (signupBtn) {
  signupBtn.addEventListener("click", async (e) => {
    const rowFormData = new FormData(signupForm).entries();
    let formData = Object.fromEntries(rowFormData);
    let checkFormData = checkFormDataExist(formData);
    try {
      if (checkFormData) {
        let result = await postFetchData("/signup", checkFormData);
        if (result.redirect) {
          window.location.href = result.redirect;
        }
        if (result.alertMessage) {
          alert(result.alertMessage);
        }
      } else {
        signupMessage.textContent = "姓名或是帳號或是密碼未輸入";
      }
    } catch (error) {
      console.error(error);
    }
  });
}

if (signinBtn) {
  signinBtn.addEventListener("click", async (e) => {
    const rowFormData = new FormData(signinForm).entries();
    let formData = Object.fromEntries(rowFormData);
    let checkFormData = checkFormDataExist(formData);
    try {
      if (checkFormData) {
        let result = await postFetchData("/signin", checkFormData);
        if (result.redirect) {
          window.location.href = result.redirect;
        }
      } else {
        signinMessage.textContent = "帳號或是密碼未輸入";
      }
    } catch (error) {
      console.error(error);
    }
  });
}

if (signoutBtn) {
  signoutBtn.addEventListener("click", async (e) => {
    try {
      let result = await getFetchData("/signout");
      if (result.redirect) {
        window.location.href = result.redirect;
      }
      if (result.alertMessage) {
        alert(result.alertMessage);
      }
    } catch (error) {
      console.error(error);
    }
  });
}

if (memberMessageBtn) {
  memberMessageBtn.addEventListener("click", async (e) => {
    const rowFormData = new FormData(memberMessageForm).entries();
    let formData = Object.fromEntries(rowFormData);
    let checkFormData = checkFormDataExist(formData);
    try {
      if (checkFormData) {
        let result = await postFetchData("/createMessage", checkFormData);
        if (result.redirect) {
          window.location.href = result.redirect;
        }
        if (result.alertMessage) {
          alert(result.alertMessage);
        }
      }
    } catch (error) {
      console.error(error);
    }
  });
}

if (delMessageBtn) {
  delMessageBtn.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      let id = e.target.parentNode.dataset.id;
      try {
        if (window.confirm("確認要刪除留言？")) {
          let result = await postFetchData("/deleteMessage", { id: id });
          if (result.redirect) {
            window.location.href = result.redirect;
          }
          if (result.alertMessage) {
            alert(result.alertMessage);
          }
        }
      } catch (error) {
        console.error(error);
      }
    });
  });
}

if (editNameBtn) {
  editNameBtn.addEventListener("click", async (e) => {
    const rowFormData = new FormData(editNameForm).entries();
    let formData = Object.fromEntries(rowFormData);
    let checkFormData = checkFormDataExist(formData);
    try {
      if (checkFormData) {
        let result = await patchFetchData("/api/member", {
          name: checkFormData["editName"],
        });
        if (result.ok) {
          for (let i = 0; i < userDataName.length; i++) {
            userDataName[i].textContent = formData["editName"];
          }
          editNameResult.textContent = "姓名變更成功";
        } else if (result.error) {
          editNameResult.textContent = "新舊姓名重複/姓名格式有誤/其他錯誤 無法變更姓名";
        }
      }
    } catch (error) {
      console.error(error);
    }
  });
}

if (memberSearchBtn) {
  memberSearchBtn.addEventListener("click", async (e) => {
    const rowFormData = new FormData(memberSearchForm).entries();
    let formData = Object.fromEntries(rowFormData);
    let checkFormData = checkFormDataExist(formData);
    if (checkFormData) {
      try {
        let result = await getFetchData(
          `/api/member?username=${checkFormData.memberSearch}`
        );
        if (result.data.id) {
          memberResult.textContent = `${result.data.name}(${result.data.username})`;
        } else {
          memberResult.textContent = "查無資料";
        }
      } catch (error) {
        console.error(error);
      }
    }
  });
}

if(fnTab){
  fnTab.forEach((tab)=>{
    // console.log(tab.dataset.tab)
    tab.addEventListener("click",(e)=>{
      tab = e.target.dataset.tab;
      fnBlock.forEach((el)=>{
        let block = el.dataset.block
        if(block === tab){
          el.classList.remove("noshow");
          el.classList.add("active");
        }else{
          el.classList.remove("active");
          el.classList.add("noshow");
        }
      })
    })
  })
}