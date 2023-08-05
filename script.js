// Code Here
// API Link:https://test-data-gules.vercel.app/data.json
document.addEventListener("DOMContentLoaded", function() {
    fetchDataFromAPI()
    .then(data => renderData(data.data))
    .catch(error => console.error("Error fetching data:", error));
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
        accordionItem.appendChild(titleElement);

        const questionsList = document.createElement("ul");

        item.ques.forEach((question, index) => {
            const questionItem = document.createElement("li");
            questionItem.innerHTML = `
                <label>
                    <input type="checkbox" class="question-checkbox" data-index="${index}">
                    <span>${question.title}</span>
                </label>
                <div class="question-details">
                    <p>Tags: ${question.tags || "N/A"}</p>
                    <a href="${question.yt_link}" target="_blank">YouTube Link</a>
                `;

            if (question.p1_link) {
                questionItem.innerHTML += `
                    <a href="${question.p1_link}" target="_blank">Problem 1 Link</a>
                `;
            }

            if (question.p2_link) {
                questionItem.innerHTML += `
                    <a href="${question.p2_link}" target="_blank">Problem 2 Link</a>
                `;
            }

            questionItem.innerHTML += `</div>`;
            questionsList.appendChild(questionItem);
        });

        accordionItem.appendChild(questionsList);
        contentDiv.appendChild(accordionItem);
    });

    // Add event listeners for accordion and checkbox behavior
    const accordionItems = document.querySelectorAll(".accordion");

    accordionItems.forEach(item => {
        const titleElement = item.querySelector("h2");
        const detailsElement = item.querySelector(".question-details");

        titleElement.addEventListener("click", () => {
            item.classList.toggle("active");
            detailsElement.style.display = item.classList.contains("active") ? "block" : "none";
        });
    });

    const checkboxes = document.querySelectorAll(".question-checkbox");
    let completedCount = 0;

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener("change", () => {
            const questionItem = checkbox.closest("li");
            questionItem.classList.toggle("completed", checkbox.checked);
            completedCount = document.querySelectorAll(".question-checkbox:checked").length;
            updateProgressBar(completedCount / checkboxes.length);
        });
    });

    // Add keyboard shortcuts
    document.addEventListener("keydown", e => {
        const activeAccordion = document.querySelector(".accordion.active");
        if (activeAccordion) {
            const currentIndex = parseInt(activeAccordion.querySelector(".question-checkbox").dataset.index);
            let nextIndex = currentIndex;

            if (e.key === "ArrowUp") {
                nextIndex = (currentIndex - 1 + checkboxes.length) % checkboxes.length;
            } else if (e.key === "ArrowDown") {
                nextIndex = (currentIndex + 1) % checkboxes.length;
            }

            checkboxes[nextIndex].focus();
        }
    });

   // Initialize progress bar
    updateProgressBar(completedCount / checkboxes.length);
}

function updateProgressBar(completionRate) {
    const progressBar = document.getElementById("progress-bar");
    progressBar.style.width = `${completionRate * 100}%`;
}
document.addEventListener("DOMContentLoaded", function() {
    // ... Existing code ...

    const checkboxes = document.querySelectorAll(".question-checkbox");
    let completedCount = 0;

    checkboxes.forEach(checkbox => {
        // Restore marked questions from localStorage
        const questionIndex = parseInt(checkbox.dataset.index);
        const isChecked = localStorage.getItem(`question_${questionIndex}`) === "true";
        checkbox.checked = isChecked;

        checkbox.addEventListener("change", () => {
            const questionItem = checkbox.closest("li");
            questionItem.classList.toggle("completed", checkbox.checked);
            completedCount = document.querySelectorAll(".question-checkbox:checked").length;
            updateProgressBar(completedCount / checkboxes.length);

            // Save marked questions to localStorage
            localStorage.setItem(`question_${questionIndex}`, checkbox.checked);
        });
    });
});