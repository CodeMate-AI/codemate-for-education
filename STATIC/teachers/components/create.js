function checking() {
    // Get all input and textarea elements
    const inputFields = document.querySelectorAll('input[type="text"], input[type="radio"], textarea');
    console.log(inputFields);
    // Get reference to the button
    const publishButton = document.querySelector('.publish_button');

    // Function to check if all fields are filled
    function areAllFieldsFilled() {
        return Array.from(inputFields).every(field => field.value.trim() !== '');
    }

    // Function to update button background color
    function updateButtonColor() {
        // If all fields have content, change button background color to blue, otherwise revert to default
     if(publishButton) {
        publishButton.style.backgroundColor = areAllFieldsFilled() ? '#48AEF3' : '';
        publishButton.addEventListener("click", () => {

        })
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
    document.getElementById("assignments-btn").addEventListener("click", function() {
        document.getElementById("assignments-modal").style.display = "block";
      });
    
      // Close the modal when the close button or outside the modal is clicked
      document.querySelectorAll(".close, .modal").forEach(function(element) {
        element.addEventListener("click", function() {
          document.getElementById("assignments-modal").style.display = "none";
        });
      });
    
      // Prevent modal from closing when modal content is clicked
      document.querySelector(".modal-content").addEventListener("click", function(event) {
        event.stopPropagation();
      });
    
      // Handle manual button click
      document.getElementById("manual-btn").addEventListener("click", function() {
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
      document.getElementById("ai-generated-btn").addEventListener("click", function() {
        let newUrl = new URL(window.location.href);
        newUrl.searchParams.set('app', env.active_page);
        newUrl.searchParams.set('mode', "ai");
        history.pushState({}, '', newUrl)
        const closeButton = document.querySelector('.close');
  if (closeButton) {
  closeButton.click();
  }
      });


      function clickHandler() {
        let button = document.getElementById("create-publish")
    
       if(button) {
        button.addEventListener('click', function(event) {
            event.preventDefault()
            // Get the assignment ID from the button attribute
            // let assignmentId = this.getAttribute('assignment_id');
    
            // Update the URL to include the assignment ID
            history.pushState({}, '', `?app=choose`);
            window.location.reload()
        });
       }
    }
    
    clickHandler()