check_assign = {
    "assignment": `
    <div>
    <button style="outline: none; border: none; background: none;">
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16.5 13.5L12 18M12 18L16.5 22.5M12 18H24M31.5 18C31.5 25.4559 25.4559 31.5 18 31.5C10.5442 31.5 4.5 25.4559 4.5 18C4.5 10.5442 10.5442 4.5 18 4.5C25.4559 4.5 31.5 10.5442 31.5 18Z" stroke="#011936" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
    {{students.aid}}
    </div>
    `,
    "checked_status": `  
              <div id="data">
            <div class="image-profile">
            <img src="../assets/images/Profile-ladki.jpg" alt="profile" />
            <p class="title">{{students.name}}</p>
            </div>  
              <div id="scores">
              <p class="date">Accuracy</p>
              <p class="date">{{student.accuracy}}</p>
              <p class="">Efficiency</p>
              <p class="">{{student.efficiency}}</p>
              <p class="">Score</p>
              <p class="">{{student.score}}</p>
              </div>
             <div id="buttons">
             <button class="view"><svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
             <path fill-rule="evenodd" clip-rule="evenodd" d="M3 18C3 10.9289 3 7.39339 5.1967 5.1967C7.39339 3 10.9289 3 18 3C25.071 3 28.6066 3 30.8032 5.1967C33 7.39339 33 10.9289 33 18C33 25.071 33 28.6066 30.8032 30.8032C28.6066 33 25.071 33 18 33C10.9289 33 7.39339 33 5.1967 30.8032C3 28.6066 3 25.071 3 18ZM18 9.375C18.6213 9.375 19.125 9.87868 19.125 10.5V18.2839L21.7045 15.7045C22.1439 15.2652 22.8561 15.2652 23.2955 15.7045C23.7348 16.1439 23.7348 16.8561 23.2955 17.2955L18.7955 21.7955C18.5845 22.0065 18.2984 22.125 18 22.125C17.7016 22.125 17.4155 22.0065 17.2045 21.7955L12.7045 17.2955C12.2652 16.8561 12.2652 16.1439 12.7045 15.7045C13.1438 15.2652 13.8562 15.2652 14.2955 15.7045L16.875 18.2839V10.5C16.875 9.87868 17.3787 9.375 18 9.375ZM12 24.375C11.3787 24.375 10.875 24.8787 10.875 25.5C10.875 26.1213 11.3787 26.625 12 26.625H24C24.6213 26.625 25.125 26.1213 25.125 25.5C25.125 24.8787 24.6213 24.375 24 24.375H12Z" fill="#48AEF3"/>
             </svg>
             </button>
             <button class="view"><svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
             <path fill-rule="evenodd" clip-rule="evenodd" d="M0.875 17C0.875 8.09441 8.09441 0.875 17 0.875C25.9056 0.875 33.125 8.09441 33.125 17C33.125 25.9056 25.9056 33.125 17 33.125C8.09441 33.125 0.875 25.9056 0.875 17ZM17 3.125C9.33706 3.125 3.125 9.33706 3.125 17C3.125 24.6629 9.33706 30.875 17 30.875C24.6629 30.875 30.875 24.6629 30.875 17C30.875 9.33706 24.6629 3.125 17 3.125Z" fill="#48AEF3"/>
             <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="17" fill="#48AEF3">i</text>
         </svg>
         
             </button>
             </div>
              </div>
    `
};