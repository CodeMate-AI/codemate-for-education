document.getElementById("assignments-btn").addEventListener("click", function () {
    document.getElementById("assignments-modal").style.display = "block";
  });
  
  // Close the modal when the close button or outside the modal is clicked
  document.querySelectorAll(".close, .modal").forEach(function (element) {
    element.addEventListener("click", function () {
      document.getElementById("assignments-modal").style.display = "none";
    });
  });
  
  // Prevent modal from closing when modal content is clicked
  document.querySelector(".modal-content").addEventListener("click", function (event) {
    event.stopPropagation();
  });

  function viewStatement() {
    const button = document.getElementById("view-assignment")
    if(button) {
        button.addEventListener("click" , (event) => {
            event.preventDefault()
            let newUrl = new URL(window.location.href);
            newUrl.searchParams.set('app', "view");
            history.pushState({}, '', newUrl)
            window.location.reload()
        })
    }
  }

  viewStatement()

  function goBack() {
    const button = document.getElementById("back_button")
    if(button) {
        button.addEventListener("click" , (event) => {
            event.preventDefault()
            history.back();
            window.location.reload();
        })
    }
 
  }

  goBack()