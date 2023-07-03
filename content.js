console.log("linkedin tags gpt content.js");

const INIT_WAIT_TIME = 3000;
const SCROLL_JOB_LIST_WAIT_TIME = 1000;
const JOB_DESCRIPTION_WAIT_TIME = 1000;

function extractYears(text) {
  const match = text.match(/(\d+)\+? years?/i);
  return match ? match[0] : "Not specified";
}

// content.js
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function appendExperienceToJobCards(jobCard) {
  jobCard.click();
  await delay(JOB_DESCRIPTION_WAIT_TIME); // Wait for the new job description to load

  const jdContent = document.querySelector(".jobs-description__content");
  const jobDescription = jdContent
    ? jdContent.innerText
    : "Job description not found";

  const yearsOfExperience = extractYears(jobDescription);

  // Create a new div element for the experience tag
  const experienceTag = document.createElement("div");
  experienceTag.textContent = "Expr: " + yearsOfExperience;
  experienceTag.classList.add("experience-tag");
  experienceTag.classList.add("job-card-list__insight");
  experienceTag.classList.add("t-14");
  // Add border radius and shadow styles
  experienceTag.style.borderRadius = "1rem";
  experienceTag.style.padding = "0.5rem";
  experienceTag.style.color = "white";
  experienceTag.style.backgroundColor = "#616263";
  experienceTag.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";

  // Insert the new tag as the next sibling of the job card
  if (jobCard.nextSibling) {
    jobCard.parentNode.insertBefore(experienceTag, jobCard.nextSibling);
  } else {
    jobCard.parentNode.appendChild(experienceTag);
  }
}

async function handleInfiniteScrolling() {
  let previousLength, currentLength;
  const resultsList = document.querySelector(".jobs-search-results-list");
  const jobCardHeight = document.querySelector(
    ".job-card-container"
  ).clientHeight;

  do {
    previousLength = currentLength;
    currentLength = resultsList.querySelectorAll(
      ".job-card-list__entity-lockup"
    ).length;

    resultsList.scrollTo(0, (currentLength - 1) * jobCardHeight);
    await delay(SCROLL_JOB_LIST_WAIT_TIME); // Wait for new jobs to load
  } while (previousLength !== currentLength);
}

async function processJobCards() {
  const resultsList = document.querySelector(".jobs-search-results-list");
  const jobCards = Array.from(
    resultsList.querySelectorAll(".job-card-list__entity-lockup")
  );

  for (const jobCard of jobCards) {
    await appendExperienceToJobCards(jobCard);
  }
}

async function main() {
  await delay(INIT_WAIT_TIME);
  await handleInfiniteScrolling();
  await processJobCards();
}

// content.js
// Your existing content.js code goes here...

// Check the switch state from storage
chrome.storage.sync.get("enabled", function (data) {
  if (data.enabled) {
    main();
  }
});
