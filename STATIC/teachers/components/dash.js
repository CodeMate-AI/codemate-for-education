dash_elm_teachers = {
    "pending": `     
    <div id="container-inside">
    <div class="content">
    <p class="title">{{assignments.pending.title}}</p>
    <p class="description">{{assignments.pending.description}}</p>
    </div>
    <div class="date-diff">
    <p class="date class_____"><span class="stats___">{{assignments.pending.submissions}}</span>Submissions</p>
    <p class="difficulty class_____"><span class="stats___">{{assignments.pending.yet}}</span><span style=""font-size: 10px;
    font-weight: 400;
    padding-bottom: 7px;>Yet To Submit</span></p>
    </div>
    <div class="bton">
    <div class="btn-inside">
    <button assignment_id={{assignment_id}}>View</button>
    </div>
    </div>
    </div>
    `
    };

    function clickHandler() {
        let buttons = document.querySelectorAll('button[assignment_id]');
    
    // Iterate over each button and attach click event listener
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // Get the assignment ID from the button attribute
            let assignmentId = this.getAttribute('assignment_id');
    
            // Update the URL to include the assignment ID
            history.pushState({}, '', `?app=submissions&aid=${assignmentId}`);
            window.location.reload()
        });
    });
    }
    
    clickHandler()
