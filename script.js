//  script.js
  document.addEventListener("DOMContentLoaded", async function () {
    try {
      const data = await fetchDataFromAPI();
      renderData(data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  
    const checkboxes = document.querySelectorAll(".question-checkbox");
    checkboxes.forEach(checkbox => {
      const questionId = checkbox.dataset.id;
      const isChecked = localStorage.getItem(`question_${questionId}`) === "true";
      checkbox.checked = isChecked;
  
      checkbox.addEventListener("change", () => {
        const questionItem = checkbox.closest("li");
        questionItem.classList.toggle("completed", checkbox.checked);
        updateProgressBar(getCompletionRate());
        // Saving marked question's state to localStorage
        localStorage.setItem(`question_${questionId}`, checkbox.checked);
      });
    });
  
    // Initialize progress bar and retrieve from localStorage if available
    updateProgressBar(getCompletionRate());
  
    // Toggle dark mode
    const darkModeToggle = document.getElementById("dark-mode-toggle");
    darkModeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("mode", "dark");
      } else {
        localStorage.setItem("mode", "light");
      }
    });
  
    // Check if the user has a preference saved in local storage
    const savedMode = localStorage.getItem("mode");
    if (savedMode === "dark") {
      document.body.classList.add("dark-mode");
    }
  
    // Adding event listener for accordion behavior
    const accordionTitles = document.querySelectorAll(".accordion-title");
    accordionTitles.forEach(titleElement => {
      titleElement.addEventListener("click", () => {
        const accordionItem = titleElement.parentElement;
        accordionItem.classList.toggle("active");
        const questionsList = accordionItem.querySelector(".accordion-content");
        questionsList.style.display = accordionItem.classList.contains("active") ? "block" : "none";
  
        const questionDetails = accordionItem.querySelector(".question-details");
        // questionDetails.style.display = accordionItem.classList.contains("active") ? "block" : "none";
      });
    });
  });
  
  async function fetchDataFromAPI() {
    try {
      const response = await fetch("https://test-data-gules.vercel.app/data.json");
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error("Failed to fetch data from the API");
    }
  }
  
  function renderData(data) {
    const contentDiv = document.getElementById("content");
  
    data.forEach(item => {
      const accordionItem = document.createElement("div");
      accordionItem.className = "accordion";
  
      const titleElement = document.createElement("h2");
      titleElement.textContent = item.title;
      titleElement.classList.add("accordion-title"); // Added a class for styling
      accordionItem.appendChild(titleElement);
  
      const questionsList = document.createElement("ul");
      questionsList.classList.add("accordion-content"); // Added a class for styling
      questionsList.style.display = "none"; // Initially hiding the content
  
      item.ques.forEach(question => {
        const questionItem = document.createElement("li");
        questionItem.innerHTML = `
          <label>
            <input type="checkbox" class="question-checkbox" data-id="${question.id}">
            <span>${question.title}</span>
          </label>
        //   <div class="question-details">
        `;
  
        if (question.tags) {
          questionItem.innerHTML += `
            Tags: ${question.tags}
          `;
        } else {
          questionItem.innerHTML += `
            Tags: N/A
          `;
        }
  
        if (question.yt_link) {
          questionItem.innerHTML += `
            <a href="${question.yt_link}" target="_blank">YouTube Link</a>
          `;
        }
  
        if (question.p1_link) {
          questionItem.innerHTML += `
            <a href="${question.p1_link}" target="_blank">Problem Link1</a>
          `;
        }
  
        if (question.p2_link) {
          questionItem.innerHTML += `
            <a href="${question.p2_link}" target="_blank">Problem Link2</a>
          `;
        }
  
        questionItem.innerHTML += `</div></li>`; 
        questionsList.appendChild(questionItem);
      });
  
      accordionItem.appendChild(questionsList);
      contentDiv.appendChild(accordionItem);
    });
  }
  
  
  
  
  function updateProgressBar(completionRate) {
    const progressBar = document.getElementById("progress-bar");
    progressBar.style.width = `${completionRate * 100}%`;
    // Save progress bar completion rate to localStorage
    localStorage.setItem("progress_bar_completion_rate", completionRate);
  }
  
  function getCompletionRate() {
    const checkboxes = document.querySelectorAll(".question-checkbox");
    const completedCount = Array.from(checkboxes).filter(checkbox => checkbox.checked).length;
    return completedCount / checkboxes.length;
  }
  
