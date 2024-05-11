function fillContainerWithDivs(containerId) {
    const container = document.getElementById(containerId);

    // Calculate the number of rows and columns needed
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const divSize = 15; // Size of each small div
    const spacing = 7; // Spacing between each div
    const numRows = Math.floor(containerHeight / (divSize + spacing));
    const numCols = Math.floor(containerWidth / (divSize + spacing));

    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of the day

    // Loop to create and append small divs
    for (let i = numRows - 1; i >= 0; i--) {
        for (let j = numCols - 1; j >= 0; j--) {
            const parentDiv = document.createElement('div');

            // Create inner div for actual square
            const div = document.createElement('div');
            div.className = 'strk_presenter_elm';
            div.style.width = divSize + 'px';
            div.style.height = divSize + 'px';
            div.style.position = 'absolute';
            div.classList.add("tooltip");

            // Calculate date for this div (latest date in the bottom-right corner)
            const date = new Date(today);
            date.setDate(today.getDate() - (i * numCols + j));
            const formattedDate = formatDate(date);
            div.style.backgroundColor = getRandomColor(formattedDate); // Function to get a random color

            // Set custom attribute and tooltip content
            div.setAttribute('date', formattedDate);
            div.setAttribute('data-tip', formattedDate);

            // Calculate positioning (reverse order)
            const topPosition = (numRows - 1 - i) * (divSize + spacing);
            const leftPosition = (numCols - 1 - j) * (divSize + spacing);
            div.style.top = topPosition + 'px';
            div.style.left = leftPosition + 'px';

            // Determine tooltip classes based on position
            if (leftPosition === 0) {
                div.classList.add('tooltip-right'); // At the left edge
            }
            if (leftPosition === (numCols - 1) * (divSize + spacing)) {
                div.classList.add('tooltip-left'); // At the right edge
            }
            if (topPosition === 0) {
                div.classList.add('tooltip-bottom'); // At the top edge
            }
            if (topPosition === (numRows - 1) * (divSize + spacing)) {
                div.classList.add('tooltip-top'); // At the bottom edge
            }

            // Append inner div to parent div
            parentDiv.appendChild(div);
            container.appendChild(parentDiv);
        }
    }
}

// Function to generate a random color based on date
function getRandomColor(date) {
    const color_NO = "rgb(227 227 227)";
    const color_YES = "#2FCACE";

    // Assuming env.scripts.data.dash.submissions is an array of dates in YYYY-MM-DD format
    if (env.scripts.data.dash.submitted.includes(date)) {
        return color_YES;
    } else {
        return color_NO;
    }
}

// Function to format date as YYYY-MM-DD
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}




dash_elms = {
    "submitted_assignment": `<div class='sa__'>
                        <div class="sa_ds">
                            <span>{{sa.title}}</span>
                            <div class="desc_task">{{sa.task}}</div>
                        </div>
                        <div class="sa_an">{{sa.stat}}</div>
                        <div class="sa_cl">
                            <div class="sa_rept tooltip" data-tip="View Report" submission_id="{{sa.submission_id}} assignment_id="{{sa.assignment_id}}">
                                <i class="ph-fill ph-cloud-arrow-down {{sa.donwload.report}}"></i>
                            </div>
                            <div class="sa_view-sa tooltip" data-tip="View Submission">
                                <i class="ph ph-info"></i>
                            </div>
                        </div>
                    </div>`,

    "submitted_assignment_stats": {
        "pending": `<div class="sa_stat_pending">
                        <i class="ph-fill ph-clock"></i>
                        <span>Yet To Evaluate</span>
                    </div>`,

        "success": `<div class="sa_stat_success">
                        <div class="success_acc__"></div>
                        <div class="success_eff__"></div>
                        <div class="success_scr__"></div>
                    </div>`
    }
}