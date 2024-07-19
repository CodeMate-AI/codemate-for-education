uncheck_assign = {
    "assignment": `
    <div>
    <button style="outline: none; border: none; background: none;">
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16.5 13.5L12 18M12 18L16.5 22.5M12 18H24M31.5 18C31.5 25.4559 25.4559 31.5 18 31.5C10.5442 31.5 4.5 25.4559 4.5 18C4.5 10.5442 10.5442 4.5 18 4.5C25.4559 4.5 31.5 10.5442 31.5 18Z" stroke="#011936" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
    {{students.aid}}
    </div>
    `,
  "unchecked": `  
              
<div id="data" class="rounded-md mb-4 flex flex-wrap items-center justify-between">
  <div class="line1-for-mobile flex items-center gap-x-8">
  <input type="checkbox" style="background-color: #465362B2;">
  <div class="part1 flex flex-col gap-y-4">
    <div class="flex items-center gap-x-3">
<img src="https://s3-alpha-sig.figma.com/img/cb9a/a039/39e015567ec7c2c390f0447cdc7a643d?Expires=1722211200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=BTMIcsSQ8zQQXu8SBgz2IjUHjkuMQk3cdCBuVMlk7p4aGvOYvgm0TT4GBPvBBmBY3Qo7LgvCBjpXZiqQxKJXrF7Hkd48mxc6H~fdZlbzMw7ntwZHpOiGwUOF7kxWL-IkYOb0sNsykq2t50kvodx-qNc6a23OJurR7YeaGTV3aOw~-ZZpT4K5gdq2MbVNExBaCNFD8s6u6ZhmZcZVujdOVcpVc3wy85sOyu67LD2ciSi~BDnm-TSqALTkxitaybtDJE7aveEzWiFdM7vT3Ar6Wn6Je3CkSiBt2K7t5nFSB0Xr-yFqv4YeMbGTBePCc4FqU-3xQsNqs~J792sXdsywDg__" alt="">
      
      <p class="title">{{students.name}}</p>
      <div id="ontime">
        <button class="ontime cursor-none !py-2 !px-2" style="background-color:{{bg_color}}">{{students.ontime}}</button>
        </div>
      </div>
      <div class="line2-for-mobile flex items-center">
        <p class="date" style="color: #465362B2; font-size:0.9rem; font-weight:500;">Submitted On : <span>{{students.submitted_on}}</span></p>
        </div>
  </div>
  
  </div>
  <div class="progress flex justify-between w-[246px] h-[98px] mb-6 sm:mb-0">
    <div class="accuracy flex flex-col justify-center h-full">
        <div class="relative w-[60px] h-[60px]">
            <svg class="w-full h-full" viewBox="0 0 100 100">
              <!-- Background circle -->
              <circle
                class="text-gray-200 stroke-current"
                stroke-width="10"
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
              ></circle>
              <!-- Progress circle -->
              <circle
                class="text-[#2A9D8F]  progress-ring__circle stroke-current"
                stroke-width="10"
                stroke-linecap="round"
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke-dasharray="251.2" 
                stroke-dashoffset="calc(251.2px - (251.2px * {{sa.accuracy}}) / 100)"
              ></circle>
              
              <!-- Center text -->
              <text x="50" y="50" font-family="Verdana" font-size="22" fill="#2A9D8F" text-anchor="middle" font-weight="600" alignment-baseline="middle">{{sa.accuracy}}</text>
          
            </svg>
          </div>
          <span class="text-[#465362] text-center text-base">Accuracy</span>
    </div>
    <div class="efficiency flex flex-col justify-center h-full">
        <div class="relative w-[60px] h-[60px]">
            <svg class="w-full h-full" viewBox="0 0 100 100">
              <!-- Background circle -->
              <circle
                class="text-gray-200 stroke-current"
                stroke-width="10"
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
              ></circle>
              <!-- Progress circle -->
              <circle
                class="text-[#2A9D8F]  progress-ring__circle stroke-current"
                stroke-width="10"
                stroke-linecap="round"
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke-dasharray="251.2" 
                stroke-dashoffset="calc(251.2px - (251.2px * {{sa.efficiency}}) / 100)"
              ></circle>
              
              <!-- Center text -->
              <text x="50" y="50" font-family="Verdana" font-size="22" fill="#2A9D8F" text-anchor="middle" font-weight="600" alignment-baseline="middle">{{sa.efficiency}}</text>
          
            </svg>
          </div>
          <span class="text-[#465362] text-center text-base">Efficiency</span>
    </div>
    <div class="score flex flex-col justify-center h-full">
        <div class="relative w-[60px] h-[60px]">
            <svg class="w-full h-full" viewBox="0 0 100 100">
              <!-- Background circle -->
              <circle
                class="text-gray-200 stroke-current"
                stroke-width="10"
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
              ></circle>
              <!-- Progress circle -->
              <circle
                class="text-[#2A9D8F]  progress-ring__circle stroke-current"
                stroke-width="10"
                stroke-linecap="round"
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke-dasharray="251.2" 
                stroke-dashoffset="calc(251.2px - (251.2px * {{sa.score}}) / 100)"
              ></circle>
              
              <!-- Center text -->
              <text x="50" y="50" font-family="Verdana" font-size="22" fill="#2A9D8F" text-anchor="middle" font-weight="600" alignment-baseline="middle">{{sa.score}}</text>
          
            </svg>
          </div>
          <span class="text-[#465362] text-center text-base">Score</span>
    </div>
  </div>
  <div class="ontime-wrapper flex items-center gap-x-8">
  <!-- <button class="view viewfirst"><svg height="30px" width="30px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 236.816 236.816" xml:space="preserve" fill="#a21616" stroke="#a21616"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path style="fill:#0909b3;" d="M40.062,71.278h50c4.143,0,7.5-3.357,7.5-7.5s-3.357-7.5-7.5-7.5h-50c-4.143,0-7.5,3.357-7.5,7.5 S35.919,71.278,40.062,71.278z"></path> <path style="fill:#0909b3;" d="M40.062,106.553h109.331c4.143,0,7.5-3.357,7.5-7.5c0-4.142-3.357-7.5-7.5-7.5H40.062 c-4.143,0-7.5,3.358-7.5,7.5C32.562,103.195,35.919,106.553,40.062,106.553z"></path> <path style="fill:#0909b3;" d="M198.113,143.124l-19.474,22.646c-0.195,0.228-0.425,0.286-0.582,0.296 c-0.153,0.006-0.393-0.021-0.615-0.225l-13.508-12.278c-2.046-1.859-5.206-1.706-7.063,0.336c-1.857,2.043-1.706,5.205,0.337,7.063 l13.507,12.278c2.02,1.837,4.582,2.827,7.277,2.827c0.225,0,0.451-0.007,0.678-0.02c2.941-0.181,5.623-1.515,7.552-3.758 l19.474-22.645c1.801-2.094,1.563-5.25-0.531-7.051C203.071,140.793,199.915,141.029,198.113,143.124z"></path> <path style="fill:#0909b3;" d="M236.735,159.607c0-28.057-20.933-51.303-47.998-54.978V69.369c0-7.48-4.003-17.096-9.311-22.367 L141.374,9.223C136.078,3.965,126.456,0,118.993,0H17.582c-9.649,0-17.5,7.851-17.5,17.5v201.816c0,9.649,7.851,17.5,17.5,17.5 h153.655c9.649,0,17.5-7.851,17.5-17.5v-4.731C215.802,210.91,236.735,187.664,236.735,159.607z M167.479,56.278h-30.424 c-1.355,0-2.5-1.145-2.5-2.5V23.59L167.479,56.278z M171.237,221.816H17.582c-1.356,0-2.5-1.145-2.5-2.5V17.5 c0-1.355,1.144-2.5,2.5-2.5h101.411c0.181,0,0.371,0.01,0.563,0.021v38.757c0,9.649,7.851,17.5,17.5,17.5h36.682v33.352 c-15.26,2.072-28.564,10.361-37.271,22.235c-0.244-0.024-0.491-0.038-0.741-0.038H40.062c-4.143,0-7.5,3.357-7.5,7.5 c0,4.143,3.357,7.5,7.5,7.5h88.616c-1.895,5.586-2.938,11.562-2.938,17.78c0,8.011,1.72,15.623,4.788,22.508H99.393 c-4.143,0-7.5,3.357-7.5,7.5c0,4.143,3.357,7.5,7.5,7.5h36.331c1.37,0,2.649-0.373,3.755-1.014 c8.623,9.855,20.662,16.637,34.258,18.483v4.731C173.737,220.672,172.592,221.816,171.237,221.816z M181.237,200.105 c-22.33,0-40.497-18.166-40.497-40.498c0-22.331,18.167-40.498,40.497-40.498c22.331,0,40.498,18.167,40.498,40.498 C221.735,181.939,203.568,200.105,181.237,200.105z"></path> </g> </g></svg></button> -->
    <button student_id={{student_id}} submission_id="{{submission_id}}" assignment_id="{{assignments.completed.aid}}" class="view-submission-button w-[206px] task_elm py-2 px-10 rounded bg-[#2ca3f2] text-white border-none focus:outline-none" nav="task" id="view">View Submission</button>
  <button class="view view__button____" submission_id={{submission_id}}>
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M3 18C3 10.9289 3 7.39339 5.1967 5.1967C7.39339 3 10.9289 3 18 3C25.071 3 28.6066 3 30.8032 5.1967C33 7.39339 33 10.9289 33 18C33 25.071 33 28.6066 30.8032 30.8032C28.6066 33 25.071 33 18 33C10.9289 33 7.39339 33 5.1967 30.8032C3 28.6066 3 25.071 3 18ZM18 9.375C18.6213 9.375 19.125 9.87868 19.125 10.5V18.2839L21.7045 15.7045C22.1439 15.2652 22.8561 15.2652 23.2955 15.7045C23.7348 16.1439 23.7348 16.8561 23.2955 17.2955L18.7955 21.7955C18.5845 22.0065 18.2984 22.125 18 22.125C17.7016 22.125 17.4155 22.0065 17.2045 21.7955L12.7045 17.2955C12.2652 16.8561 12.2652 16.1439 12.7045 15.7045C13.1438 15.2652 13.8562 15.2652 14.2955 15.7045L16.875 18.2839V10.5C16.875 9.87868 17.3787 9.375 18 9.375ZM12 24.375C11.3787 24.375 10.875 24.8787 10.875 25.5C10.875 26.1213 11.3787 26.625 12 26.625H24C24.6213 26.625 25.125 26.1213 25.125 25.5C25.125 24.8787 24.6213 24.375 24 24.375H12Z" fill="url(#paint0_linear_719_37)"/>
      <defs>
      <linearGradient id="paint0_linear_719_37" x1="3" y1="18" x2="33" y2="18" gradientUnits="userSpaceOnUse">
      <stop stop-color="#2CA3F2"/>
      <stop offset="1" stop-color="#48AEF3"/>
      </linearGradient>
      </defs>
      </svg>
      
  </button>
  </div>
  </div>
    `
};

