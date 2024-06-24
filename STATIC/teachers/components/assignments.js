assign_teachers = {
    "pending": `     
    <div id="container-inside">
    <img class="hidden md:block" width="50" height="50" src="https://img.icons8.com/cute-clipart/64/book.png" alt="book"/>
    <div class="flex flex-wrap w-full justify-center sm:justify-between items-center gap-y-4">
        <div class="content gap-y-2 md:!w-full lg:!w-[400px]">
            <p class="title text-lg">{{assignments.pending.title}} </p>
            <p class="description text-base text-[#7c858f]">{{assignments.pending.description}}</p>
            <div class="flex flex-wrap gap-x-4 text-lg">
            <div class="date flex font-semibold text-sm text-gray-900  items-center justify-center">Due Date : <span class="ml-1 text-[#69bab0]">{{assignments.pending.due_date}}</span></div>
            <div class="difficult flex font-semibold text-sm text-gray-900  items-center justify-center">Difficulty : <span class="ml-1 text-[#69bab0]">{{assignments.pending.difficulty}}</span></div>
            </div>
            </div>
            <div class="flex flex-col text-lg gap-y-4">
                <div class="flex p-2 border-[#7c858f] border rounded-lg justify-evenly w-[280px] sm:w-[300px] items-center">
                    <span class="text-[#4a5766] text-base">Submissions</span>
                    <span class="font-semibold">{{assignments.pending.submissions}}</span>
                    <div class="bton w-fit">
                    <div class="btn-inside w-fit">
                    <button  nav="submissions" assignment_id={{assignment_id}} class="nav_elm !py-2 !h-fit font-semibold !px-6">View</button>
                    </div>
                    </div>
                </div>
                <div class="flex p-2 border-[#7c758f] border rounded-lg justify-evenly w-[280px] sm:w-[300px] items-center">
                    <span class="text-[#4a5766] text-base"> Yet To Submit</span>
                    <span class="font-semibold">{{assignments.pending.yet}}</span>
                    <button class="font-semibold !px-5 !py-2">Notify</button>
                </div>
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

    