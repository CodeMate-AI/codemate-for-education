assign_teachers = {
    "pending": `     
    <div id="container-inside">
    <div class="content">
    <p class="title">{{assignments.pending.title}}</p>
    <p class="description">{{assignments.pending.description}}</p>
    <div class="date-diff date-wali-div">
    <p class="date">Due Date : <span>{{assignments.pending.due_date}}</span></p>
    <p class="difficulty">Difficulty : <span>{{assignments.pending.difficulty}}</span></p>
    </div>
    </div>
    <div class="date-diff">
    <p class="date class_____"><span class="stats___">{{assignments.pending.submissions}}</span>Submissions</p>
    <p class="difficulty class_____"><span class="stats___">{{assignments.pending.yet}}</span><span style=""font-size: 10px;
    font-weight: 400;
    padding-bottom: 7px;>Yet To Submit</span></p>
    </div>
    <div class="bton">
    <div class="btn-inside">
    <button class="nav_elm" nav="submissions" assignment_id={{assignment_id}}>View Submissions</button>
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
    
                // Get the current URL
                const currentUrl = new URL(window.location.href);
    
                // Set or update the 'app' parameter to 'submissions'
                currentUrl.searchParams.set('app', 'submissions');
    
                // Also set the 'aid' parameter to the current assignment ID
                currentUrl.searchParams.set('aid', assignmentId);
    
                // Push the updated URL with existing parameters to the history
                history.pushState({}, '', currentUrl.toString());
    
                // Optionally reload the page
                window.location.reload();
            });
        });
    }
    
    clickHandler(); // Call the function to initialize the event listeners
    

clickHandler()

    