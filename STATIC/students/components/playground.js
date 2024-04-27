// var task_lang = "";
console.log("her#")
var temp = String(window.location.search).split("?")[1];
temp = temp.split("&");
var search_params = {}
temp.forEach((e)=>{
    // var temp__ = {};
    search_params[`${e.split("=")[0]}`] = e.split("=")[1];
})

var editor = ace.edit("editor");
    // editor.setTheme("ace/theme/tomorrow_night");
    editor.session.setMode(`ace/mode/${search_params.language}`);
    editor.setShowPrintMargin(false);

    editor.setFontSize(20);
    editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true,
        enableCodeLens: true
    });




setTimeout(()=>{
    console.log("jhsgkjer");
    if(search_params.assignment_id != "" && search_params.assignment_id != undefined){
        fetch("http://localhost:8002/get_task?institute_id=123456&task_id="+search_params.assignment_id)
        .then(resp => resp.json())
        .then((resp)=>{
            console.log(resp);
            if(resp.task != null){
                document.getElementById("task_______").innerText = resp.task;
            }else{
                document.getElementById("task___").remove();
            }
        })
    }else{
        document.getElementById("task___").remove();
    }
}, 500);




    ex = {
    "enhanced_context": {
        "status": false,
        "element": document.getElementById("enhanced_context_toggle"),
    },
    "message": {
        "user": `<div class="msg msg-user">{{message}}</div>`,
        "assistant": `<div class="msg msg-ai">{{message}}</div>`
    },
    "chatbox": document.getElementById("chat_box")
}


ex.enhanced_context.element.onclick = ()=>{
    if(ex.enhanced_context.status){
        ex.enhanced_context.status = false;
        ex.enhanced_context.element.classList.remove("ec-active", "ph-fill");
    }else{
        ex.enhanced_context.status = true;
        ex.enhanced_context.element.classList.add("ec-active", "ph-fill");
    }
}





document.getElementById("send_button").onclick = ()=>{
    let current_message = "QUERY:\n";
    let kjsdf = "";
    if(document.getElementById("chat_in").value != ""){
        current_message += document.getElementById("chat_in").value;
        kjsdf = document.getElementById("chat_in").value;
        document.getElementById("chat_in").value = "";
    }

    let current_code = editor.getValue();
    current_message += "\nCODE:\n";
    current_message += current_code;
    current_message += "\n\nENABLED FLAGS: [--resources]"

    env.messages.push({
        "role": "user",
        "content": current_message
    });
    let user_message = ex.message.user;
    user_message = user_message.replace("{{message}}", kjsdf);
    ex.chatbox.innerHTML += user_message;
    var task = "";
    if(document.getElementById("task___") != null){
        console.log(document.getElementById("task___"));
        task = document.getElementById("task___").innerText;
    }else{
        task = "THERE IS NOT TASK :: FREE STYLE CODING SESSION.";
    }
    fetch("http://localhost:8002/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "enhanced_context": true,
            "task": task,
            "messages": env.messages,
            "resources": false
        })
    }).then((resp)=>resp.json())
    .then((resp)=>{
        console.log(resp);
        env.messages.push({
            "role": "assistant",
            "content": resp.response
        })

        let ai_message = ex.message.assistant;
        ai_message = ai_message.replace("{{message}}", resp.response);
        ex.chatbox.innerHTML += marked.parse(ai_message);
        hljs.highlightAll();
    })
}

document.querySelector(".submit_button button").addEventListener("click",  function() {
    var confirmation = confirm("Are you sure you want to submit?");
    console.log(confirmation);
    if(confirmation){
    let submission = document.getElementById("editor").innerText;
    console.log(submission.innerHTML);
    const id = String(Math.floor(Math.random() * 1000) + 1);
    const teacher_id = "001"
    let newUrl = new URL(window.location.href);
    let aid = newUrl.searchParams.get('assignment_id');
    let student_id= newUrl.searchParams.get('student_id')
    let date_time = new Date(Date.now()).toLocaleString();
    fetch(`http://localhost:8002/student/submit/?institute_id=123456&student_id=${student_id}&assignment_id=${aid}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id,
        teacher_id,
        student_id,
        aid,
        submission,
        date_time
      }),
    })
    .then(response => response.json())
    .then(data => {
      confirm("Assignment Submitted successfully !!")
      console.log(data);
    })
    .catch(error => {
      console.error("Submission Error:", error);
    });
    }
  });
  