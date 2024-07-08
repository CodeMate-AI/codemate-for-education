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
let easyProblem = { title: "", description: "", codingProblem: "", selected:false };
let mediumProblem = { title: "", description: "", codingProblem: "", selected:false };
let hardProblem = { title: "", description: "", codingProblem: "", selected:false };

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

//continue logic
function openPublishModal() {
  document.getElementById("publish").style.display = "flex";
  document.getElementById("publishModal").style.display = "flex";
}

//logic for additional details like evaluation parameters

//handle doc upload
function handleDocsUpload(event) {
  console.log(event)
  const file = event.target.files[0];  // Get the uploaded file
  const label = document.getElementById("upload-label");  // Label for display
  const url = URL.createObjectURL(file);  // URL to open in a new tab

  const removeFile = document.createElement('button');  // Create a "Remove" button
  removeFile.textContent = 'Remove File';  // Set the text
  removeFile.style.marginLeft = '10px';

  if (file) {
    let icon = '';  // Variable for the appropriate icon

    // Set the icon depending on the file type
    if (file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      icon = '📄';  // DOCX icon
    } else if (file.type === 'application/pdf') {
      icon = '📜';  // PDF icon
    }

    // Display the file name with the icon and make it clickable
    label.innerHTML = `<a href="${url}" target="_blank">${icon} ${file.name}</a>`;
    label.appendChild(removeFile)

    removeFile.addEventListener("click", () => {
      document.getElementById("file-upload").value = '';  // Reset the file input
      // Restore the original label content
      label.innerHTML = `
                  <svg class="mx-auto cursor-pointer" width="472" height="61" viewBox="0 0 472 61" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0.5" y="1.16406" width="471" height="59" rx="5.5" fill="white"/>
            <rect x="0.5" y="1.16406" width="471" height="59" rx="5.5" stroke="#465362" stroke-dasharray="8 8"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M146 30.6641C146 25.95 146 23.593 147.464 22.1285C148.929 20.6641 151.286 20.6641 156 20.6641C160.714 20.6641 163.071 20.6641 164.535 22.1285C166 23.593 166 25.95 166 30.6641C166 35.3781 166 37.7352 164.535 39.1996C163.071 40.6641 160.714 40.6641 156 40.6641C151.286 40.6641 148.929 40.6641 147.464 39.1996C146 37.7352 146 35.3781 146 30.6641ZM156 36.4141C156.414 36.4141 156.75 36.0783 156.75 35.6641V30.4748L158.47 32.1944C158.763 32.4873 159.237 32.4873 159.53 32.1944C159.823 31.9015 159.823 31.4267 159.53 31.1338L156.53 28.1337C156.39 27.9931 156.199 27.9141 156 27.9141C155.801 27.9141 155.61 27.9931 155.47 28.1337L152.47 31.1338C152.177 31.4267 152.177 31.9015 152.47 32.1944C152.763 32.4873 153.237 32.4873 153.53 32.1944L155.25 30.4748V35.6641C155.25 36.0783 155.586 36.4141 156 36.4141ZM152 26.4141C151.586 26.4141 151.25 26.0783 151.25 25.6641C151.25 25.2499 151.586 24.9141 152 24.9141H160C160.414 24.9141 160.75 25.2499 160.75 25.6641C160.75 26.0783 160.414 26.4141 160 26.4141H152Z" fill="#465362"/>
            <path d="M181.119 35.6641V25.4822H184.847C185.57 25.4822 186.168 25.6016 186.642 25.8402C187.116 26.0755 187.471 26.3954 187.706 26.7997C187.941 27.2008 188.059 27.6532 188.059 28.157C188.059 28.5812 187.981 28.9392 187.825 29.2308C187.67 29.5192 187.461 29.7512 187.199 29.9268C186.94 30.0992 186.655 30.2251 186.344 30.3047V30.4041C186.682 30.4207 187.012 30.5301 187.333 30.7322C187.658 30.9311 187.926 31.2145 188.138 31.5824C188.351 31.9503 188.457 32.3977 188.457 32.9247C188.457 33.4451 188.334 33.9124 188.089 34.3267C187.847 34.7377 187.472 35.0642 186.965 35.3061C186.458 35.5447 185.81 35.6641 185.021 35.6641H181.119ZM182.655 34.3466H184.872C185.608 34.3466 186.135 34.2041 186.453 33.919C186.771 33.634 186.93 33.2777 186.93 32.8501C186.93 32.5286 186.849 32.2337 186.687 31.9652C186.524 31.6967 186.292 31.483 185.991 31.3239C185.692 31.1648 185.338 31.0852 184.927 31.0852H182.655V34.3466ZM182.655 29.8871H184.713C185.058 29.8871 185.368 29.8208 185.643 29.6882C185.921 29.5556 186.142 29.37 186.304 29.1314C186.47 28.8894 186.553 28.6044 186.553 28.2763C186.553 27.8554 186.405 27.5024 186.11 27.2173C185.815 26.9323 185.363 26.7898 184.753 26.7898H182.655V29.8871ZM190.159 35.6641V28.0277H191.596V29.2408H191.676C191.815 28.8298 192.06 28.5066 192.412 28.2713C192.766 28.0327 193.167 27.9134 193.615 27.9134C193.708 27.9134 193.817 27.9167 193.943 27.9233C194.072 27.9299 194.173 27.9382 194.246 27.9482V29.37C194.186 29.3535 194.08 29.3352 193.928 29.3153C193.775 29.2921 193.623 29.2805 193.471 29.2805C193.119 29.2805 192.806 29.3551 192.531 29.5043C192.259 29.6501 192.044 29.8539 191.885 30.1158C191.725 30.3743 191.646 30.6693 191.646 31.0007V35.6641H190.159ZM198.476 35.8182C197.76 35.8182 197.135 35.6541 196.601 35.326C196.068 34.9979 195.653 34.5388 195.358 33.9489C195.064 33.3589 194.916 32.6695 194.916 31.8807C194.916 31.0885 195.064 30.3958 195.358 29.8026C195.653 29.2093 196.068 28.7486 196.601 28.4205C197.135 28.0923 197.76 27.9283 198.476 27.9283C199.192 27.9283 199.816 28.0923 200.35 28.4205C200.884 28.7486 201.298 29.2093 201.593 29.8026C201.888 30.3958 202.035 31.0885 202.035 31.8807C202.035 32.6695 201.888 33.3589 201.593 33.9489C201.298 34.5388 200.884 34.9979 200.35 35.326C199.816 35.6541 199.192 35.8182 198.476 35.8182ZM198.481 34.5703C198.945 34.5703 199.329 34.4477 199.634 34.2024C199.939 33.9571 200.164 33.6307 200.31 33.223C200.459 32.8153 200.534 32.3662 200.534 31.8757C200.534 31.3885 200.459 30.9411 200.31 30.5334C200.164 30.1224 199.939 29.7926 199.634 29.544C199.329 29.2955 198.945 29.1712 198.481 29.1712C198.013 29.1712 197.626 29.2955 197.317 29.544C197.012 29.7926 196.785 30.1224 196.636 30.5334C196.49 30.9411 196.417 31.3885 196.417 31.8757C196.417 32.3662 196.49 32.8153 196.636 33.223C196.785 33.6307 197.012 33.9571 197.317 34.2024C197.626 34.4477 198.013 34.5703 198.481 34.5703ZM205.118 35.6641L202.871 28.0277H204.407L205.903 33.6357H205.978L207.479 28.0277H209.015L210.507 33.6108H210.581L212.068 28.0277H213.604L211.362 35.6641H209.846L208.295 30.1506H208.18L206.629 35.6641H205.118ZM220.737 29.892L219.39 30.1307C219.334 29.9583 219.244 29.7943 219.121 29.6385C219.002 29.4827 218.84 29.3551 218.634 29.2557C218.429 29.1562 218.172 29.1065 217.864 29.1065C217.443 29.1065 217.091 29.201 216.81 29.3899C216.528 29.5755 216.387 29.8158 216.387 30.1108C216.387 30.366 216.482 30.5715 216.67 30.7273C216.859 30.883 217.164 31.0107 217.585 31.1101L218.798 31.3885C219.501 31.5509 220.025 31.8011 220.369 32.1392C220.714 32.4773 220.886 32.9164 220.886 33.4567C220.886 33.9141 220.754 34.3217 220.489 34.6797C220.227 35.0343 219.861 35.3127 219.39 35.5149C218.923 35.7171 218.381 35.8182 217.764 35.8182C216.909 35.8182 216.211 35.6359 215.671 35.2713C215.131 34.9034 214.799 34.3814 214.677 33.7053L216.114 33.4865C216.203 33.861 216.387 34.1444 216.665 34.3366C216.944 34.5256 217.307 34.62 217.754 34.62C218.241 34.62 218.631 34.5189 218.923 34.3168C219.214 34.1113 219.36 33.861 219.36 33.5661C219.36 33.3274 219.271 33.1269 219.092 32.9645C218.916 32.8021 218.646 32.6795 218.281 32.5966L216.989 32.3132C216.276 32.1508 215.749 31.8923 215.408 31.5376C215.07 31.183 214.901 30.7339 214.901 30.1903C214.901 29.7396 215.027 29.3452 215.278 29.0071C215.53 28.669 215.878 28.4055 216.322 28.2166C216.767 28.0244 217.275 27.9283 217.849 27.9283C218.674 27.9283 219.324 28.1072 219.798 28.4652C220.272 28.8198 220.585 29.2955 220.737 29.892ZM225.812 35.8182C225.06 35.8182 224.412 35.6574 223.868 35.3359C223.328 35.0111 222.91 34.5554 222.615 33.9688C222.324 33.3788 222.178 32.6877 222.178 31.8956C222.178 31.1134 222.324 30.424 222.615 29.8274C222.91 29.2308 223.321 28.7652 223.848 28.4304C224.378 28.0956 224.998 27.9283 225.708 27.9283C226.138 27.9283 226.556 27.9995 226.96 28.142C227.365 28.2846 227.728 28.5083 228.049 28.8132C228.371 29.1181 228.624 29.5142 228.81 30.0014C228.995 30.4853 229.088 31.0736 229.088 31.7663V32.2933H223.018V31.1797H227.632C227.632 30.7886 227.552 30.4422 227.393 30.1406C227.234 29.8357 227.01 29.5954 226.722 29.4197C226.437 29.2441 226.102 29.1562 225.718 29.1562C225.3 29.1562 224.935 29.259 224.624 29.4645C224.316 29.6667 224.077 29.9318 223.908 30.2599C223.742 30.5848 223.659 30.9377 223.659 31.3189V32.1889C223.659 32.6993 223.749 33.1335 223.928 33.4915C224.11 33.8494 224.364 34.1229 224.688 34.3118C225.013 34.4974 225.393 34.5902 225.827 34.5902C226.109 34.5902 226.365 34.5504 226.597 34.4709C226.829 34.388 227.03 34.2654 227.199 34.103C227.368 33.9406 227.497 33.7401 227.587 33.5014L228.994 33.755C228.881 34.1693 228.679 34.5322 228.387 34.8438C228.099 35.152 227.736 35.3923 227.298 35.5646C226.864 35.7337 226.369 35.8182 225.812 35.8182ZM237.659 35.8182C236.943 35.8182 236.319 35.6541 235.785 35.326C235.251 34.9979 234.837 34.5388 234.542 33.9489C234.247 33.3589 234.1 32.6695 234.1 31.8807C234.1 31.0885 234.247 30.3958 234.542 29.8026C234.837 29.2093 235.251 28.7486 235.785 28.4205C236.319 28.0923 236.943 27.9283 237.659 27.9283C238.375 27.9283 239 28.0923 239.534 28.4205C240.067 28.7486 240.481 29.2093 240.776 29.8026C241.071 30.3958 241.219 31.0885 241.219 31.8807C241.219 32.6695 241.071 33.3589 240.776 33.9489C240.481 34.5388 240.067 34.9979 239.534 35.326C239 35.6541 238.375 35.8182 237.659 35.8182ZM237.664 34.5703C238.128 34.5703 238.513 34.4477 238.818 34.2024C239.123 33.9571 239.348 33.6307 239.494 33.223C239.643 32.8153 239.718 32.3662 239.718 31.8757C239.718 31.3885 239.643 30.9411 239.494 30.5334C239.348 30.1224 239.123 29.7926 238.818 29.544C238.513 29.2955 238.128 29.1712 237.664 29.1712C237.197 29.1712 236.809 29.2955 236.501 29.544C236.196 29.7926 235.969 30.1224 235.82 30.5334C235.674 30.9411 235.601 31.3885 235.601 31.8757C235.601 32.3662 235.674 32.8153 235.82 33.223C235.969 33.6307 236.196 33.9571 236.501 34.2024C236.809 34.4477 237.197 34.5703 237.664 34.5703ZM242.878 35.6641V28.0277H244.315V29.2408H244.395C244.534 28.8298 244.779 28.5066 245.13 28.2713C245.485 28.0327 245.886 27.9134 246.333 27.9134C246.426 27.9134 246.536 27.9167 246.662 27.9233C246.791 27.9299 246.892 27.9382 246.965 27.9482V29.37C246.905 29.3535 246.799 29.3352 246.647 29.3153C246.494 29.2921 246.342 29.2805 246.189 29.2805C245.838 29.2805 245.525 29.3551 245.25 29.5043C244.978 29.6501 244.762 29.8539 244.603 30.1158C244.444 30.3743 244.365 30.6693 244.365 31.0007V35.6641H242.878ZM258.623 25.4822H260.164V32.179C260.164 32.8916 259.997 33.523 259.662 34.0732C259.328 34.62 258.857 35.0509 258.25 35.3658C257.644 35.6773 256.933 35.8331 256.118 35.8331C255.306 35.8331 254.596 35.6773 253.99 35.3658C253.383 35.0509 252.913 34.62 252.578 34.0732C252.243 33.523 252.076 32.8916 252.076 32.179V25.4822H253.612V32.0547C253.612 32.5154 253.713 32.9247 253.915 33.2827C254.121 33.6406 254.411 33.9223 254.785 34.1278C255.16 34.33 255.604 34.4311 256.118 34.4311C256.635 34.4311 257.08 34.33 257.455 34.1278C257.833 33.9223 258.121 33.6406 258.32 33.2827C258.522 32.9247 258.623 32.5154 258.623 32.0547V25.4822ZM262.279 38.5277V28.0277H263.73V29.2656H263.855C263.941 29.1065 264.065 28.9226 264.227 28.7138C264.39 28.505 264.615 28.3227 264.904 28.1669C265.192 28.0078 265.573 27.9283 266.047 27.9283C266.664 27.9283 267.214 28.084 267.698 28.3956C268.182 28.7071 268.561 29.1562 268.836 29.7429C269.115 30.3295 269.254 31.0355 269.254 31.8608C269.254 32.6861 269.116 33.3937 268.841 33.9837C268.566 34.5703 268.188 35.0227 267.708 35.3409C267.227 35.6558 266.678 35.8132 266.062 35.8132C265.598 35.8132 265.218 35.7353 264.923 35.5795C264.632 35.4238 264.403 35.2415 264.237 35.0327C264.072 34.8239 263.944 34.6383 263.855 34.4759H263.765V38.5277H262.279ZM263.735 31.8459C263.735 32.3828 263.813 32.8535 263.969 33.2578C264.125 33.6622 264.35 33.9787 264.645 34.2074C264.94 34.4328 265.301 34.5455 265.729 34.5455C266.173 34.5455 266.544 34.4278 266.843 34.1925C267.141 33.9538 267.366 33.6307 267.519 33.223C267.674 32.8153 267.752 32.3563 267.752 31.8459C267.752 31.3421 267.676 30.8897 267.524 30.4886C267.374 30.0876 267.149 29.7711 266.847 29.5391C266.549 29.3071 266.176 29.1911 265.729 29.1911C265.298 29.1911 264.933 29.3021 264.635 29.5241C264.34 29.7462 264.116 30.0561 263.964 30.4538C263.811 30.8516 263.735 31.3156 263.735 31.8459ZM272.406 25.4822V35.6641H270.919V25.4822H272.406ZM277.622 35.8182C276.906 35.8182 276.281 35.6541 275.748 35.326C275.214 34.9979 274.8 34.5388 274.505 33.9489C274.21 33.3589 274.062 32.6695 274.062 31.8807C274.062 31.0885 274.21 30.3958 274.505 29.8026C274.8 29.2093 275.214 28.7486 275.748 28.4205C276.281 28.0923 276.906 27.9283 277.622 27.9283C278.338 27.9283 278.963 28.0923 279.496 28.4205C280.03 28.7486 280.444 29.2093 280.739 29.8026C281.034 30.3958 281.182 31.0885 281.182 31.8807C281.182 32.6695 281.034 33.3589 280.739 33.9489C280.444 34.5388 280.03 34.9979 279.496 35.326C278.963 35.6541 278.338 35.8182 277.622 35.8182ZM277.627 34.5703C278.091 34.5703 278.476 34.4477 278.781 34.2024C279.085 33.9571 279.311 33.6307 279.457 33.223C279.606 32.8153 279.68 32.3662 279.68 31.8757C279.68 31.3885 279.606 30.9411 279.457 30.5334C279.311 30.1224 279.085 29.7926 278.781 29.544C278.476 29.2955 278.091 29.1712 277.627 29.1712C277.16 29.1712 276.772 29.2955 276.464 29.544C276.159 29.7926 275.932 30.1224 275.783 30.5334C275.637 30.9411 275.564 31.3885 275.564 31.8757C275.564 32.3662 275.637 32.8153 275.783 33.223C275.932 33.6307 276.159 33.9571 276.464 34.2024C276.772 34.4477 277.16 34.5703 277.627 34.5703ZM285.063 35.8331C284.579 35.8331 284.142 35.7436 283.751 35.5646C283.36 35.3823 283.05 35.1188 282.821 34.7741C282.596 34.4295 282.483 34.0069 282.483 33.5064C282.483 33.0755 282.566 32.7209 282.732 32.4425C282.897 32.1641 283.121 31.9437 283.403 31.7812C283.685 31.6188 283.999 31.4962 284.347 31.4134C284.695 31.3305 285.05 31.2675 285.411 31.2244C285.869 31.1714 286.24 31.1283 286.525 31.0952C286.81 31.0587 287.017 31.0007 287.146 30.9212C287.276 30.8416 287.34 30.7124 287.34 30.5334V30.4986C287.34 30.0644 287.218 29.728 286.972 29.4893C286.731 29.2507 286.369 29.1314 285.889 29.1314C285.388 29.1314 284.994 29.2424 284.705 29.4645C284.42 29.6832 284.223 29.9268 284.114 30.1953L282.717 29.8771C282.883 29.4131 283.124 29.0386 283.443 28.7536C283.764 28.4652 284.134 28.2564 284.551 28.1271C284.969 27.9946 285.408 27.9283 285.869 27.9283C286.174 27.9283 286.497 27.9647 286.838 28.0376C287.183 28.1072 287.504 28.2365 287.803 28.4254C288.104 28.6143 288.351 28.8845 288.544 29.2358C288.736 29.5838 288.832 30.0362 288.832 30.593V35.6641H287.38V34.62H287.32C287.224 34.8123 287.08 35.0012 286.888 35.1868C286.696 35.3724 286.449 35.5265 286.147 35.6491C285.846 35.7718 285.484 35.8331 285.063 35.8331ZM285.387 34.6399C285.798 34.6399 286.149 34.5587 286.441 34.3963C286.735 34.2339 286.959 34.0218 287.112 33.7599C287.267 33.4948 287.345 33.2114 287.345 32.9098V31.9254C287.292 31.9785 287.19 32.0282 287.037 32.0746C286.888 32.1177 286.717 32.1558 286.525 32.1889C286.333 32.2187 286.146 32.2469 285.963 32.2734C285.781 32.2966 285.628 32.3165 285.506 32.3331C285.218 32.3696 284.954 32.4309 284.715 32.517C284.48 32.6032 284.291 32.7275 284.149 32.8899C284.009 33.049 283.94 33.2611 283.94 33.5263C283.94 33.8942 284.076 34.1726 284.347 34.3615C284.619 34.5471 284.966 34.6399 285.387 34.6399ZM293.67 35.8132C293.054 35.8132 292.504 35.6558 292.02 35.3409C291.539 35.0227 291.161 34.5703 290.886 33.9837C290.615 33.3937 290.479 32.6861 290.479 31.8608C290.479 31.0355 290.616 30.3295 290.891 29.7429C291.17 29.1562 291.551 28.7071 292.035 28.3956C292.519 28.084 293.067 27.9283 293.68 27.9283C294.154 27.9283 294.536 28.0078 294.824 28.1669C295.116 28.3227 295.341 28.505 295.5 28.7138C295.662 28.9226 295.788 29.1065 295.878 29.2656H295.967V25.4822H297.454V35.6641H296.002V34.4759H295.878C295.788 34.6383 295.659 34.8239 295.49 35.0327C295.324 35.2415 295.096 35.4238 294.804 35.5795C294.512 35.7353 294.134 35.8132 293.67 35.8132ZM293.999 34.5455C294.426 34.5455 294.787 34.4328 295.082 34.2074C295.381 33.9787 295.606 33.6622 295.759 33.2578C295.914 32.8535 295.992 32.3828 295.992 31.8459C295.992 31.3156 295.916 30.8516 295.763 30.4538C295.611 30.0561 295.387 29.7462 295.092 29.5241C294.797 29.3021 294.433 29.1911 293.999 29.1911C293.551 29.1911 293.178 29.3071 292.88 29.5391C292.582 29.7711 292.356 30.0876 292.204 30.4886C292.055 30.8897 291.98 31.3421 291.98 31.8459C291.98 32.3563 292.056 32.8153 292.209 33.223C292.361 33.6307 292.587 33.9538 292.885 34.1925C293.187 34.4278 293.558 34.5455 293.999 34.5455ZM303.4 35.6641V25.4822H309.714V26.8047H304.936V29.907H309.261V31.2244H304.936V35.6641H303.4ZM311.484 35.6641V28.0277H312.97V35.6641H311.484ZM312.234 26.8494C311.976 26.8494 311.754 26.7633 311.568 26.5909C311.386 26.4152 311.295 26.2064 311.295 25.9645C311.295 25.7192 311.386 25.5104 311.568 25.3381C311.754 25.1624 311.976 25.0746 312.234 25.0746C312.493 25.0746 312.713 25.1624 312.896 25.3381C313.081 25.5104 313.174 25.7192 313.174 25.9645C313.174 26.2064 313.081 26.4152 312.896 26.5909C312.713 26.7633 312.493 26.8494 312.234 26.8494ZM316.456 25.4822V35.6641H314.97V25.4822H316.456ZM321.748 35.8182C320.995 35.8182 320.347 35.6574 319.804 35.3359C319.263 35.0111 318.846 34.5554 318.551 33.9688C318.259 33.3788 318.113 32.6877 318.113 31.8956C318.113 31.1134 318.259 30.424 318.551 29.8274C318.846 29.2308 319.257 28.7652 319.784 28.4304C320.314 28.0956 320.934 27.9283 321.643 27.9283C322.074 27.9283 322.492 27.9995 322.896 28.142C323.3 28.2846 323.663 28.5083 323.985 28.8132C324.306 29.1181 324.56 29.5142 324.745 30.0014C324.931 30.4853 325.024 31.0736 325.024 31.7663V32.2933H318.953V31.1797H323.567C323.567 30.7886 323.488 30.4422 323.328 30.1406C323.169 29.8357 322.946 29.5954 322.657 29.4197C322.372 29.2441 322.038 29.1562 321.653 29.1562C321.235 29.1562 320.871 29.259 320.559 29.4645C320.251 29.6667 320.012 29.9318 319.843 30.2599C319.678 30.5848 319.595 30.9377 319.595 31.3189V32.1889C319.595 32.6993 319.684 33.1335 319.863 33.4915C320.046 33.8494 320.299 34.1229 320.624 34.3118C320.949 34.4974 321.328 34.5902 321.762 34.5902C322.044 34.5902 322.301 34.5504 322.533 34.4709C322.765 34.388 322.966 34.2654 323.135 34.103C323.304 33.9406 323.433 33.7401 323.522 33.5014L324.929 33.755C324.817 34.1693 324.614 34.5322 324.323 34.8438C324.034 35.152 323.672 35.3923 323.234 35.5646C322.8 35.7337 322.304 35.8182 321.748 35.8182Z" fill="#465362"/>
            </svg>
            `;
    })
  } else {
    // If no file is selected, revert back to original content
    label.innerHTML = `
                    <svg class="mx-auto cursor-pointer" width="472" height="61" viewBox="0 0 472 61" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0.5" y="1.16406" width="471" height="59" rx="5.5" fill="white"/>
            <rect x="0.5" y="1.16406" width="471" height="59" rx="5.5" stroke="#465362" stroke-dasharray="8 8"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M146 30.6641C146 25.95 146 23.593 147.464 22.1285C148.929 20.6641 151.286 20.6641 156 20.6641C160.714 20.6641 163.071 20.6641 164.535 22.1285C166 23.593 166 25.95 166 30.6641C166 35.3781 166 37.7352 164.535 39.1996C163.071 40.6641 160.714 40.6641 156 40.6641C151.286 40.6641 148.929 40.6641 147.464 39.1996C146 37.7352 146 35.3781 146 30.6641ZM156 36.4141C156.414 36.4141 156.75 36.0783 156.75 35.6641V30.4748L158.47 32.1944C158.763 32.4873 159.237 32.4873 159.53 32.1944C159.823 31.9015 159.823 31.4267 159.53 31.1338L156.53 28.1337C156.39 27.9931 156.199 27.9141 156 27.9141C155.801 27.9141 155.61 27.9931 155.47 28.1337L152.47 31.1338C152.177 31.4267 152.177 31.9015 152.47 32.1944C152.763 32.4873 153.237 32.4873 153.53 32.1944L155.25 30.4748V35.6641C155.25 36.0783 155.586 36.4141 156 36.4141ZM152 26.4141C151.586 26.4141 151.25 26.0783 151.25 25.6641C151.25 25.2499 151.586 24.9141 152 24.9141H160C160.414 24.9141 160.75 25.2499 160.75 25.6641C160.75 26.0783 160.414 26.4141 160 26.4141H152Z" fill="#465362"/>
            <path d="M181.119 35.6641V25.4822H184.847C185.57 25.4822 186.168 25.6016 186.642 25.8402C187.116 26.0755 187.471 26.3954 187.706 26.7997C187.941 27.2008 188.059 27.6532 188.059 28.157C188.059 28.5812 187.981 28.9392 187.825 29.2308C187.67 29.5192 187.461 29.7512 187.199 29.9268C186.94 30.0992 186.655 30.2251 186.344 30.3047V30.4041C186.682 30.4207 187.012 30.5301 187.333 30.7322C187.658 30.9311 187.926 31.2145 188.138 31.5824C188.351 31.9503 188.457 32.3977 188.457 32.9247C188.457 33.4451 188.334 33.9124 188.089 34.3267C187.847 34.7377 187.472 35.0642 186.965 35.3061C186.458 35.5447 185.81 35.6641 185.021 35.6641H181.119ZM182.655 34.3466H184.872C185.608 34.3466 186.135 34.2041 186.453 33.919C186.771 33.634 186.93 33.2777 186.93 32.8501C186.93 32.5286 186.849 32.2337 186.687 31.9652C186.524 31.6967 186.292 31.483 185.991 31.3239C185.692 31.1648 185.338 31.0852 184.927 31.0852H182.655V34.3466ZM182.655 29.8871H184.713C185.058 29.8871 185.368 29.8208 185.643 29.6882C185.921 29.5556 186.142 29.37 186.304 29.1314C186.47 28.8894 186.553 28.6044 186.553 28.2763C186.553 27.8554 186.405 27.5024 186.11 27.2173C185.815 26.9323 185.363 26.7898 184.753 26.7898H182.655V29.8871ZM190.159 35.6641V28.0277H191.596V29.2408H191.676C191.815 28.8298 192.06 28.5066 192.412 28.2713C192.766 28.0327 193.167 27.9134 193.615 27.9134C193.708 27.9134 193.817 27.9167 193.943 27.9233C194.072 27.9299 194.173 27.9382 194.246 27.9482V29.37C194.186 29.3535 194.08 29.3352 193.928 29.3153C193.775 29.2921 193.623 29.2805 193.471 29.2805C193.119 29.2805 192.806 29.3551 192.531 29.5043C192.259 29.6501 192.044 29.8539 191.885 30.1158C191.725 30.3743 191.646 30.6693 191.646 31.0007V35.6641H190.159ZM198.476 35.8182C197.76 35.8182 197.135 35.6541 196.601 35.326C196.068 34.9979 195.653 34.5388 195.358 33.9489C195.064 33.3589 194.916 32.6695 194.916 31.8807C194.916 31.0885 195.064 30.3958 195.358 29.8026C195.653 29.2093 196.068 28.7486 196.601 28.4205C197.135 28.0923 197.76 27.9283 198.476 27.9283C199.192 27.9283 199.816 28.0923 200.35 28.4205C200.884 28.7486 201.298 29.2093 201.593 29.8026C201.888 30.3958 202.035 31.0885 202.035 31.8807C202.035 32.6695 201.888 33.3589 201.593 33.9489C201.298 34.5388 200.884 34.9979 200.35 35.326C199.816 35.6541 199.192 35.8182 198.476 35.8182ZM198.481 34.5703C198.945 34.5703 199.329 34.4477 199.634 34.2024C199.939 33.9571 200.164 33.6307 200.31 33.223C200.459 32.8153 200.534 32.3662 200.534 31.8757C200.534 31.3885 200.459 30.9411 200.31 30.5334C200.164 30.1224 199.939 29.7926 199.634 29.544C199.329 29.2955 198.945 29.1712 198.481 29.1712C198.013 29.1712 197.626 29.2955 197.317 29.544C197.012 29.7926 196.785 30.1224 196.636 30.5334C196.49 30.9411 196.417 31.3885 196.417 31.8757C196.417 32.3662 196.49 32.8153 196.636 33.223C196.785 33.6307 197.012 33.9571 197.317 34.2024C197.626 34.4477 198.013 34.5703 198.481 34.5703ZM205.118 35.6641L202.871 28.0277H204.407L205.903 33.6357H205.978L207.479 28.0277H209.015L210.507 33.6108H210.581L212.068 28.0277H213.604L211.362 35.6641H209.846L208.295 30.1506H208.18L206.629 35.6641H205.118ZM220.737 29.892L219.39 30.1307C219.334 29.9583 219.244 29.7943 219.121 29.6385C219.002 29.4827 218.84 29.3551 218.634 29.2557C218.429 29.1562 218.172 29.1065 217.864 29.1065C217.443 29.1065 217.091 29.201 216.81 29.3899C216.528 29.5755 216.387 29.8158 216.387 30.1108C216.387 30.366 216.482 30.5715 216.67 30.7273C216.859 30.883 217.164 31.0107 217.585 31.1101L218.798 31.3885C219.501 31.5509 220.025 31.8011 220.369 32.1392C220.714 32.4773 220.886 32.9164 220.886 33.4567C220.886 33.9141 220.754 34.3217 220.489 34.6797C220.227 35.0343 219.861 35.3127 219.39 35.5149C218.923 35.7171 218.381 35.8182 217.764 35.8182C216.909 35.8182 216.211 35.6359 215.671 35.2713C215.131 34.9034 214.799 34.3814 214.677 33.7053L216.114 33.4865C216.203 33.861 216.387 34.1444 216.665 34.3366C216.944 34.5256 217.307 34.62 217.754 34.62C218.241 34.62 218.631 34.5189 218.923 34.3168C219.214 34.1113 219.36 33.861 219.36 33.5661C219.36 33.3274 219.271 33.1269 219.092 32.9645C218.916 32.8021 218.646 32.6795 218.281 32.5966L216.989 32.3132C216.276 32.1508 215.749 31.8923 215.408 31.5376C215.07 31.183 214.901 30.7339 214.901 30.1903C214.901 29.7396 215.027 29.3452 215.278 29.0071C215.53 28.669 215.878 28.4055 216.322 28.2166C216.767 28.0244 217.275 27.9283 217.849 27.9283C218.674 27.9283 219.324 28.1072 219.798 28.4652C220.272 28.8198 220.585 29.2955 220.737 29.892ZM225.812 35.8182C225.06 35.8182 224.412 35.6574 223.868 35.3359C223.328 35.0111 222.91 34.5554 222.615 33.9688C222.324 33.3788 222.178 32.6877 222.178 31.8956C222.178 31.1134 222.324 30.424 222.615 29.8274C222.91 29.2308 223.321 28.7652 223.848 28.4304C224.378 28.0956 224.998 27.9283 225.708 27.9283C226.138 27.9283 226.556 27.9995 226.96 28.142C227.365 28.2846 227.728 28.5083 228.049 28.8132C228.371 29.1181 228.624 29.5142 228.81 30.0014C228.995 30.4853 229.088 31.0736 229.088 31.7663V32.2933H223.018V31.1797H227.632C227.632 30.7886 227.552 30.4422 227.393 30.1406C227.234 29.8357 227.01 29.5954 226.722 29.4197C226.437 29.2441 226.102 29.1562 225.718 29.1562C225.3 29.1562 224.935 29.259 224.624 29.4645C224.316 29.6667 224.077 29.9318 223.908 30.2599C223.742 30.5848 223.659 30.9377 223.659 31.3189V32.1889C223.659 32.6993 223.749 33.1335 223.928 33.4915C224.11 33.8494 224.364 34.1229 224.688 34.3118C225.013 34.4974 225.393 34.5902 225.827 34.5902C226.109 34.5902 226.365 34.5504 226.597 34.4709C226.829 34.388 227.03 34.2654 227.199 34.103C227.368 33.9406 227.497 33.7401 227.587 33.5014L228.994 33.755C228.881 34.1693 228.679 34.5322 228.387 34.8438C228.099 35.152 227.736 35.3923 227.298 35.5646C226.864 35.7337 226.369 35.8182 225.812 35.8182ZM237.659 35.8182C236.943 35.8182 236.319 35.6541 235.785 35.326C235.251 34.9979 234.837 34.5388 234.542 33.9489C234.247 33.3589 234.1 32.6695 234.1 31.8807C234.1 31.0885 234.247 30.3958 234.542 29.8026C234.837 29.2093 235.251 28.7486 235.785 28.4205C236.319 28.0923 236.943 27.9283 237.659 27.9283C238.375 27.9283 239 28.0923 239.534 28.4205C240.067 28.7486 240.481 29.2093 240.776 29.8026C241.071 30.3958 241.219 31.0885 241.219 31.8807C241.219 32.6695 241.071 33.3589 240.776 33.9489C240.481 34.5388 240.067 34.9979 239.534 35.326C239 35.6541 238.375 35.8182 237.659 35.8182ZM237.664 34.5703C238.128 34.5703 238.513 34.4477 238.818 34.2024C239.123 33.9571 239.348 33.6307 239.494 33.223C239.643 32.8153 239.718 32.3662 239.718 31.8757C239.718 31.3885 239.643 30.9411 239.494 30.5334C239.348 30.1224 239.123 29.7926 238.818 29.544C238.513 29.2955 238.128 29.1712 237.664 29.1712C237.197 29.1712 236.809 29.2955 236.501 29.544C236.196 29.7926 235.969 30.1224 235.82 30.5334C235.674 30.9411 235.601 31.3885 235.601 31.8757C235.601 32.3662 235.674 32.8153 235.82 33.223C235.969 33.6307 236.196 33.9571 236.501 34.2024C236.809 34.4477 237.197 34.5703 237.664 34.5703ZM242.878 35.6641V28.0277H244.315V29.2408H244.395C244.534 28.8298 244.779 28.5066 245.13 28.2713C245.485 28.0327 245.886 27.9134 246.333 27.9134C246.426 27.9134 246.536 27.9167 246.662 27.9233C246.791 27.9299 246.892 27.9382 246.965 27.9482V29.37C246.905 29.3535 246.799 29.3352 246.647 29.3153C246.494 29.2921 246.342 29.2805 246.189 29.2805C245.838 29.2805 245.525 29.3551 245.25 29.5043C244.978 29.6501 244.762 29.8539 244.603 30.1158C244.444 30.3743 244.365 30.6693 244.365 31.0007V35.6641H242.878ZM258.623 25.4822H260.164V32.179C260.164 32.8916 259.997 33.523 259.662 34.0732C259.328 34.62 258.857 35.0509 258.25 35.3658C257.644 35.6773 256.933 35.8331 256.118 35.8331C255.306 35.8331 254.596 35.6773 253.99 35.3658C253.383 35.0509 252.913 34.62 252.578 34.0732C252.243 33.523 252.076 32.8916 252.076 32.179V25.4822H253.612V32.0547C253.612 32.5154 253.713 32.9247 253.915 33.2827C254.121 33.6406 254.411 33.9223 254.785 34.1278C255.16 34.33 255.604 34.4311 256.118 34.4311C256.635 34.4311 257.08 34.33 257.455 34.1278C257.833 33.9223 258.121 33.6406 258.32 33.2827C258.522 32.9247 258.623 32.5154 258.623 32.0547V25.4822ZM262.279 38.5277V28.0277H263.73V29.2656H263.855C263.941 29.1065 264.065 28.9226 264.227 28.7138C264.39 28.505 264.615 28.3227 264.904 28.1669C265.192 28.0078 265.573 27.9283 266.047 27.9283C266.664 27.9283 267.214 28.084 267.698 28.3956C268.182 28.7071 268.561 29.1562 268.836 29.7429C269.115 30.3295 269.254 31.0355 269.254 31.8608C269.254 32.6861 269.116 33.3937 268.841 33.9837C268.566 34.5703 268.188 35.0227 267.708 35.3409C267.227 35.6558 266.678 35.8132 266.062 35.8132C265.598 35.8132 265.218 35.7353 264.923 35.5795C264.632 35.4238 264.403 35.2415 264.237 35.0327C264.072 34.8239 263.944 34.6383 263.855 34.4759H263.765V38.5277H262.279ZM263.735 31.8459C263.735 32.3828 263.813 32.8535 263.969 33.2578C264.125 33.6622 264.35 33.9787 264.645 34.2074C264.94 34.4328 265.301 34.5455 265.729 34.5455C266.173 34.5455 266.544 34.4278 266.843 34.1925C267.141 33.9538 267.366 33.6307 267.519 33.223C267.674 32.8153 267.752 32.3563 267.752 31.8459C267.752 31.3421 267.676 30.8897 267.524 30.4886C267.374 30.0876 267.149 29.7711 266.847 29.5391C266.549 29.3071 266.176 29.1911 265.729 29.1911C265.298 29.1911 264.933 29.3021 264.635 29.5241C264.34 29.7462 264.116 30.0561 263.964 30.4538C263.811 30.8516 263.735 31.3156 263.735 31.8459ZM272.406 25.4822V35.6641H270.919V25.4822H272.406ZM277.622 35.8182C276.906 35.8182 276.281 35.6541 275.748 35.326C275.214 34.9979 274.8 34.5388 274.505 33.9489C274.21 33.3589 274.062 32.6695 274.062 31.8807C274.062 31.0885 274.21 30.3958 274.505 29.8026C274.8 29.2093 275.214 28.7486 275.748 28.4205C276.281 28.0923 276.906 27.9283 277.622 27.9283C278.338 27.9283 278.963 28.0923 279.496 28.4205C280.03 28.7486 280.444 29.2093 280.739 29.8026C281.034 30.3958 281.182 31.0885 281.182 31.8807C281.182 32.6695 281.034 33.3589 280.739 33.9489C280.444 34.5388 280.03 34.9979 279.496 35.326C278.963 35.6541 278.338 35.8182 277.622 35.8182ZM277.627 34.5703C278.091 34.5703 278.476 34.4477 278.781 34.2024C279.085 33.9571 279.311 33.6307 279.457 33.223C279.606 32.8153 279.68 32.3662 279.68 31.8757C279.68 31.3885 279.606 30.9411 279.457 30.5334C279.311 30.1224 279.085 29.7926 278.781 29.544C278.476 29.2955 278.091 29.1712 277.627 29.1712C277.16 29.1712 276.772 29.2955 276.464 29.544C276.159 29.7926 275.932 30.1224 275.783 30.5334C275.637 30.9411 275.564 31.3885 275.564 31.8757C275.564 32.3662 275.637 32.8153 275.783 33.223C275.932 33.6307 276.159 33.9571 276.464 34.2024C276.772 34.4477 277.16 34.5703 277.627 34.5703ZM285.063 35.8331C284.579 35.8331 284.142 35.7436 283.751 35.5646C283.36 35.3823 283.05 35.1188 282.821 34.7741C282.596 34.4295 282.483 34.0069 282.483 33.5064C282.483 33.0755 282.566 32.7209 282.732 32.4425C282.897 32.1641 283.121 31.9437 283.403 31.7812C283.685 31.6188 283.999 31.4962 284.347 31.4134C284.695 31.3305 285.05 31.2675 285.411 31.2244C285.869 31.1714 286.24 31.1283 286.525 31.0952C286.81 31.0587 287.017 31.0007 287.146 30.9212C287.276 30.8416 287.34 30.7124 287.34 30.5334V30.4986C287.34 30.0644 287.218 29.728 286.972 29.4893C286.731 29.2507 286.369 29.1314 285.889 29.1314C285.388 29.1314 284.994 29.2424 284.705 29.4645C284.42 29.6832 284.223 29.9268 284.114 30.1953L282.717 29.8771C282.883 29.4131 283.124 29.0386 283.443 28.7536C283.764 28.4652 284.134 28.2564 284.551 28.1271C284.969 27.9946 285.408 27.9283 285.869 27.9283C286.174 27.9283 286.497 27.9647 286.838 28.0376C287.183 28.1072 287.504 28.2365 287.803 28.4254C288.104 28.6143 288.351 28.8845 288.544 29.2358C288.736 29.5838 288.832 30.0362 288.832 30.593V35.6641H287.38V34.62H287.32C287.224 34.8123 287.08 35.0012 286.888 35.1868C286.696 35.3724 286.449 35.5265 286.147 35.6491C285.846 35.7718 285.484 35.8331 285.063 35.8331ZM285.387 34.6399C285.798 34.6399 286.149 34.5587 286.441 34.3963C286.735 34.2339 286.959 34.0218 287.112 33.7599C287.267 33.4948 287.345 33.2114 287.345 32.9098V31.9254C287.292 31.9785 287.19 32.0282 287.037 32.0746C286.888 32.1177 286.717 32.1558 286.525 32.1889C286.333 32.2187 286.146 32.2469 285.963 32.2734C285.781 32.2966 285.628 32.3165 285.506 32.3331C285.218 32.3696 284.954 32.4309 284.715 32.517C284.48 32.6032 284.291 32.7275 284.149 32.8899C284.009 33.049 283.94 33.2611 283.94 33.5263C283.94 33.8942 284.076 34.1726 284.347 34.3615C284.619 34.5471 284.966 34.6399 285.387 34.6399ZM293.67 35.8132C293.054 35.8132 292.504 35.6558 292.02 35.3409C291.539 35.0227 291.161 34.5703 290.886 33.9837C290.615 33.3937 290.479 32.6861 290.479 31.8608C290.479 31.0355 290.616 30.3295 290.891 29.7429C291.17 29.1562 291.551 28.7071 292.035 28.3956C292.519 28.084 293.067 27.9283 293.68 27.9283C294.154 27.9283 294.536 28.0078 294.824 28.1669C295.116 28.3227 295.341 28.505 295.5 28.7138C295.662 28.9226 295.788 29.1065 295.878 29.2656H295.967V25.4822H297.454V35.6641H296.002V34.4759H295.878C295.788 34.6383 295.659 34.8239 295.49 35.0327C295.324 35.2415 295.096 35.4238 294.804 35.5795C294.512 35.7353 294.134 35.8132 293.67 35.8132ZM293.999 34.5455C294.426 34.5455 294.787 34.4328 295.082 34.2074C295.381 33.9787 295.606 33.6622 295.759 33.2578C295.914 32.8535 295.992 32.3828 295.992 31.8459C295.992 31.3156 295.916 30.8516 295.763 30.4538C295.611 30.0561 295.387 29.7462 295.092 29.5241C294.797 29.3021 294.433 29.1911 293.999 29.1911C293.551 29.1911 293.178 29.3071 292.88 29.5391C292.582 29.7711 292.356 30.0876 292.204 30.4886C292.055 30.8897 291.98 31.3421 291.98 31.8459C291.98 32.3563 292.056 32.8153 292.209 33.223C292.361 33.6307 292.587 33.9538 292.885 34.1925C293.187 34.4278 293.558 34.5455 293.999 34.5455ZM303.4 35.6641V25.4822H309.714V26.8047H304.936V29.907H309.261V31.2244H304.936V35.6641H303.4ZM311.484 35.6641V28.0277H312.97V35.6641H311.484ZM312.234 26.8494C311.976 26.8494 311.754 26.7633 311.568 26.5909C311.386 26.4152 311.295 26.2064 311.295 25.9645C311.295 25.7192 311.386 25.5104 311.568 25.3381C311.754 25.1624 311.976 25.0746 312.234 25.0746C312.493 25.0746 312.713 25.1624 312.896 25.3381C313.081 25.5104 313.174 25.7192 313.174 25.9645C313.174 26.2064 313.081 26.4152 312.896 26.5909C312.713 26.7633 312.493 26.8494 312.234 26.8494ZM316.456 25.4822V35.6641H314.97V25.4822H316.456ZM321.748 35.8182C320.995 35.8182 320.347 35.6574 319.804 35.3359C319.263 35.0111 318.846 34.5554 318.551 33.9688C318.259 33.3788 318.113 32.6877 318.113 31.8956C318.113 31.1134 318.259 30.424 318.551 29.8274C318.846 29.2308 319.257 28.7652 319.784 28.4304C320.314 28.0956 320.934 27.9283 321.643 27.9283C322.074 27.9283 322.492 27.9995 322.896 28.142C323.3 28.2846 323.663 28.5083 323.985 28.8132C324.306 29.1181 324.56 29.5142 324.745 30.0014C324.931 30.4853 325.024 31.0736 325.024 31.7663V32.2933H318.953V31.1797H323.567C323.567 30.7886 323.488 30.4422 323.328 30.1406C323.169 29.8357 322.946 29.5954 322.657 29.4197C322.372 29.2441 322.038 29.1562 321.653 29.1562C321.235 29.1562 320.871 29.259 320.559 29.4645C320.251 29.6667 320.012 29.9318 319.843 30.2599C319.678 30.5848 319.595 30.9377 319.595 31.3189V32.1889C319.595 32.6993 319.684 33.1335 319.863 33.4915C320.046 33.8494 320.299 34.1229 320.624 34.3118C320.949 34.4974 321.328 34.5902 321.762 34.5902C322.044 34.5902 322.301 34.5504 322.533 34.4709C322.765 34.388 322.966 34.2654 323.135 34.103C323.304 33.9406 323.433 33.7401 323.522 33.5014L324.929 33.755C324.817 34.1693 324.614 34.5322 324.323 34.8438C324.034 35.152 323.672 35.3923 323.234 35.5646C322.8 35.7337 322.304 35.8182 321.748 35.8182Z" fill="#465362"/>
            </svg>
        `;
  }
}

