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

  // Retrieve and apply the "completed" class to questions from localStorage on page load
  const savedQuestionIds = Object.keys(localStorage);
  savedQuestionIds.forEach((key) => {
    if (key.startsWith("question_")) {
      const questionId = key.replace("question_", "");
      const isChecked = localStorage.getItem(key) === "true";
      const checkbox = document.querySelector(`[data-id="${questionId}"]`);
      const questionItem = checkbox.closest("li");
      questionItem.classList.toggle("completed", isChecked);
    }
  });
// Keyboard shortcuts for navigation
  document.addEventListener("keydown", event => {
    const focusedQuestion = document.querySelector(".question-checkbox:focus");
    if (!focusedQuestion) return;

    const currentIndex = Array.from(checkboxes).indexOf(focusedQuestion);

    if (event.key === "ArrowUp") {
      const previousIndex = currentIndex > 0 ? currentIndex - 1 : checkboxes.length - 1;
      checkboxes[previousIndex].focus();
    } else if (event.key === "ArrowDown") {
      const nextIndex = currentIndex < checkboxes.length - 1 ? currentIndex + 1 : 0;
      checkboxes[nextIndex].focus();
    }
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

  // Checking if the user has a preference saved in local storage
  const savedMode = localStorage.getItem("mode");
  if (savedMode === "dark") {
    document.body.classList.add("dark-mode");
  }

  const accordionTitles = document.querySelectorAll(".accordion-title");
  accordionTitles.forEach(titleElement => {
    const accordionItem = titleElement.parentElement;
    const questionsList = accordionItem.querySelector(".accordion-content");

    titleElement.addEventListener("click", () => {
      accordionItem.classList.toggle("active");
      questionsList.style.display = accordionItem.classList.contains("active") ? "block" : "none";

      // Update the accordion state in localStorage
      if (accordionItem.classList.contains("active")) {
        localStorage.setItem(`accordion_${accordionItem.dataset.id}`, "open");
      } else {
        localStorage.setItem(`accordion_${accordionItem.dataset.id}`, "closed");
      }
    });

    // Retrieve and apply the "active" class to accordion items from localStorage on page load
    const savedState = localStorage.getItem(`accordion_${accordionItem.dataset.id}`);
    if (savedState === "open") {
      accordionItem.classList.add("active");
      questionsList.style.display = "block";
    } else if (savedState === "closed") {
      accordionItem.classList.remove("active");
      questionsList.style.display = "none";
    }
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
    accordionItem.setAttribute("data-id", item.sl_no);
    const titleElement = document.createElement("h2");
    titleElement.textContent = item.sl_no + '. ' + item.title;
    titleElement.classList.add("accordion-title"); 
    accordionItem.appendChild(titleElement);

    const questionsList = document.createElement("ul");
    questionsList.classList.add("accordion-content"); 
    questionsList.style.display = "none"; 

    item.ques.forEach(question => {
      const questionItem = document.createElement("li");
      questionItem.innerHTML = `
        <label>
          <input type="checkbox" class="question-checkbox" data-id="${question.id}">
          <span>${question.title}</span>
        </label>
        <div class="question-details">
      `;

      if (question.tags) {
        questionItem.innerHTML += `
          <span class="tags">Tags:${question.tags}</span>
        `;
      } else {
        questionItem.innerHTML += `
          <span class="tags">Tags: N/A</span>
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
  localStorage.setItem("progress_bar_completion_rate", completionRate);
}

function getCompletionRate() {
  const checkboxes = document.querySelectorAll(".question-checkbox");
  const completedCount = Array.from(checkboxes).filter(checkbox => checkbox.checked).length;
  return completedCount / checkboxes.length;
}
