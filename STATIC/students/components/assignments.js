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
<div id="container-inside" class="flex flex-col lg:flex-row gap-y-3 lg:gap-y-0 justify-between w-full items-start sm:items-center p-5 border-2 border-gray-300 rounded-lg">
  <div class="content flex flex-col gap-y-3 text-[#465362BF]">
    <p class="title text-xl font-bold text-[#011936]">{{assignments.pending.title}}</p>
    <p class="description text-lg" id="description">{{assignments.pending.description}}</p>
    <div class="date-diff flex flex-col sm:flex-row gap-5 text-base">
      <p class="date">Due Date : <span class="text-[#2593b3]">{{assignments.pending.due_date}}</span></p>
      <p class="difficulty">Difficulty : <span class="text-[#2593b3]">{{assignments.pending.difficulty}}</span></p>
    </div>
  </div>
  <div class="btn flex w-full sm:w-fit ">
    <div class="btn-inside w-full sm:w-fit">
      <button assignment_id="{{assignments.pending.aid}}" class="start-button w-full sm:w-fit task_elm py-3 sm:py-2 px-10 rounded bg-gradient-to-r from-cyan-400 to-sky-600 text-white border-none focus:outline-none" nav="task" id="start">START</button>
    </div>
  </div>
</div>

`,
"completed": `     
<div id="container-inside" class="flex flex-col lg:flex-row gap-y-3 lg:gap-y-0 justify-between w-full items-center p-5 border-2 border-gray-300 rounded-lg">
<div class="content flex flex-col gap-y-3 text-[#465362BF]">
  <p class="title text-xl font-bold text-[#011936]">{{assignments.completed.title}}</p>
  <p class="description text-lg" id="description">{{assignments.completed.description}}</p>
  <div class="date-diff flex flex-col sm:flex-row gap-5 text-base">
    <p class="date">Submitted on : <span class="text-[#2593b3]">{{assignments.completed.submit_date}}</span></p>
  </div>
</div>
<div class="btn">
  <div class="btn-inside">
    <button submission_id="{{assignments.completed.id}}" assignment_id="{{assignments.completed.aid}}" class="view-submission-button w-[206px] task_elm py-2 px-10 rounded bg-[#2ca3f2] text-white border-none focus:outline-none" nav="task" id="view">View Submission</button>
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


// document.querySelectorAll(".task_elm").forEach((e)=>{
//   e.onclick = ()=>{
//     search__ = window.location.search;
//     search__ = search__.replace("assignments", "playground");
//     window.location.href = window.location.pathname+search__+"&submission_id="+e.getAttribute("submission_id")+"&assignment_id="+e.getAttribute("assignment_id");
//   }
// })




function clickHandler() {
    let buttons = document.querySelectorAll('.start-button');

// Iterate over each button and attach click event listener
buttons.forEach(button => {
    button.addEventListener('click', function() {
        // Get the assignment ID from the button attribute
        let assignmentId = this.getAttribute('assignment_id');

        const languages = [
          'Python',
          'JavaScript',
          'Java',
           'C',
          'C++',
          'PHP',
          'Rust',
          'Golang'
        ];



        fetch("https://backend.edu.codemate.ai/student/get_assignment?institute_id=123456&assignment_id="+assignmentId)
        .then(resp=>resp.json())
        .then((resp)=>{
          // Convert the description to lowercase and split into words
          const descriptionWords = resp.assignment.description.toLowerCase().split(/\s+/); // Split by whitespace

          let assign_language = "python";
          console.log(descriptionWords);
          // Check if any known language matches a word in the description
          for (let word of descriptionWords) {
            if (languages.includes(word)) {
              assign_language = word; // If a matching language is found
              break; // Exit the loop if a match is found
            }
          }
          let newUrl = new URL(window.location.href);
          let institute_id = newUrl.searchParams.get('institute_id');
          let student_id = newUrl.searchParams.get('student_id')
          let assignment= newUrl.searchParams.get('assignment')
          history.pushState({}, '', `?app=playground&assignment_id=${assignmentId}&language=${assign_language}&institute_id=${institute_id}&student_id=${student_id}&assignment=${assignment}`);
          window.location.reload()
        })
    });
});
}

clickHandler()


function viewSubmissionsHandler() {
  let buttons = document.querySelectorAll('.view-submission-button');

// Iterate over each button and attach click event listener
buttons.forEach(button => {
  button.addEventListener('click', function() {
      // Get the assignment ID from the button attribute
    let submissionID = this.getAttribute('submission_id');
    let assignmentID=this.getAttribute('assignment_id')

      const languages = [
        'Python',
        'JavaScript',
        'Java',
         'C',
        'C++',
        'PHP',
        'Rust',
        'Golang'
      ];



      fetch("https://backend.edu.codemate.ai/student/get_assignment?institute_id=123456&assignment_id="+assignmentID)
      .then(resp=>resp.json())
      .then((resp)=>{
        console.log("resp=",resp)
        // Convert the description to lowercase and split into words
        const descriptionWords = resp.assignment.description.toLowerCase().split(/\s+/); // Split by whitespace

        let assign_language = "python";
        console.log(descriptionWords);
        // Check if any known language matches a word in the description
        for (let word of descriptionWords) {
          if (languages.includes(word)) {
            assign_language = word; // If a matching language is found
            break; // Exit the loop if a match is found
          }
        }
        let newUrl = new URL(window.location.href);
        let institute_id = newUrl.searchParams.get('institute_id');
        let student_id= newUrl.searchParams.get('student_id')
        history.pushState({}, '', `?app=playground&assignment=Completed&submission_id=${submissionID}&assignment_id=${assignmentID}&language=${assign_language}&institute_id=${institute_id}&student_id=${student_id}`);
        window.location.reload()
      })
  });
});
}

viewSubmissionsHandler()