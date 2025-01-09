const navbarBtn = document.querySelector(".navbar-btn");
const navbarList = document.querySelector(".navbar-list");
const navbarListCloseBtn = document.querySelector(".navbar-list-closebtn");


// navbarBtn.addEventListener("click",(e)=>{
//     let classExistCheck = navbarList.classList.contains("navbar-list-open")
//     if (!classExistCheck){
//         navbarList.classList.add('navbar-list-open');
//         console.log(navbarList.classList)
//     }
// })



document.addEventListener("click",(e)=>{
    const target = e.target;
    let navbarListBeTarget = navbarList.contains(target);
    let classExistCheck = navbarList.classList.contains("navbar-list-open")
    console.log(target===navbarListCloseBtn);
    console.log(!navbarListBeTarget);
    console.log(target!==navbarList);
    console.log(target===navbarListCloseBtn || !navbarListBeTarget && target!==navbarList);
    if(classExistCheck){
        if (target===navbarListCloseBtn || !navbarListBeTarget && target!==navbarList) {
            
            navbarList.classList.remove("navbar-list-open");
        }
    }else {
        navbarList.classList.add('navbar-list-open');
    }
})

// navbarListCloseBtn.addEventListener("click",(e)=>{
//     let classExistCheck = navbarList.classList.contains("navbar-list-open")
//     if(classExistCheck){
//         navbarList.classList.remove("navbar-list-open");
//     }
// })