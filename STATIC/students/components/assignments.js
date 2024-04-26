// var task_lang = "";
// var temp = String(window.location.search).split("?")[1];
// temp = temp.split("&");
// var search_params = {}
// temp.forEach((e)=>{
//     // var temp__ = {};
//     search_params[`${e.split("=")[0]}`] = e.split("=")[1];
// })

function setActiveBasedOnQuery() {
  const currentUrl = new URL(window.location.href);
  const assignment = currentUrl.searchParams.get("assignment");

  // Default to "Pending" if there's no assignment parameter
  const defaultAssignment = assignment ? assignment.trim() : "Pending";

  document.querySelectorAll(".assignment__").forEach((e) => {
    if (e.innerText.trim() === defaultAssignment) {
      e.classList.add("active");
    } else {
      e.classList.remove("active");
    }

    // Onclick event to update the URL and reload the page when clicked
    e.onclick = () => {
      if (!e.classList.contains("active")) {
        currentUrl.searchParams.set("assignment", e.innerText.trim());

        // Update the URL with the new search parameter and reload the page
        history.pushState({}, "", currentUrl.toString());
        window.location.reload(); // Reload to ensure content changes
      }
    };
  });
}

// Call the function to set the initial active class
setActiveBasedOnQuery();

// Optionally, you can listen for `popstate` to update active class if the user navigates back
window.addEventListener("popstate", setActiveBasedOnQuery);

// document.getElementById("btn1").onclick = () => {
//     if(!document.getElementById("btn1").classList.contains("active")) {
//         document.getElementById("btn1").classList.add("active")
//         document.getElementById("btn2").classList.remove("active")
//     }
// }

window.addEventListener("popstate", () => {
  refreshAssignments(); // Update when the URL changes
});


pa_elm = {
"pending": `     
          <div id="container-inside">
          <div class="content">
          <p class="title">{{assignments.pending.title}}</p>
          <p class="description" id="description">{{assignments.pending.description}}</p>
          <div class="date-diff">
          <p class="date">Due Date : <span>{{assignments.pending.due_date}}</span></p>
          <p class="difficulty">Difficulty : <span>{{assignments.pending.difficulty}}</span></p>
          </div>
          </div>
          <div class="btn">
          <div class="btn-inside">
          <button assignment_id="{{assignments.pending.aid}}" class="task_elm" nav="task" id="start">START</button>
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




// function activate_task_elms(){
//     console.log("HERE!");
//     document.querySelectorAll(".task_elm").forEach((e)=>{
//         e.onclick = ()=>{
//             task_id = e.getAttribute("assignment_id");
//             var mode = "text";
//             fetch("http://localhost:8000/get_mode/pending?task="+task_id)
//             .then((resp)=>resp.text())
//             .then((resp)=>{
//                 mode = resp;
//             })
//             .then(()=>{

//             window.location.href = `?app=playground&id=${task_id}&language=${mode.split('"')[1]}`;
//             });
//         }
//     })
// }

function extractLanguage(description) {
    const languages = [
      'Python',
      'JavaScript',
      'Java',
      'C++',
      'C#',
      'Ruby',
      'PHP',
      'Swift',
      'Go',
      'Kotlin',
      'R',
      'Rust',
      'Objective-C',
      'Perl',
      'Scala',
      'TypeScript'
    ];
    const lowerCaseDescription = description.toLowerCase();
    for (const language of languages) {
      if (lowerCaseDescription.includes(language.toLowerCase())) {
        return language;
      }
    }
    return 'text';
  }


function clickHandler() {
    let buttons = document.querySelectorAll('button[assignment_id]');

// Iterate over each button and attach click event listener
buttons.forEach(button => {
    button.addEventListener('click', function() {
        // Get the assignment ID from the button attribute
        let assignmentId = this.getAttribute('assignment_id');

        const languages = [
          'Python',
          'JavaScript',
          'Java',
          'C++',
          'C#',
          'Ruby',
          'PHP',
          'Swift',
          'Go',
          'Kotlin',
          'R',
          'Rust',
          'Objective-C',
          'Perl',
          'Scala',
          'TypeScript'
        ];



        fetch("http://localhost:8002/student/get_assignment?institute_id=123456&assignment_id="+assignmentId)
        .then(resp=>resp.json())
        .then((resp)=>{
          const description = resp.assignment.description.toLowerCase();
          let assign_language = "python";

          // Find the matching language from the list of known languages
          languages.forEach((language) => {
            if (description.includes(language.toLowerCase())) {
              assign_language = language.toLowerCase();
            }
          });
          history.pushState({}, '', `?app=playground&assignment_id=${assignmentId}&language=${assign_language}&institute_id=123456&student_id=001`);
          window.location.reload()
        })
    });
});
}

clickHandler()