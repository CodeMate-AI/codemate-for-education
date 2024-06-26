function checking() {
  // Get all input and textarea elements
  const inputFields = document.querySelectorAll('.compulsory');

  // Get reference to the button
  const publishButton = document.querySelector('.publish_button');

  // Function to check if all fields are filled
  function areAllFieldsFilled() {
    return Array.from(inputFields).every(field => field.value.trim() !== '');
  }

  // Function to update button background color
  function updateButtonColor() {
    // If all fields have content, change button background color to blue, otherwise revert to default
    if (publishButton) {
      publishButton.style.backgroundColor = areAllFieldsFilled() ? '#48AEF3' : '';
      publishButton.disabled = !areAllFieldsFilled(); // Enable or disable the button
      // publishButton.addEventListener("click", () => {

      // })
    }
  }

  // Add event listener to each input field and textarea
  inputFields.forEach(field => {
    field.addEventListener('input', updateButtonColor);
  });

  // Call the function initially to set the button color
  updateButtonColor();
}

checking()
setInterval(checking, 1000);

// Open the modal when the assignments button is clicked


// Handle manual button click
document.getElementById("manual-btn").addEventListener("click", function () {
  console.log("Manual option clicked");
  let newUrl = new URL(window.location.href);
  newUrl.searchParams.set('app', env.active_page);
  newUrl.searchParams.set('mode', "manual");
  history.pushState({}, '', newUrl)
  const closeButton = document.querySelector('.close');
  if (closeButton) {
    closeButton.click();
  }
});

// Handle AI generated button click
document.getElementById("ai-generated-btn").addEventListener("click", function () {
  let newUrl = new URL(window.location.href);
  newUrl.searchParams.set('app', env.active_page);
  newUrl.searchParams.set('mode', "ai");
  history.pushState({}, '', newUrl)
  const closeButton = document.querySelector('.close');
  if (closeButton) {
    closeButton.click();
  }
});


//   function clickHandler() {
//     let button = document.getElementById("create-publish")

//    if(button) {
//     button.addEventListener('click', function(event) {
//         event.preventDefault()
//         // Get the assignment ID from the button attribute
//         // let assignmentId = this.getAttribute('assignment_id');

//         // Update the URL to include the assignment ID
//         history.pushState({}, '', `?app=choose`);
//         window.location.reload()
//     });
//    }
// }

// clickHandler()


function docsUploadHandler() {
  document.getElementById("file-upload").addEventListener("change", function () {
    const file = this.files[0];  // Get the uploaded file
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
          <svg width="49" height="48" viewBox="0 0 49 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M4.5 24C4.5 14.5719 4.5 9.85786 7.42894 6.92894C10.3579 4 15.0719 4 24.5 4C33.928 4 38.6422 4 41.571 6.92894C44.5 9.85786 44.5 14.5719 44.5 24C44.5 33.428 44.5 38.1422 41.571 41.071C38.6422 44 33.928 44 24.5 44C15.0719 44 10.3579 44 7.42894 41.071C4.5 38.1422 4.5 33.428 4.5 24ZM24.5 35.5C25.3284 35.5 26 34.8284 26 34V23.6214L29.4394 27.0606C30.0252 27.6464 30.9748 27.6464 31.5606 27.0606C32.1464 26.4748 32.1464 25.5252 31.5606 24.9394L25.5606 18.9393C25.2794 18.658 24.8978 18.5 24.5 18.5C24.1022 18.5 23.7206 18.658 23.4394 18.9393L17.4393 24.9394C16.8536 25.5252 16.8536 26.4748 17.4393 27.0606C18.0251 27.6464 18.9749 27.6464 19.5607 27.0606L23 23.6214V34C23 34.8284 23.6716 35.5 24.5 35.5ZM16.5 15.5C15.6716 15.5 15 14.8284 15 14C15 13.1716 15.6716 12.5 16.5 12.5H32.5C33.3284 12.5 34 13.1716 34 14C34 14.8284 33.3284 15.5 32.5 15.5H16.5Z" fill="#48AEF3"/>
        </svg>  
            <span>Browse or Upload File</span>`;
      })
    } else {
      // If no file is selected, revert back to original content
      label.innerHTML = `
            <svg width="49" height="48" viewBox="0 0 49 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M4.5 24C4.5 14.5719 4.5 9.85786 7.42894 6.92894C10.3579 4 15.0719 4 24.5 4C33.928 4 38.6422 4 41.571 6.92894C44.5 9.85786 44.5 14.5719 44.5 24C44.5 33.428 44.5 38.1422 41.571 41.071C38.6422 44 33.928 44 24.5 44C15.0719 44 10.3579 44 7.42894 41.071C4.5 38.1422 4.5 33.428 4.5 24ZM24.5 35.5C25.3284 35.5 26 34.8284 26 34V23.6214L29.4394 27.0606C30.0252 27.6464 30.9748 27.6464 31.5606 27.0606C32.1464 26.4748 32.1464 25.5252 31.5606 24.9394L25.5606 18.9393C25.2794 18.658 24.8978 18.5 24.5 18.5C24.1022 18.5 23.7206 18.658 23.4394 18.9393L17.4393 24.9394C16.8536 25.5252 16.8536 26.4748 17.4393 27.0606C18.0251 27.6464 18.9749 27.6464 19.5607 27.0606L23 23.6214V34C23 34.8284 23.6716 35.5 24.5 35.5ZM16.5 15.5C15.6716 15.5 15 14.8284 15 14C15 13.1716 15.6716 12.5 H32.5"/>
            </svg>
            <span>Browse or Upload File</span>
          `;
    }
  });
}

docsUploadHandler()


//same double running in production issue , make it as onsubmit in inline
async function formSubmission(e) {
  e.preventDefault()
  let newUrl = new URL(window.location.href);
  let institute_id = newUrl.searchParams.get('institute_id');
  const teacher_id = newUrl.searchParams.get('teacher_id');
  // const form = document.getElementById("create-form")

  // form.addEventListener("submit", async (e) => {
    const title = document.getElementById("title").value
    const description = document.getElementById("description").value
    const problem_statement = document.getElementById("problem").value
    const dateString = document.getElementById("date-time").value;

// Parse the date string into a JavaScript Date object
    const date = new Date(dateString);

// Convert the Date object to a Unix timestamp (in seconds)
    const due_date = Math.floor(date.getTime() / 1000);
    const difficulty = document.getElementById("difficulty-input").value
    let attachment = document.getElementById("file-upload").value
    const sample_input = document.getElementById("input").value
    const sample_output = document.getElementById("output").value
    // const id = String(Math.floor(Math.random() * 1000) + 1); // Random integer from 1 to 100
    let parameters = document.getElementById("parameters").value
    console.log(JSON.stringify({
      teacher_id,
      title,
      description,
      problem_statement,
      due_date,
      difficulty,
      attachment,
      sample_input,
      sample_output,
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
          attachment,
          sample_input,
          sample_output,
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

// formSubmission()