//get parameter value
function getParameters() {
  let parameters = "";
  const predefined = document.getElementById("predefined");
  const own = document.getElementById("own");
  const file = document.getElementById("file");
  if (predefined.checked) {
    const pre1 = document.getElementById("pre1");
    const pre2 = document.getElementById("pre2");
    const pre3 = document.getElementById("pre3");
    if (pre1.checked)
      parameters = "Duplicates";
    else if (pre2.checked)
      parameters = "Efficiency";
    else
      parameters = "Accuracy";
  }
  else if (own.checked) {
    parameters = document.getElementById("ownParameters").value;
  }
  else if(file.checked)
    parameters = document.getElementById("file-upload").value;

  return parameters;
}

//unlock publish button if date given
function checkDate() {
  if (document.getElementById("date-time").value != "")
    document.getElementById("publishButton").disabled = false;
  else
  document.getElementById("publishButton").disabled=true;
}

setInterval(checkDate, 500);

//publish the assignment
async function formSubmission(e) {
  e.preventDefault()
  let newUrl = new URL(window.location.href);
  let institute_id = newUrl.searchParams.get('institute_id');
  const teacher_id = newUrl.searchParams.get('teacher_id');
  let title = "", description = "", problem_statement = "", difficulty = "";

  if (easyProblem.selected) {
    title = easyProblem.title;
    description = easyProblem.description;
    problem_statement = easyProblem.codingProblem;
    difficulty = "Easy";
  }
  else if (mediumProblem.selected) {
    title = mediumProblem.title;
    description = mediumProblem.description;
    problem_statement = mediumProblem.codingProblem;
    difficulty = "Medium";
  }
  else {
    title = hardProblem.title;
    description = hardProblem.description;
    problem_statement = hardProblem.codingProblem;
    difficulty = "Hard";
  }

    const dateString = document.getElementById("date-time").value;

// Parse the date string into a JavaScript Date object
    const date = new Date(dateString);

// Convert the Date object to a Unix timestamp (in seconds)
    const due_date = Math.floor(date.getTime() / 1000);

  let parameters = getParameters();

    console.log(JSON.stringify({
      teacher_id,
      title,
      description,
      problem_statement,
      due_date,
      difficulty,
      attachment:"",
      sample_input:"",
      sample_output:"",
      parameters
    }));

  try {
    document.getElementById("loader").style.display = "flex";
     const data =  await fetch(`https://backend.edu.codemate.ai/add_task/?teacher_id=${teacher_id}&institute_id=${institute_id}`, { // Modify the endpoint as needed
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          teacher_id,
          title,
          description,
          problem_statement,
          due_date,
          difficulty,
          attachment:"",
          sample_input:"",
          sample_output:"",
          parameters
        }),
      })
     const response = await data.json()

     let newUrl = new URL(window.location.href);
     newUrl.searchParams.set('assignment_id',await response.task_id);
      newUrl.searchParams.set('app', "dash");//initially it was publish instead of dash but again option of making it public 
      //was there which was kinda confusing
      history.pushState({}, '', newUrl)
      window.location.reload();
      document.getElementById("dashboard").click();//for being on the safe side
      var notyf = new Notyf();
      document.getElementById("loader").style.display = "none";
     notyf.success("Assignment has been published successfully.")
  } catch (error) {
    document.getElementById("loader").style.display = "none";
      console.log(error)
      var notyf = new Notyf();
      notyf.error(error)
    }
}
