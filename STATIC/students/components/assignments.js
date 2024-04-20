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
          <button assignment_id="{{assignments.pending.aid}}" class="task_elm" nav="task">START</button>
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




function activate_task_elms(){
    console.log("HERE!");
    document.querySelectorAll(".task_elm").forEach((e)=>{
        e.onclick = ()=>{
            task_id = e.getAttribute("assignment_id");
            var mode = "text";
            fetch("http://localhost:8000/get_mode/pending?task="+task_id)
            .then((resp)=>resp.text())
            .then((resp)=>{
                mode = resp;
            })
            .then(()=>{

            window.location.href = `?app=playground&id=${task_id}&language=${mode.split('"')[1]}`;
            });
        }
    })
}