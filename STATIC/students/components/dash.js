function fillContainerWithDivs(containerId) {
    if (!document.getElementById(containerId))
        return;  
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



//sa_view-sa tooltip wali div is made hidden since it cant be commented yet has no functionality
dash_elms = {
    "submitted_assignment": `<div class='sa__ !sm:h-[146px] flex-wrap justify-center sm:!justify-between'>
                        <div class="sa_ds w-full lg:w-[470px] mb-3 lg:mb-0">
                            <span class="line-clamp-1">{{sa.title}}</span>
                            <div class="desc_task">{{sa.task}}</div>
                        </div>
                                <div class="progress flex justify-between w-[246px] h-[98px] mb-6 sm:mb-0">
            <div class="accuracy flex flex-col h-full">
                <div class="relative w-[60px] h-[60px]">
                    <svg class="w-full h-full" viewBox="0 0 100 100">
                      <!-- Background circle -->
                      <circle
                        class="text-gray-200 stroke-current"
                        stroke-width="10"
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                      ></circle>
                      <!-- Progress circle -->
                      <circle
                        class="text-[#2A9D8F]  progress-ring__circle stroke-current"
                        stroke-width="10"
                        stroke-linecap="round"
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke-dasharray="251.2" 
                        stroke-dashoffset="calc(251.2px - (251.2px * {{sa.accuracy}}) / 100)"
                      ></circle>
                      
                      <!-- Center text -->
                      <text x="50" y="50" font-family="Verdana" font-size="22" fill="#2A9D8F" text-anchor="middle" font-weight="600" alignment-baseline="middle">{{sa.accuracy}}</text>
                  
                    </svg>
                  </div>
                  <span class="text-[#465362] text-center text-base">Accuracy</span>
            </div>
            <div class="efficiency flex flex-col h-full">
                <div class="relative w-[60px] h-[60px]">
                    <svg class="w-full h-full" viewBox="0 0 100 100">
                      <!-- Background circle -->
                      <circle
                        class="text-gray-200 stroke-current"
                        stroke-width="10"
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                      ></circle>
                      <!-- Progress circle -->
                      <circle
                        class="text-[#2A9D8F]  progress-ring__circle stroke-current"
                        stroke-width="10"
                        stroke-linecap="round"
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke-dasharray="251.2" 
                        stroke-dashoffset="calc(251.2px - (251.2px * {{sa.efficiency}}) / 100)"
                      ></circle>
                      
                      <!-- Center text -->
                      <text x="50" y="50" font-family="Verdana" font-size="22" fill="#2A9D8F" text-anchor="middle" font-weight="600" alignment-baseline="middle">{{sa.efficiency}}</text>
                  
                    </svg>
                  </div>
                  <span class="text-[#465362] text-center text-base">Efficiency</span>
            </div>
            <div class="score flex flex-col h-full">
                <div class="relative w-[60px] h-[60px]">
                    <svg class="w-full h-full" viewBox="0 0 100 100">
                      <!-- Background circle -->
                      <circle
                        class="text-gray-200 stroke-current"
                        stroke-width="10"
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                      ></circle>
                      <!-- Progress circle -->
                      <circle
                        class="text-[#2A9D8F]  progress-ring__circle stroke-current"
                        stroke-width="10"
                        stroke-linecap="round"
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke-dasharray="251.2" 
                        stroke-dashoffset="calc(251.2px - (251.2px * {{sa.score}}) / 100)"
                      ></circle>
                      
                      <!-- Center text -->
                      <text x="50" y="50" font-family="Verdana" font-size="22" fill="#2A9D8F" text-anchor="middle" font-weight="600" alignment-baseline="middle">{{sa.score}}</text>
                  
                    </svg>
                  </div>
                  <span class="text-[#465362] text-center text-base">Score</span>
            </div>
        </div>
                        <!--<div class="sa_an">{{sa.stat}}</div>-->
                        <div class="sa_cl">
                            <div class="sa_rept tooltip" data-tip="View Report" submission_id="{{sa.submission_id}}" assignment_id="{{sa.assignment_id}}">
                               <svg class="cursor-pointer {{sa.donwload.report}}" width="82" height="80" viewBox="0 0 82 80" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M19.8931 75V64.8182H23.3335C24.1289 64.8182 24.7818 64.9541 25.2923 65.2259C25.8027 65.4943 26.1805 65.8639 26.4258 66.3345C26.671 66.8052 26.7937 67.3404 26.7937 67.9403C26.7937 68.5402 26.671 69.0722 26.4258 69.5362C26.1805 70.0002 25.8043 70.3648 25.2972 70.63C24.7901 70.8918 24.1422 71.0227 23.3533 71.0227H20.5692V69.9091H23.3136C23.8571 69.9091 24.2946 69.8295 24.6261 69.6705C24.9608 69.5114 25.2028 69.286 25.3519 68.9943C25.5044 68.6993 25.5806 68.348 25.5806 67.9403C25.5806 67.5327 25.5044 67.1764 25.3519 66.8714C25.1995 66.5665 24.9558 66.3312 24.6211 66.1655C24.2863 65.9964 23.8439 65.9119 23.2937 65.9119H21.1261V75H19.8931ZM24.6857 70.4261L27.1914 75H25.7596L23.2937 70.4261H24.6857ZM31.8088 75.1591C31.073 75.1591 30.4383 74.9967 29.9047 74.6719C29.3743 74.3438 28.965 73.8864 28.6767 73.2997C28.3916 72.7098 28.2491 72.0237 28.2491 71.2415C28.2491 70.4593 28.3916 69.7699 28.6767 69.1733C28.965 68.5734 29.3661 68.1061 29.8798 67.7713C30.3968 67.4332 31.0001 67.2642 31.6895 67.2642C32.0872 67.2642 32.4799 67.3305 32.8677 67.4631C33.2555 67.5956 33.6085 67.8111 33.9267 68.1094C34.2449 68.4044 34.4984 68.7955 34.6873 69.2827C34.8762 69.7699 34.9707 70.3698 34.9707 71.0824V71.5795H29.0843V70.5653H33.7775C33.7775 70.1345 33.6913 69.75 33.519 69.4119C33.35 69.0739 33.108 68.8071 32.7931 68.6115C32.4816 68.416 32.1137 68.3182 31.6895 68.3182C31.2221 68.3182 30.8178 68.4342 30.4764 68.6662C30.1383 68.8949 29.8781 69.1932 29.6958 69.5611C29.5136 69.929 29.4224 70.3234 29.4224 70.7443V71.4205C29.4224 71.9972 29.5218 72.486 29.7207 72.8871C29.9229 73.2848 30.2029 73.5881 30.5609 73.7969C30.9189 74.0024 31.3348 74.1051 31.8088 74.1051C32.117 74.1051 32.3954 74.062 32.644 73.9759C32.8959 73.8864 33.113 73.7538 33.2953 73.5781C33.4776 73.3991 33.6184 73.1771 33.7179 72.9119L34.8514 73.2301C34.7321 73.6146 34.5315 73.9527 34.2498 74.2443C33.9681 74.5327 33.6201 74.758 33.2058 74.9205C32.7915 75.0795 32.3258 75.1591 31.8088 75.1591ZM36.7555 77.8636V67.3636H37.889V68.5767H38.0282C38.1144 68.4441 38.2337 68.2751 38.3862 68.0696C38.542 67.8608 38.764 67.6752 39.0524 67.5128C39.344 67.3471 39.7385 67.2642 40.2356 67.2642C40.8786 67.2642 41.4454 67.425 41.9359 67.7464C42.4264 68.0679 42.8092 68.5237 43.0843 69.1136C43.3594 69.7036 43.497 70.3996 43.497 71.2017C43.497 72.0104 43.3594 72.7114 43.0843 73.3047C42.8092 73.8946 42.4281 74.352 41.9409 74.6768C41.4537 74.9983 40.8919 75.1591 40.2555 75.1591C39.765 75.1591 39.3722 75.0779 39.0772 74.9155C38.7823 74.7498 38.5552 74.5625 38.3961 74.3537C38.237 74.1416 38.1144 73.9659 38.0282 73.8267H37.9288V77.8636H36.7555ZM37.9089 71.1818C37.9089 71.7585 37.9934 72.2673 38.1625 72.7081C38.3315 73.1456 38.5784 73.4886 38.9032 73.7372C39.228 73.9825 39.6258 74.1051 40.0964 74.1051C40.5869 74.1051 40.9963 73.9759 41.3244 73.7173C41.6558 73.4555 41.9044 73.1042 42.0701 72.6634C42.2392 72.2192 42.3237 71.7254 42.3237 71.1818C42.3237 70.6449 42.2408 70.161 42.0751 69.7301C41.9127 69.2959 41.6658 68.9529 41.3343 68.701C41.0062 68.4458 40.5936 68.3182 40.0964 68.3182C39.6191 68.3182 39.2181 68.4392 38.8933 68.6811C38.5685 68.9197 38.3232 69.2545 38.1575 69.6854C37.9918 70.1129 37.9089 70.6117 37.9089 71.1818ZM48.389 75.1591C47.6996 75.1591 47.0948 74.995 46.5744 74.6669C46.0574 74.3388 45.653 73.8797 45.3613 73.2898C45.073 72.6998 44.9288 72.0104 44.9288 71.2216C44.9288 70.4261 45.073 69.7318 45.3613 69.1385C45.653 68.5452 46.0574 68.0845 46.5744 67.7564C47.0948 67.4283 47.6996 67.2642 48.389 67.2642C49.0784 67.2642 49.6816 67.4283 50.1987 67.7564C50.719 68.0845 51.1234 68.5452 51.4118 69.1385C51.7034 69.7318 51.8493 70.4261 51.8493 71.2216C51.8493 72.0104 51.7034 72.6998 51.4118 73.2898C51.1234 73.8797 50.719 74.3388 50.1987 74.6669C49.6816 74.995 49.0784 75.1591 48.389 75.1591ZM48.389 74.1051C48.9127 74.1051 49.3436 73.9709 49.6816 73.7024C50.0197 73.4339 50.2699 73.081 50.4324 72.6435C50.5948 72.206 50.676 71.732 50.676 71.2216C50.676 70.7112 50.5948 70.2356 50.4324 69.7947C50.2699 69.3539 50.0197 68.9976 49.6816 68.7259C49.3436 68.4541 48.9127 68.3182 48.389 68.3182C47.8654 68.3182 47.4345 68.4541 47.0964 68.7259C46.7583 68.9976 46.5081 69.3539 46.3457 69.7947C46.1833 70.2356 46.1021 70.7112 46.1021 71.2216C46.1021 71.732 46.1833 72.206 46.3457 72.6435C46.5081 73.081 46.7583 73.4339 47.0964 73.7024C47.4345 73.9709 47.8654 74.1051 48.389 74.1051ZM53.6403 75V67.3636H54.7738V68.517H54.8533C54.9925 68.1392 55.2444 67.8326 55.609 67.5973C55.9736 67.362 56.3846 67.2443 56.842 67.2443C56.9281 67.2443 57.0359 67.246 57.1651 67.2493C57.2944 67.2526 57.3922 67.2576 57.4585 67.2642V68.4574C57.4187 68.4474 57.3275 68.4325 57.185 68.4126C57.0458 68.3894 56.8983 68.3778 56.7425 68.3778C56.3713 68.3778 56.0399 68.4557 55.7482 68.6115C55.4599 68.764 55.2312 68.9761 55.0621 69.2479C54.8964 69.5163 54.8136 69.8229 54.8136 70.1676V75H53.6403ZM62.6488 67.3636V68.358H58.6914V67.3636H62.6488ZM59.8448 65.5341H61.0181V72.8125C61.0181 73.1439 61.0662 73.3925 61.1623 73.5582C61.2617 73.7206 61.3877 73.83 61.5401 73.8864C61.6959 73.9394 61.86 73.9659 62.0323 73.9659C62.1616 73.9659 62.2676 73.9593 62.3505 73.946C62.4334 73.9295 62.4996 73.9162 62.5494 73.9062L62.788 74.9602C62.7085 74.9901 62.5974 75.0199 62.4549 75.0497C62.3124 75.0829 62.1317 75.0994 61.913 75.0994C61.5816 75.0994 61.2567 75.0282 60.9386 74.8857C60.6237 74.7431 60.3619 74.526 60.1531 74.2344C59.9476 73.9427 59.8448 73.5748 59.8448 73.1307V65.5341Z" fill="#465362"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M21 24C21 14.5719 21 9.85786 23.9289 6.92894C26.8579 4 31.5719 4 41 4C50.428 4 55.1422 4 58.071 6.92894C61 9.85786 61 14.5719 61 24C61 33.428 61 38.1422 58.071 41.071C55.1422 44 50.428 44 41 44C31.5719 44 26.8579 44 23.9289 41.071C21 38.1422 21 33.428 21 24ZM41 12.5C41.8284 12.5 42.5 13.1716 42.5 14V24.3786L45.9394 20.9394C46.5252 20.3536 47.4748 20.3536 48.0606 20.9394C48.6464 21.5252 48.6464 22.4748 48.0606 23.0606L42.0606 29.0606C41.7794 29.342 41.3978 29.5 41 29.5C40.6022 29.5 40.2206 29.342 39.9394 29.0606L33.9393 23.0606C33.3536 22.4748 33.3536 21.5252 33.9393 20.9394C34.5251 20.3536 35.4749 20.3536 36.0607 20.9394L39.5 24.3786V14C39.5 13.1716 40.1716 12.5 41 12.5ZM33 32.5C32.1716 32.5 31.5 33.1716 31.5 34C31.5 34.8284 32.1716 35.5 33 35.5H49C49.8284 35.5 50.5 34.8284 50.5 34C50.5 33.1716 49.8284 32.5 49 32.5H33Z" fill="#48AEF3"/>
</svg>

                            </div>
                            <button class="sa_view-sa tooltip view-submission-button" data-tip="View Submission" submission_id="{{sa.submission_id}}" assignment_id="{{sa.assignment_id}}">
                                <svg width="82" height="80" viewBox="0 0 82 80" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M26.4972 64.8182L29.52 73.3892H29.6393L32.662 64.8182H33.9546L30.216 75H28.9433L25.2046 64.8182H26.4972ZM35.3815 75V67.3636H36.5548V75H35.3815ZM35.9781 66.0909C35.7494 66.0909 35.5522 66.013 35.3865 65.8572C35.224 65.7015 35.1428 65.5142 35.1428 65.2955C35.1428 65.0767 35.224 64.8894 35.3865 64.7337C35.5522 64.5779 35.7494 64.5 35.9781 64.5C36.2068 64.5 36.4023 64.5779 36.5647 64.7337C36.7304 64.8894 36.8133 65.0767 36.8133 65.2955C36.8133 65.5142 36.7304 65.7015 36.5647 65.8572C36.4023 66.013 36.2068 66.0909 35.9781 66.0909ZM41.9055 75.1591C41.1697 75.1591 40.5349 74.9967 40.0013 74.6719C39.471 74.3438 39.0617 73.8864 38.7733 73.2997C38.4883 72.7098 38.3458 72.0237 38.3458 71.2415C38.3458 70.4593 38.4883 69.7699 38.7733 69.1733C39.0617 68.5734 39.4627 68.1061 39.9765 67.7713C40.4935 67.4332 41.0967 67.2642 41.7861 67.2642C42.1839 67.2642 42.5766 67.3305 42.9644 67.4631C43.3522 67.5956 43.7052 67.8111 44.0233 68.1094C44.3415 68.4044 44.5951 68.7955 44.784 69.2827C44.9729 69.7699 45.0674 70.3698 45.0674 71.0824V71.5795H39.181V70.5653H43.8742C43.8742 70.1345 43.788 69.75 43.6157 69.4119C43.4466 69.0739 43.2047 68.8071 42.8898 68.6115C42.5783 68.416 42.2104 68.3182 41.7861 68.3182C41.3188 68.3182 40.9144 68.4342 40.5731 68.6662C40.235 68.8949 39.9748 69.1932 39.7925 69.5611C39.6102 69.929 39.5191 70.3234 39.5191 70.7443V71.4205C39.5191 71.9972 39.6185 72.486 39.8174 72.8871C40.0196 73.2848 40.2996 73.5881 40.6576 73.7969C41.0155 74.0024 41.4315 74.1051 41.9055 74.1051C42.2137 74.1051 42.4921 74.062 42.7407 73.9759C42.9926 73.8864 43.2097 73.7538 43.392 73.5781C43.5742 73.3991 43.7151 73.1771 43.8145 72.9119L44.9481 73.2301C44.8287 73.6146 44.6282 73.9527 44.3465 74.2443C44.0648 74.5327 43.7168 74.758 43.3025 74.9205C42.8882 75.0795 42.4225 75.1591 41.9055 75.1591ZM48.5823 75L46.2556 67.3636H47.4885L49.1391 73.2102H49.2187L50.8493 67.3636H52.1022L53.713 73.1903H53.7925L55.4431 67.3636H56.676L54.3493 75H53.1959L51.5255 69.1335H51.4062L49.7357 75H48.5823Z" fill="#465362"/>
<path d="M41 35.5C41.8284 35.5 42.5 34.8284 42.5 34V22C42.5 21.1716 41.8284 20.5 41 20.5C40.1716 20.5 39.5 21.1716 39.5 22V34C39.5 34.8284 40.1716 35.5 41 35.5Z" fill="#48AEF3"/>
<path d="M41 14C42.1046 14 43 14.8954 43 16C43 17.1046 42.1046 18 41 18C39.8954 18 39 17.1046 39 16C39 14.8954 39.8954 14 41 14Z" fill="#48AEF3"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M19.5 24C19.5 12.1259 29.1259 2.5 41 2.5C52.8742 2.5 62.5 12.1259 62.5 24C62.5 35.8742 52.8742 45.5 41 45.5C29.1259 45.5 19.5 35.8742 19.5 24ZM41 5.5C30.7827 5.5 22.5 13.7827 22.5 24C22.5 34.2172 30.7827 42.5 41 42.5C51.2172 42.5 59.5 34.2172 59.5 24C59.5 13.7827 51.2172 5.5 41 5.5Z" fill="#48AEF3"/>
</svg>

                            </button>
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

//assigning on click event listener to view all
document.getElementById("view-all").addEventListener("click", function () {
    let newUrl = new URL(window.location.href);
    let institute_id = newUrl.searchParams.get("institute_id");
    let student_id = newUrl.searchParams.get('student_id');
    
    // Set the new parameters for redirection
    newUrl.searchParams.set('institute_id', institute_id);
    newUrl.searchParams.set('student_id', student_id);
    newUrl.searchParams.set('app', 'assignments');
    newUrl.searchParams.set('assignment', 'Completed');
    
    // Update the URL and reload the page
    history.pushState({}, '', newUrl);
    window.location.reload();
});

//skill graph logic
Chart.defaults.font.size = 14;
new Chart(document.getElementById('myChart'), {
  type: 'bar',
  data: {
    labels: [
        ['Problem', 'Solving'],
        ['Logic', 'Building'],
        ['Data', 'Structure'],
        ['Code', 'Efficiency'],
        ['Code', 'Accuracy']
      ],
    datasets: [{
      label: 'Score',
      data: [65, 19, 37, 5, 20, 55],
      backgroundColor: [
        '#2ba2f2',
        '#2a9c8e',
        '#8338eb',
        '#fac600',
        '#e53945',
      ],
    }]
  },
    options: {
        plugins: {
            legend: {
              display: false
            },

          },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});