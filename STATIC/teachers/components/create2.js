//stepper logic
var currentTab = 0; // Current tab is set to be the first tab (0)
        showTab(currentTab); // Display the current tab
        
        function showTab(n) {
          // This function will display the specified tab of the form...
          var x = document.getElementsByClassName("step");
          x[n].style.display = "block";
          //... and fix the Previous/Next buttons:
          // if (n == 0) {
          //   document.getElementById("prevBtn").style.display = "none";
          // } else {
          //   document.getElementById("prevBtn").style.display = "inline";
          // }
          // if (n == (x.length - 1)) {
          //   document.getElementById("nextBtn").innerHTML = "Submit";
          // } else {
          //   document.getElementById("nextBtn").innerHTML = "Next";
          // }
          //... and run a function that will display the correct step indicator:
          fixStepIndicator(n)
        }
        
        function nextPrev(n) {
          // This function will figure out which tab to display
          var x = document.getElementsByClassName("step");
          // if (n == 1 && !validateForm()) return false;
          // // Hide the current tab:
          document.getElementsByClassName("stepIndicator")[currentTab].className += " finish";
          x[currentTab].style.display = "none";
          // Increase or decrease the current tab by 1:
          currentTab = currentTab + n;    
          // if you have reached the end of the form...
          if (currentTab >= x.length) {
            // ... the form gets submitted:
            // document.getElementById("signUpForm").submit();
            return false;
          }
          // Otherwise, display the correct tab:
          showTab(currentTab);
        }
        
        // function validateForm() {
        //   // This function deals with validation of the form fields
        //   var x, y, i, valid = true;
        //   x = document.getElementsByClassName("step");
        //   y = x[currentTab].getElementsByTagName("input");
        //   // A loop that checks every input field in the current tab:
        //   for (i = 0; i < y.length; i++) {
        //     // If a field is empty...
        //     if (y[i].value == "") {
        //       // add an "invalid" class to the field:
        //       y[i].className += " invalid";
        //       // and set the current valid status to false
        //       valid = false;
        //     }
        //   }
        //   // If the valid status is true, mark the step as finished and valid:
        //   if (valid) {
        //     document.getElementsByClassName("stepIndicator")[currentTab].className += " finish";
        //   }
        //   return valid; // return the valid status
        // }
        
        function fixStepIndicator(n) {
          // This function removes the "active" class of all steps...
          var i, x = document.getElementsByClassName("stepIndicator");
          for (i = 0; i < x.length; i++) {
            x[i].className = x[i].className.replace(" active", "");
          }
          //... and adds the "active" class on the current step:
          x[n].className += " active";
}
        


//first step, introduce problem type logic


//here we are unlocking the do magic button only when all the necessary fields are filled
function checkFields() {
  const title = document.getElementById('title');
  const description = document.getElementById('description');
  const codingProblem = document.getElementById('codingProblem');
  const doMagicButton = document.getElementById('doMagic');

  // Check if all fields have some text
  if (title.value.trim() !== "" && description.value.trim() !== "" && codingProblem.value.trim() !== "") {
    doMagicButton.disabled = false;
  } else {
    doMagicButton.disabled = true;
  }
}

// Set an interval to check the fields every second
setInterval(checkFields, 1000);


//now "do magic" logic
let input = { title: "", description: "", codingProblem: "" };
let easyProblem = { title: "sdsdsdsd", description: "sdsdsdsd", codingProblem: "sdsdsd", selected:false };
let mediumProblem = { title: "sdsd", description: "sdsdsd", codingProblem: "sdsdsd", selected:false };
let hardProblem = { title: "sdsdsd", description: "sdsdsd", codingProblem: "sdsdsd", selected:false };

//helper function to extract values
function extractProblemDetails(response) {
  const titleMatch = response.match(/Title:\s*(.*?)\.\s*Description:/);
  const descriptionMatch = response.match(/Description:\s*(.*?)\.\s*CodingProblem:/);
  const codingProblemMatch = response.match(/CodingProblem:\s*(.*?)\s*Resources:/);

  const title = titleMatch ? titleMatch[1] : '';
  const description = descriptionMatch ? descriptionMatch[1] : '';
  const codingProblem = codingProblemMatch ? codingProblemMatch[1] : '';

  return { title, description, codingProblem };
}

