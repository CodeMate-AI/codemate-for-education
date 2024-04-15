// var task_lang = "";
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
    current_message += "\n\nFLAGS: [--resources]"

    env.messages.push({
        "role": "user",
        "content": current_message
    });
    let user_message = ex.message.user;
    user_message = user_message.replace("{{message}}", kjsdf);
    ex.chatbox.innerHTML += user_message
    fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "enhanced_context": true,
            "task": document.getElementById("task___").getElementsByTagName("p")[0].innerText,
            "messages": env.messages
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