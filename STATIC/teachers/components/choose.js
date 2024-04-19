function checking() {
    // Get all input and textarea elements
    const inputFields = document.querySelectorAll('input');

    // Get reference to the button
    const publishButton = document.querySelector('.publish_button');

    // Add event listener to each input field and textarea
    inputFields.forEach(field => {
        field.addEventListener('input', () => {
            // Check if all fields have content
            const allFieldsFilled = Array.from(inputFields).every(field => field.value.trim() !== '');

            // If all fields have content, change button background color to blue, otherwise revert to default
            publishButton.style.backgroundColor = allFieldsFilled ? '#48AEF3' : '';
        });
    });
}

// Call the function to initialize event listener

setInterval(checking, 20000);



function clickHandler() {
    let buttons = document.getElementById("choose-publish")

   if(buttons) {
    buttons.addEventListener('click', function(event) {
        event.preventDefault()
        // Get the assignment ID from the button attribute
        // let assignmentId = this.getAttribute('assignment_id');

        // Update the URL to include the assignment ID
        history.pushState({}, '', `?app=publish`);
        window.location.reload()
    });
   }
}

clickHandler()