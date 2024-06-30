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




setTimeout(()=>{
    if (search_params.assignment_id != "" && search_params.assignment_id != undefined) {
        fetch("https://backend.edu.codemate.ai/get_task?institute_id=123456&task_id=" + search_params.assignment_id)
            .then(resp => resp.json())
            .then((resp) => {
                console.log(resp);
                // editor.session.setMode(`ace/mode/${String(resp.language)}`);
                if (resp.task != null) {
                    console.log(resp.task);
                    document.getElementById("task_______").innerText = resp.task;
                } else {
                    console.log("REMOVING");
                    document.getElementById("task___").remove();
                }
            }).then(() => {
                fetch(`https://backend.edu.codemate.ai/student/get_assignment?institute_id=${search_params.institute_id}&assignment_id=${search_params.assignment_id}&student_id=${search_params.student_id}`)
                    .then(resp => resp.json())
                    .then(resp => {
                        console.log(resp.assignment.language.toLowerCase());
                        editor.session.setMode(`ace/mode/${resp.assignment.language.toLowerCase()}`);
                    });
            })
    }
    else
        document.querySelector(".submit_button button").style.display = "none";
    
    if (search_params.assignment === "Completed") {
         {
            fetch(`https://backend.edu.codemate.ai/student/get_submission?submission_id=${search_params.submission_id}&institute_id=123456`)
            .then(resp => resp.json())
            .then((submissionResp) => {
                console.log(submissionResp.submission_data);
                if (submissionResp.submission_data.submission) {
                    editor.setValue(submissionResp.submission_data.submission);
                }
            });
        }
    }
}, 500);




    ex = {
    "enhanced_context": {
        "status": false,
        "element": document.getElementById("enhanced_context_toggle"),
    },
    "message": {
        "user": `<div class="msg msg-user" style="background: #F7F7F7 ; border-radius: 7px; font-size:0.9rem">{{message}}</div>`,
        "assistant": `<div class="msg msg-ai" style="background: #48AEF326; font-size:0.9rem">{{message}}</div>`
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





function sendMessage(){
    let current_message = "QUERY:\n";
    let kjsdf = "";
    if(document.getElementById("chat_in").value != ""){
        current_message += document.getElementById("chat_in").value;
        kjsdf = document.getElementById("chat_in").value;
        document.getElementById("chat_in").value = "";
    }

    let current_code = editor.getValue();
    if(current_code !== ""){
        current_message += "\nCODE:\n";
        current_message += current_code;
    }
    //current_message += "\n\nENABLED FLAGS: [--resources]"

    env.messages.push({
        "role": "user",
        "content": current_message
    });
    let user_message = ex.message.user;
    user_message = user_message.replace("{{message}}", kjsdf);
    ex.chatbox.innerHTML += user_message;
    var task = "";
    if(document.getElementById("task___") != null){
        console.log('document.getElementById("task___")=',document.getElementById("task___"));
        task = document.getElementById("task___").innerText;
    }else{
        task = "THERE IS NOT TASK :: FREE STYLE CODING SESSION.";
    }
    document.getElementById("loader").style.display = "block";
    fetch("https://backend.edu.codemate.ai/chat", {
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
        .then((resp) => {
            document.getElementById("loader").style.display = "none";
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

// assigning the sendMessage function to the send_button's onclick event
document.getElementById("send_button").onclick = sendMessage;

// adding an event listener to the chat_in input for the keydown event
document.getElementById("chat_in").addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); 
        sendMessage(); 
    }
});

async function handleSubmitAssignment() {
    console.log("submit click")
    const confirmation = confirm("Are you sure you want to submit?");
    if (confirmation) {
        try {
            document.getElementById("assignment-submit-modal").style.display = "flex";
            const submission = editor.getValue();
            const teacher_id = "001";
            const newUrl = new URL(window.location.href);
            const aid = newUrl.searchParams.get("assignment_id");
            const student_id = newUrl.searchParams.get("student_id");
            const date_time = new Date(Date.now()).toLocaleString();

            // Fetch evaluation data
            const evaluation_response = await fetch(`https://backend.edu.codemate.ai/evaluate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    task: document.getElementById("task_______").innerText,
                    code: submission,
                    evaluation_metrics: "Accuracy, Efficiency, Score",
                }),
            });
            console.log(evaluation_response);
            const evaluation_data = await evaluation_response.json();
            console.log(evaluation_data);
            if (!evaluation_response.ok || !evaluation_data) {
                throw new Error("Failed to get evaluation data");
            }

            // Prepare the data for assignment submission
            const evaluation = {
                accuracy: evaluation_data.accuracy,
                efficiency: evaluation_data.efficiency,
                score: evaluation_data.score,
            };
            const id = evaluation_data.submission_id

            const submit_response = await fetch(`https://backend.edu.codemate.ai/student/submit?institute_id=123456&student_id=${student_id}&assignment_id=${aid}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id,
                    teacher_id,
                    student_id,
                    aid,
                    submission,
                    date_time,
                    evaluation, // Include the evaluation in the submission data
                }),
            });

            const submit_data = await submit_response.json();

            if (!submit_response.ok) {
                throw new Error("Failed to submit assignment");
            }

            var notyf = new Notyf();
            document.getElementById("assignment-submit-modal").style.display = "none";
            notyf.success("Assignment submitted successfully!");
            redirectToDashboard();
            console.log(submit_data);
        } catch (error) {
            console.error("Submission Error:", error);
            notyf.error("There was an error submitting your assignment. Please try again.");
            document.getElementById("assignment-submit-modal").style.display = "none";
        }
    }
}
//converted to onclick in html and why this was runnign twice coz on click submit_button, button inside it also getting
//clickd and hence for both same event listener was getting added and hence running twice but still double execution of file still a possibility in production
// document.querySelector(".submit_button button").addEventListener("click", handleSubmitAssignment);

function redirectToDashboard() {
    let newUrl = new URL(window.location.href);
    let institute_id = newUrl.searchParams.get("institute_id");
    let student_id = newUrl.searchParams.get('student_id');
    
    // Set the new parameters for redirection
    newUrl.searchParams.set('institute_id', institute_id);
    newUrl.searchParams.set('student_id', student_id);
    newUrl.searchParams.set('app', 'dash');
    
    // Update the URL and reload the page
    history.pushState({}, '', newUrl);
    window.location.reload();
}


// the issue was the addEventListener was running twice in production and hence same stuff is present two times
//confirmed with getEventListeners but shocking part is that didnt happen in local

////converted to onclick lets see if this solves the issue

function openMobileChat() {
    console.log("clikce")
    
    const container = document.getElementById('container');
    if (container.classList.contains('chat-fullscreen')) {
        
        container.classList.remove('chat-fullscreen');
    } else {
        container.classList.add('chat-fullscreen');
    }
}



  