function goBack() {
  const button = document.getElementById("backButton")
  if(button) {
      button.addEventListener("click" , (event) => {
          event.preventDefault()
          window.location.reload();
          history.back();    
      })
  }

}

goBack()



document.querySelectorAll(`.view__button____`).forEach((e)=>{
  e.onclick = ()=>{
    window.open(`../report/?submission_id=${e.getAttribute('submission_id')}`, '_blank');
  }
})

function SelectAll() {
  let selectedAll = false;

  const selectAllButton = document.getElementById("select_all");
  const reevaluateButton = document.querySelector("#re_evaluate"); // The button container
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');

  // Function to check if any checkboxes are checked
  const anyCheckboxChecked = () => {
    return Array.from(checkboxes).some(checkbox => checkbox.checked);
  };

  // Toggle the visibility of the ReEvaluate button
  const updateReEvaluateButtonVisibility = () => {
    reevaluateButton.style.display = anyCheckboxChecked() ? "block" : "none";
  };

  selectAllButton.addEventListener("click", (e) => {
    e.preventDefault();
    
    selectedAll = !selectedAll; // Toggle the 'select all' state
    
    checkboxes.forEach(checkbox => {
      checkbox.checked = selectedAll;
    });

    // Change the text based on the new state
    selectAllButton.innerText = selectedAll ? "Unselect All" : "Select All";

    // Update the visibility of the ReEvaluate button
    updateReEvaluateButtonVisibility();
  });

  // Initial check for visibility
  updateReEvaluateButtonVisibility();
}

SelectAll();

function viewSubmissionsHandler() {
  let buttons = document.querySelectorAll('.view-submission-button');

// Iterate over each button and attach click event listener
buttons.forEach(button => {
  button.addEventListener('click', function() {
      // Get the assignment ID from the button attribute
    let submissionID = this.getAttribute('submission_id');
    let assignmentID = this.getAttribute('assignment_id')
    let studentID=this.getAttribute('student_id')

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

        let assign_language = "javascript";
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
        let teacher_id= newUrl.searchParams.get('teacher_id')
        history.pushState({}, '', `?app=playground&assignment=Completed&submission_id=${submissionID}&assignment_id=${assignmentID}&language=${assign_language}&institute_id=${institute_id}&student_id=${studentID}&teacher_id=${teacher_id}`);
        window.location.reload()
      })
  });
});
}

viewSubmissionsHandler()