// function to handle individual fetch requests

async function fetchTask(content, element, difficulty) {
  if (difficulty == "easy")
    document.getElementById("loader-text").innerText = "Creating Easy Problem...";
  if (difficulty == "medium")
    document.getElementById("loader-text").innerText = "Creating Medium Problem...";
  if (difficulty === "hard")
    document.getElementById("loader-text").innerText = "Creating Hard Problem...";
  try {
    const response = await fetch("http://localhost:8000/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
      }),
    });
    const data = await response.json();
    const problemDetails = extractProblemDetails(data.response);
    switch (difficulty) {
      case "easy":
        easyProblem.title = problemDetails.title;
        easyProblem.description = problemDetails.description;
        easyProblem.codingProblem = problemDetails.codingProblem;
        console.log(easyProblem)
        break;
      case "medium":
        mediumProblem.title = problemDetails.title;
        mediumProblem.description = problemDetails.description;
        mediumProblem.codingProblem = problemDetails.codingProblem;
        break;
      case "hard":
        hardProblem.title = problemDetails.title;
        hardProblem.description = problemDetails.description;
        hardProblem.codingProblem = problemDetails.codingProblem;
        break;
    }
    element.textContent = problemDetails.codingProblem;
    //give some breathing time to server
    await new Promise(resolve => setTimeout(resolve, 5000));
  } catch (error) {
    console.error('Error:', error);
  }
}

// main function to handle the magic logic
async function doMagic(event) {
  event.preventDefault();
  const titleValue = document.getElementById('title').value.trim();
  const descriptionValue = document.getElementById('description').value.trim();
  const codingProblemValue = document.getElementById('codingProblem').value.trim();
  input.title = titleValue;
  input.description = descriptionValue;
  input.codingProblem = codingProblemValue;
  const easyStatementElement = document.getElementById('easyStatement');
  const mediumStatementElement = document.getElementById('mediumStatement');
  const hardStatementElement = document.getElementById('hardStatement');
  
  document.getElementById("loader").style.display = "flex";

  //helps in running things parallely
  const tasks = [
    await fetchTask(`Generate a problem statement of easy nature using this title: ${titleValue}, description: ${descriptionValue}, and coding problem: ${codingProblemValue} .Give the output in this format:"Title:(improved title). Description: (improved description). CodingProblem: (only problem) .Resources:(only one youtube link)." Make sure the response string has got no newline character (\n). Maintain exactly this format: response string is 'Title:....(space).(space)Description:....(space).(space)CodingProblem:....(space).(space)REsources:....'`, easyStatementElement,"easy"),
    await fetchTask(`Generate a problem statement of medium nature using this title: ${titleValue}, description: ${descriptionValue}, and coding problem: ${codingProblemValue} .Give the output in this format:"Title:(improved title). Description: (improved description). CodingProblem: (only problem) .Resources:(only one youtube link)." Make sure the response string has got no newline character (\n). Maintain exactly this format: response string is 'Title:....(space).(space)Description:....(space).(space)CodingProblem:....(space).(space)REsources:....'`, mediumStatementElement,"medium"),
    await fetchTask(`Generate a problem statement of hard nature using this title: ${titleValue}, description: ${descriptionValue}, and coding problem: ${codingProblemValue} .Give the output in this format:"Title:(improved title). Description: (improved description). CodingProblem: (only problem) .Resources:(only one youtube link)." Make sure the response string has got no newline character (\n). Maintain exactly this format: response string is 'Title:....(space).(space)Description:....(space).(space)CodingProblem:....(space).(space)REsources:....'`, hardStatementElement,"hard")
  ];

  //the below portion was how the plan was supposed to be but it failed since the same server is being used and it cant
  //handle that many requests simultaenously so it was cancelling one of them
  // makes the execution wait for the async functions to finish otherwise it will just flow through
  //the async functions will be running in parallel , no issue with that and result will get updated but the loader will disappear and next step with default values will be shown in meantime
  // await Promise.all(tasks);

  document.getElementById("loader").style.display = "none";
  if(currentTab==0)
  nextPrev(1);
}

//modal logic on view problem

