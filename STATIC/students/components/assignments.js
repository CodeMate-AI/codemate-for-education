// var task_lang = "";
// var temp = String(window.location.search).split("?")[1];
// temp = temp.split("&");
// var search_params = {}
// temp.forEach((e)=>{
//     // var temp__ = {};
//     search_params[`${e.split("=")[0]}`] = e.split("=")[1];
// })

document.querySelectorAll(".assignment__").forEach((e)=>{
    console.log(e)
    e.onclick = ()=>{
        if(!e.classList.contains("active")){
            document.querySelector(".assignment__.active").classList.remove("active");
            e.classList.add("active");
        }
    }
})

// document.getElementById("btn1").onclick = () => {
//     if(!document.getElementById("btn1").classList.contains("active")) {
//         document.getElementById("btn1").classList.add("active")
//         document.getElementById("btn2").classList.remove("active")
//     }
// }


pa_elm = {
"pending": `     
          <div id="container-inside">
          <div class="content">
          <p class="title">{{assignments.pending.title}}</p>
          <p class="description">{{assignments.pending.description}}</p>
          <div class="date-diff">
          <p class="date">Due Date : <span>{{assignments.pending.due_date}}</span></p>
          <p class="difficulty">Difficulty : <span>{{assignments.pending.difficulty}}</span></p>
          </div>
          </div>
          <div class="btn">
          <div class="btn-inside">
          <button assignment_id="{{assignments.pending.aid}}">START</button>
          </div>
          </div>
          </div>
`
};
// let temp = "";
// x = []
// x.forEach((e)=>{
//     temp = pa_elm;
//     temp = temp.replace("{{assignments.pending.title}}", e.title);
//     temp = temp.replace("{{assignment.desc}}", e.desc);
//     temp = temp.replace("{{aid}}", e.id);
// });