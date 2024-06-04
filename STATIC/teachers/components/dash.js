// dash_elm_teachers = {
//     "pending": `
//     <div id="container-inside">
//     <img width="50" height="50" src="https://img.icons8.com/cute-clipart/64/book.png" alt="book"/>
//     <div class="content !w-[200px]">
//     <p class="title  !mb-1">{{assignments.pending.title}}</p>
//     <p class="description">{{assignments.pending.description}}</p>
//     <div class="flex flex-wrap gap-x-2">
//     <div class="date flex font-semibold text-sm text-gray-900">Due Date: <span class="text-green-700">12.09.2024</span></div>
//     <div class="difficult flex font-semibold text-sm text-gray-900">Difficulty: <span class="text-green-700">Easy</span></div>
//     </div>
//     </div>
//     <div class="date-diff">
//     <p class="date class_____"><span class="stats___">{{assignments.pending.submissions}}</span>Submissions</p>
//     <p class="difficulty class_____"><span class="stats___">{{assignments.pending.yet}}</span><span style=""font-size: 10px;
//     font-weight: 400;
//     padding-bottom: 7px;>Yet To Submit</span></p>
//     </div>
//     <div class="bton">
//     <div class="btn-inside">
//     <button assignment_id={{assignment_id}}>View</button>
//     </div>
//     </div>
//     </div>
//     `
// };
    
dash_elm_teachers = {
    "pending": `     
    <div id="container-inside">
    <img class="hidden md:block" width="50" height="50" src="https://img.icons8.com/cute-clipart/64/book.png" alt="book"/>
    <div class="flex flex-wrap w-full justify-center sm:justify-between items-center gap-y-4">
        <div class="content gap-y-2 md:!w-full lg:!w-[400px]">
            <p class="title text-lg">{{assignments.pending.title}} </p>
            <p class="description text-base text-[#7c858f]">{{assignments.pending.description}}</p>
            <div class="flex flex-wrap gap-x-4 text-lg">
            <div class="date flex font-semibold text-sm text-gray-900  items-center justify-center">Due Date : <span class="ml-1 text-[#69bab0]">12.09.2024</span></div>
            <div class="difficult flex font-semibold text-sm text-gray-900  items-center justify-center">Difficulty : <span class="ml-1 text-[#69bab0]">Easy</span></div>
            </div>
            </div>
            <div class="flex flex-col text-lg gap-y-4">
                <div class="flex p-2 border-[#7c858f] border rounded-lg justify-evenly w-[280px] sm:w-[300px] items-center">
                    <span class="text-[#4a5766] text-base">Submissions</span>
                    <span class="font-semibold">{{assignments.pending.submissions}}</span>
                    <span assignment_id={{assignment_id}} class="text-[#5bb7f5] bg-white font-semibold">View</span>
                </div>
                <div class="flex p-2 border-[#7c758f] border rounded-lg justify-evenly w-[280px] sm:w-[300px] items-center">
                    <span class="text-[#4a5766] text-base"> Yet To Submit</span>
                    <span class="font-semibold">{{assignments.pending.yet}}</span>
                    <span class="text-[#5bb7f5] font-semibold">Notify</span>
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
    
    clickHandler()


    // function viewStatement() {
    //     const button = document.getElementsByClassName("content")
    //     if(button) {
    //         button.addEventListener("click" , (event) => {
    //             event.preventDefault()
    //             let newUrl = new URL(window.location.href);
    //             newUrl.searchParams.set('app', "view");
    //             history.pushState({}, '', newUrl)
    //             window.location.reload()
    //         })
    //     }
    //   }
    
    //   viewStatement()