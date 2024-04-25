
 

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
            window.location.reload();
            history.back();
        })
    }
 
  }

  goBack()

  function Share() {
    const whatsapp = document.getElementById("share-whatsapp")
    const copy = document.getElementById("copy")
    if(whatsapp) {
// Add a click event listener to the button
      whatsapp.addEventListener('click', () => {
 // Define the content you want to share
      const shareText = document.getElementById("assignment_link").innerText;
     
// Create the WhatsApp share URL
      const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(shareText)}`;
// Open WhatsApp with the share URL
      window.location.href = whatsappUrl;
});
    }

    if(copy) {
      navigator.clipboard.writeText(document.getElementById("assignment_link").innerText)
    }
  }

  Share()

 