function displayEasyProblem() {
  document.getElementById("problemModal").style.display = "flex";
  document.getElementById("easyView").style.display = "flex";
  document.getElementById("easyViewTitle").innerText = easyProblem.title;
  document.getElementById("easyViewDescription").innerText = easyProblem.description;
  document.getElementById("easyViewCodingProblem").innerText = easyProblem.codingProblem;
}

function displayMediumProblem() {
  document.getElementById("problemModal").style.display = "flex";
  document.getElementById("mediumView").style.display = "flex";
  document.getElementById("mediumViewTitle").innerText = mediumProblem.title;
  document.getElementById("mediumViewDescription").innerText = mediumProblem.description;
  document.getElementById("mediumViewCodingProblem").innerText = mediumProblem.codingProblem;
}

function displayHardProblem() {
  document.getElementById("problemModal").style.display = "flex";
  document.getElementById("hardView").style.display = "flex";
  document.getElementById("hardViewTitle").innerText = hardProblem.title;
  document.getElementById("hardViewDescription").innerText = hardProblem.description;
  document.getElementById("hardViewCodingProblem").innerText = hardProblem.codingProblem;
}

function closeProblemModal() {
  document.getElementById("problemModal").style.display = "none";
  document.getElementById("easyView").style.display = "none";
  document.getElementById("mediumView").style.display = "none";
  document.getElementById("hardView").style.display = "none";
}


//edit and save logic
function editEasyProblem() {
  document.getElementById("easyViewTitle").style.display = "none";
  document.getElementById("easyViewDescription").style.display = "none";
  document.getElementById("easyViewCodingProblem").style.display = "none";
  document.getElementById("easyEditTitle").style.display = "flex";
  document.getElementById("easyEditDescription").style.display = "flex";
  document.getElementById("easyEditCodingProblem").style.display = "flex";
  document.getElementById("easyEditTitle").focus();
  document.getElementById("easyEditTitle").value = easyProblem.title;
  document.getElementById("easyEditDescription").value = easyProblem.description;
  document.getElementById("easyEditCodingProblem").value = easyProblem.codingProblem;
}

function saveEasyProblem() {
  easyProblem.title=document.getElementById("easyEditTitle").value;
  easyProblem.description=document.getElementById("easyEditDescription").value;
  easyProblem.codingProblem = document.getElementById("easyEditCodingProblem").value;
  document.getElementById("easyEditTitle").style.display = "none";
  document.getElementById("easyEditDescription").style.display = "none";
  document.getElementById("easyEditCodingProblem").style.display = "none";
  document.getElementById("easyViewTitle").style.display = "flex";
  document.getElementById("easyViewDescription").style.display = "flex";
  document.getElementById("easyViewCodingProblem").style.display = "flex";
  document.getElementById("easyViewTitle").innerText = easyProblem.title;
  document.getElementById("easyViewDescription").innerText = easyProblem.description;
  document.getElementById("easyViewCodingProblem").innerText = easyProblem.codingProblem;
  document.getElementById('easyStatement').innerText = easyProblem.codingProblem;
  var notyf = new Notyf();
  notyf.success("Changes made successfully!")
}

function editMediumProblem() {
  document.getElementById("mediumViewTitle").style.display = "none";
  document.getElementById("mediumViewDescription").style.display = "none";
  document.getElementById("mediumViewCodingProblem").style.display = "none";
  document.getElementById("mediumEditTitle").style.display = "flex";
  document.getElementById("mediumEditDescription").style.display = "flex";
  document.getElementById("mediumEditCodingProblem").style.display = "flex";
  document.getElementById("mediumEditTitle").focus();
  document.getElementById("mediumEditTitle").value = mediumProblem.title;
  document.getElementById("mediumEditDescription").value = mediumProblem.description;
  document.getElementById("mediumEditCodingProblem").value = mediumProblem.codingProblem;
}

