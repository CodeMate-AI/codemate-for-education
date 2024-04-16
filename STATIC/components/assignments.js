// var task_lang = "";
var temp = String(window.location.search).split("?")[1];
temp = temp.split("&");
var search_params = {}
temp.forEach((e)=>{
    // var temp__ = {};
    search_params[`${e.split("=")[0]}`] = e.split("=")[1];
})

document.querySelectorAll(".assignment__").forEach((e)=>{
    console.log(e)
    e.onclick = ()=>{
        if(!e.classList.contains("active")){
            document.querySelector(".assignment__.active").classList.remove("active");
            e.classList.add("active");
        }
    }
})