function saveMediumProblem() {
  mediumProblem.title=document.getElementById("mediumEditTitle").value;
  mediumProblem.description=document.getElementById("mediumEditDescription").value;
  mediumProblem.codingProblem = document.getElementById("mediumEditCodingProblem").value;
  document.getElementById("mediumEditTitle").style.display = "none";
  document.getElementById("mediumEditDescription").style.display = "none";
  document.getElementById("mediumEditCodingProblem").style.display = "none";
  document.getElementById("mediumViewTitle").style.display = "flex";
  document.getElementById("mediumViewDescription").style.display = "flex";
  document.getElementById("mediumViewCodingProblem").style.display = "flex";
  document.getElementById("mediumViewTitle").innerText = mediumProblem.title;
  document.getElementById("mediumViewDescription").innerText = mediumProblem.description;
  document.getElementById("mediumViewCodingProblem").innerText = mediumProblem.codingProblem;
  document.getElementById('mediumStatement').innerText = mediumProblem.codingProblem;
  var notyf = new Notyf();
  notyf.success("Changes made successfully!")
}

function editHardProblem() {
  document.getElementById("hardViewTitle").style.display = "none";
  document.getElementById("hardViewDescription").style.display = "none";
  document.getElementById("hardViewCodingProblem").style.display = "none";
  document.getElementById("hardEditTitle").style.display = "flex";
  document.getElementById("hardEditDescription").style.display = "flex";
  document.getElementById("hardEditCodingProblem").style.display = "flex";
  document.getElementById("hardEditTitle").focus();
  document.getElementById("hardEditTitle").value = hardProblem.title;
  document.getElementById("hardEditDescription").value = hardProblem.description;
  document.getElementById("hardEditCodingProblem").value = hardProblem.codingProblem;
}

function saveHardProblem() {
  hardProblem.title=document.getElementById("hardEditTitle").value;
  hardProblem.description=document.getElementById("hardEditDescription").value;
  hardProblem.codingProblem = document.getElementById("hardEditCodingProblem").value;
  console.log(`document.getElementById("hardEditTitle").value=`, document.getElementById("hardEditTitle").value)
  console.log('hard problem=',hardProblem)
  document.getElementById("hardEditTitle").style.display = "none";
  document.getElementById("hardEditDescription").style.display = "none";
  document.getElementById("hardEditCodingProblem").style.display = "none";
  document.getElementById("hardViewTitle").style.display = "flex";
  document.getElementById("hardViewDescription").style.display = "flex";
  document.getElementById("hardViewCodingProblem").style.display = "flex";
  document.getElementById("hardViewTitle").innerText = hardProblem.title;
  document.getElementById("hardViewDescription").innerText = hardProblem.description;
  document.getElementById("hardViewCodingProblem").innerText = hardProblem.codingProblem;
  document.getElementById('hardStatement').innerText = hardProblem.codingProblem;
  var notyf = new Notyf();
  notyf.success("Changes made successfully!")
}

//select problem logic
function selectEasy() {
  document.getElementById("easyUnselected").style.display = "none";
  document.getElementById("easySelected").style.display = "block";
  easyProblem.selected = true;
  mediumProblem.selected = false;
  hardProblem.selected = false;
  document.getElementById("mediumUnselected").style.display = "block";
  document.getElementById("mediumSelected").style.display = "none";
  document.getElementById("hardUnselected").style.display = "block";
  document.getElementById("hardSelected").style.display = "none";
}

function selectMedium() {
  document.getElementById("mediumUnselected").style.display = "none";
  document.getElementById("mediumSelected").style.display = "block";
  easyProblem.selected = false;
  mediumProblem.selected = true;
  hardProblem.selected = false;
  document.getElementById("easyUnselected").style.display = "block";
  document.getElementById("easySelected").style.display = "none";
  document.getElementById("hardUnselected").style.display = "block";
  document.getElementById("hardSelected").style.display = "none";
}

function selectHard() {
  document.getElementById("hardUnselected").style.display = "none";
  document.getElementById("hardSelected").style.display = "block";
  easyProblem.selected = false;
  mediumProblem.selected = false;
  hardProblem.selected = true;
  document.getElementById("easyUnselected").style.display = "block";
  document.getElementById("easySelected").style.display = "none";
  document.getElementById("mediumUnselected").style.display = "block";
  document.getElementById("mediumSelected").style.display = "none";
}

//activate continue if anyone problem is selected , keep checking every 500ms

function checkSelect() {
  if (easyProblem.selected || mediumProblem.selected || hardProblem.selected)
    document.getElementById("continue").disabled = false;
  else
    document.getElementById("continue").disabled = true;
}

setInterval(checkSelect, 500);
