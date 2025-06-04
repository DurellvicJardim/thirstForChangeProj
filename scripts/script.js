//makes a new object to store and keep track of the village's happiness, money, and water
function VillageInfo(peopleHappy = 50, money = 50, water = 50) {
  this.peopleHappy = peopleHappy;
  this.money = money;
  this.water = water;
}

//changes the happiness, money, and water values after the user picks something
function updateVillageStats(villageObj, impactObj) {
  try {
    if (impactObj.support !== undefined) {
      //get the current value from the village object
      var currentHappy = villageObj.peopleHappy;
      //get the change amount from the impact object
      var changeHappy = impactObj.support;
      //calculate the new value
      var newHappy = currentHappy + changeHappy;
      //make sure happiness doesn't go below 0
      if (newHappy < 0) {
        newHappy = 0;
      }
      //make sure it doesn't go above 100
      if (newHappy > 100) {
        newHappy = 100;
      }
      //update the village object with the new value
      villageObj.peopleHappy = newHappy;
    }

    if (impactObj.funding !== undefined) {
      var currentMoney = villageObj.money;
      var changeMoney = impactObj.funding;
      var newMoney = currentMoney + changeMoney;
      if (newMoney < 0) {
        newMoney = 0;
      }
      if (newMoney > 100) {
        newMoney = 100;
      }
      villageObj.money = newMoney;
    }
    if (impactObj.waterLevel !== undefined) {
      var currentWater = villageObj.water;
      var changeWater = impactObj.waterLevel;
      var newWater = currentWater + changeWater;
      if (newWater < 0) {
        newWater = 0;
      }
      if (newWater > 100) {
        newWater = 100;
      }
      villageObj.water = newWater;
    }
  } catch (error) {
    console.error("ERROR UPDATING THE STATS", error);
    alert("An error occurred while updating stats. Please check the console.");
  }
}

//declaring global variables
var firstVillageStatus = new VillageInfo(); //initial village status (which will be used for resetting)
var currentVillageStatus = new VillageInfo(); //village status that changes during the game
//information about where the player is in the game
var currentGameStatus = {
  currentStepName: "form",
  whichMainChoice: null,
  stepNumber: 0,
};
var pastSteps = []; //to remember the previous steps taken
var userName = ""; //variable to store the player's name
var villageInputName = ""; //variable to store the village name

//getting html elements by their IDs
var storyDiv = document.getElementById("storyDiv");
var storyParagraph = document.getElementById("storyParagraph");
var choicesDiv = document.getElementById("choicesDiv");
var infoForm = document.getElementById("infoForm");
var gameDiv = document.getElementById("gameDiv");
var backButton = document.getElementById("backButton");
var choiceForm = document.getElementById("choiceForm");
var confirmButton = document.getElementById("confirmButton");

//getting progress bar elements
var progressBarFill = document.getElementById("progressBarFill");
var peopleBar = document.getElementById("peopleBar");
var moneyBar = document.getElementById("moneyBar");
var waterBar = document.getElementById("waterBar");
var peopleValue = document.getElementById("peopleValue");
var moneyValue = document.getElementById("moneyValue");
var waterValue = document.getElementById("waterValue");

//popup alert elements
//overlay for the popup
var myAlertPopupBackground = document.getElementById("myAlertPopupBackground");
var myAlertPopupBox = document.getElementById("myAlertPopupBox"); //white box for the popup message
var myAlertText = document.getElementById("myAlertText"); //paragraph for popup message
var myAlertOkButton = document.getElementById("myAlertOkButton"); //ok button
var myAlertCancelButton = document.getElementById("myAlertCancelButton"); //cancel button

//colour blind mode toggle
var colourBlindToggle = document.getElementById("colourBlindToggle");

//data for the story paths and phases
//holds all data for the simulation paths
var allStories = [
  {
    //choice name
    name: "Dig a Well",
    //resource
    infoLink:
      "https://washmatters.wateraid.org/publications/technology-issue-sheet-2007",
    phases: [
      //phases for path
      {
        text: "Phase 1: Digging involves careful planning. How will you approach finding the right spot and method?", //question text
        choices: [
          //choices for phase
          {
            text: "Consult an expert geologist", //choice
            impact: { support: 5, funding: -10, waterLevel: 10 }, //impact (all of these repeat for each phase and path)
          },
          {
            text: "Rely on traditional water divination methods",
            impact: { support: 2, funding: 0, waterLevel: 5 },
          },
          {
            text: "Combine expert geological surveys with traditional knowledge",
            impact: { support: 10, funding: -5, waterLevel: 15 },
          },
        ],
      },
      {
        text: "Phase 2: Construction requires resources and labor. How will you manage the building process?",
        choices: [
          {
            text: "Hire an external professional drilling company",
            impact: { funding: -15, waterLevel: 10 },
          },
          {
            text: "Organize a community-led digging project",
            impact: { support: 10, funding: -5, waterLevel: 5 },
          },
          {
            text: "Use external contractors for drilling, community for support structures",
            impact: { support: 5, funding: -10, waterLevel: 10 },
          },
        ],
      },
      {
        text: "Phase 3: A well needs upkeep to remain safe and functional. What's your long-term maintenance plan?",
        choices: [
          {
            text: "Train community members for regular maintenance & testing",
            impact: { support: 10, funding: 0, waterLevel: 5 },
          },
          {
            text: "Hire an external service for periodic checks & maintenance",
            impact: { funding: -5, waterLevel: 5 },
          },
          {
            text: "Minimal maintenance, only repair when issues arise",
            impact: { support: -5, waterLevel: -10 },
          },
        ],
      },
    ],
  },
  {
    name: "Rainwater Harvesting",
    infoLink:
      "https://www.appropedia.org/Practical_Action/Rainwater_Harvesting",
    phases: [
      {
        text: "Phase 1: Designing an effective rainwater harvesting system depends on local climate and needs. How will you plan it?",
        choices: [
          {
            text: "Consult local experts on water storage and filtration",
            impact: { support: 5, funding: -5, waterLevel: 10 },
          },
          {
            text: "Use simple, traditional rooftop collection methods",
            impact: { support: 3, funding: 0, waterLevel: 5 },
          },
          {
            text: "Combine expert design with readily available local materials",
            impact: { support: 10, funding: -10, waterLevel: 15 },
          },
        ],
      },
      {
        text: "Phase 2: Who will build the collection tanks and filtration systems?",
        choices: [
          {
            text: "Hire external contractors specializing in water systems",
            impact: { funding: -10, waterLevel: 10 },
          },
          {
            text: "Mobilize the community to build using shared designs",
            impact: { support: 10, funding: -5, waterLevel: 5 },
          },
          {
            text: "Professionals handle complex parts, community builds simpler components",
            impact: { support: 5, funding: -8, waterLevel: 8 },
          },
        ],
      },
      {
        text: "Phase 3: Rainwater systems need regular cleaning and checks, especially filters. What's the maintenance approach?",
        choices: [
          {
            text: "Establish a community rota for cleaning tanks and checking filters",
            impact: { support: 10, waterLevel: 5 },
          },
          {
            text: "Contract an external team for quarterly maintenance",
            impact: { funding: -5, waterLevel: 5 },
          },
          {
            text: "Clean only when water quality noticeably declines",
            impact: { support: -5, waterLevel: -10 },
          },
        ],
      },
    ],
  },
  {
    name: "Water Purification System",
    infoLink:
      "https://www.cdc.gov/global-water-sanitation-hygiene/about/about-household-water-treatment.html",
    phases: [
      {
        text: "Phase 1: Purification systems can be costly upfront. How will you secure the necessary funding?",
        choices: [
          {
            text: "Seek donations from international NGOs and charities",
            impact: { support: 5, funding: 10, waterLevel: 5 },
          },
          {
            text: "Implement a community savings scheme to pool resources",
            impact: { support: 10, funding: -5, waterLevel: 5 },
          },
          {
            text: "Apply for government grants or subsidies for water projects",
            impact: { funding: 15, waterLevel: 5 },
          },
        ],
      },
      {
        text: "Phase 2: Setting up the purification unit requires technical skill. Who will install it?",
        choices: [
          {
            text: "Hire specialized external technicians for installation",
            impact: { funding: -10, waterLevel: 10 },
          },
          {
            text: "Train community members alongside hired experts",
            impact: { support: 10, funding: -5, waterLevel: 5 },
          },
          {
            text: "Use a combined team: professionals install, community assists",
            impact: { support: 5, funding: -8, waterLevel: 8 },
          },
        ],
      },
      {
        text: "Phase 3: Purification systems need consistent maintenance (filter changes, power). How will this be managed?",
        choices: [
          {
            text: "Train a dedicated community team for operation & maintenance",
            impact: { support: 10, waterLevel: 5 },
          },
          {
            text: "Sign an annual maintenance contract with the supplier/external expert",
            impact: { funding: -5, waterLevel: 5 },
          },
          {
            text: "Perform maintenance reactively when the system malfunctions",
            impact: { support: -5, waterLevel: -10 },
          },
        ],
      },
    ],
  },
  {
    name: "Build Small Dams",
    infoLink: "https://thewaterproject.org/sand-dams",
    phases: [
      {
        text: "Phase 1: Dam construction requires careful engineering and environmental assessment. Who will design it?",
        choices: [
          {
            text: "Consult local engineers familiar with the terrain",
            impact: { support: 5, funding: -5, waterLevel: 5 },
          },
          {
            text: "Hire experienced external dam construction architects",
            impact: { funding: -10, waterLevel: 10 },
          },
          {
            text: "Develop the plan through community consultations and local knowledge",
            impact: { support: 10, funding: 0, waterLevel: 3 },
          },
        ],
      },
      {
        text: "Phase 2: Building even a small dam is a significant undertaking. Who will manage the construction?",
        choices: [
          {
            text: "Employ an external construction company with heavy equipment",
            impact: { funding: -10, waterLevel: 10 },
          },
          {
            text: "Organize a large-scale community labor project",
            impact: { support: 10, funding: -5, waterLevel: 5 },
          },
          {
            text: "Combine professional oversight with community workforce",
            impact: { support: 5, funding: -8, waterLevel: 8 },
          },
        ],
      },
      {
        text: "Phase 3: Dams require ongoing monitoring for safety and silt build-up. What is the maintenance strategy?",
        choices: [
          {
            text: "Community volunteers monitor dam structure and water levels",
            impact: { support: 10, waterLevel: 5 },
          },
          {
            text: "Schedule annual inspections and maintenance by external engineers",
            impact: { funding: -5, waterLevel: 5 },
          },
          {
            text: "Address issues only when visible damage or problems occur",
            impact: { support: -5, waterLevel: -10 },
          },
        ],
      },
    ],
  },
];

//FUNCTIONS TO MAKE ALL THIS WORK
//checks the player's name and village name, saves them, and starts the simulation.
function startButtonClick(eventThing) {
  try {
    eventThing.preventDefault(); //stop the page from reloading on submit
    userName = document.getElementById("userInputName").value.trim(); //get name and remove spaces
    //get name and remove spaces
    villageInputName = document.getElementById("villageInputName").value.trim();

    //check if user left fields empty
    if (userName == "" || villageInputName == "") {
      showMyAlert("Please type your name and village name.", false);
      return;
    }

    //storing names in cookies and make sure special characters in names are saved correctly
    document.cookie = "userName=" + encodeURIComponent(userName) + ";path=/";
    document.cookie =
      "villageName=" + encodeURIComponent(villageInputName) + ";path=/";

    //show custom popup
    showMyAlert("You are about to begin the simulation.", false, function () {
      if (infoForm) infoForm.style.display = "none"; //hide the form
      if (gameDiv) gameDiv.style.display = "block"; //show main game area
      resetTheGame(); //reset all variables
      showFirstChoices(); //show the initial choices
    });
  } catch (error) {
    console.error("UNEXPECTED ERROR in startButtonClick", error);
    alert("An unexpected error occurred. Please check the console.");
  }
}

//rputs everything back to the way it was at the beginning.
function resetTheGame() {
  try {
    currentVillageStatus = new VillageInfo(); //create new village
    //reset progress
    currentGameStatus = {
      currentStepName: "start",
      whichMainChoice: null,
      stepNumber: 0,
    };
    pastSteps = [];
    updateTheBars();
    if (backButton) backButton.style.display = "none"; //hide button
    if (confirmButton) confirmButton.style.display = "none"; //hide button
  } catch (error) {
    console.error("ERROR RESETTING", error);
    alert("An error occurred while resetting. Please check the console.");
  }
}

//displays the first 4 main choices (dig a well, rainwater, etc)
function showFirstChoices() {
  try {
    currentGameStatus.currentStepName = "start";

    var welcomeText = "Welcome, Leader <strong>" + userName + "</strong>! ";
    welcomeText +=
      "The village of <strong>" + villageInputName + "</strong> needs water. ";
    welcomeText += "Choose your first big plan:";
    changeStoryText(welcomeText);

    var buttonOptions = [];
    //loop through each path
    for (var i = 0; i < allStories.length; i++) {
      //make sure each button remembers correct 'i' value
      var makeActionFunc = function (indexNum) {
        return function () {
          mainChoicePicked(indexNum); //correct path number passed
        };
      };
      //add object to list
      buttonOptions.push({
        buttonText: allStories[i].name,
        buttonAction: makeActionFunc(i),
      });
    }
    showButtonOptions(buttonOptions);
    updateTheBars(); //update progress bars
    if (backButton) backButton.style.display = "none";
    if (confirmButton) confirmButton.style.display = "none";
  } catch (error) {
    console.error("ERROR SHOWING THE INITIAL CHOICES", error);
    alert(
      "An error occurred while showing initial choices. Please check the console."
    );
  }
}

//figures out which path the player chose and moves the game to the first step of that path.
function mainChoicePicked(choiceNumber) {
  try {
    rememberThisStep(); //saves state so user can go back
    currentGameStatus.whichMainChoice = choiceNumber; //store path user picked
    currentGameStatus.stepNumber = 0;
    currentGameStatus.currentStepName = "step1";
    showCurrentQuestion();
  } catch (error) {
    console.error("ERROR IN MAIN CHOICE BEING PICKED", error);
    alert("An error occurred in main choice. Please check the console.");
  }
}

//this function shows the CURRENT question based on the choice made
function showCurrentQuestion() {
  try {
    var pathNum = currentGameStatus.whichMainChoice; //get the path
    if (pathNum === null || allStories[pathNum] === undefined) {
      resetTheGame();
      showFirstChoices();
      return;
    }

    var currentStory = allStories[pathNum]; //get data for chosen story path
    var stepNum = currentGameStatus.stepNumber; //get current step

    //checking if the step is beyond the last step, then ending if true
    if (stepNum >= currentStory.phases.length) {
      showTheEnd();
      return;
    }

    //if it isnt finished, get the data for the current step
    var currentStepData = currentStory.phases[stepNum];
    currentGameStatus.currentStepName = "step" + (stepNum + 1);

    changeStoryText(currentStepData.text); //display question
    showRadioOptions(currentStepData.choices); //display choices
    updateTheBars();
    if (confirmButton) confirmButton.style.display = "block";

    if (pastSteps.length > 0) {
      if (backButton) backButton.style.display = "inline-block";
    } else {
      if (backButton) backButton.style.display = "none";
    }
  } catch (error) {
    console.error("ERROR SHOWING THE QUESTION", error);
    alert(
      "An error occurred while showing question. Please check the console."
    );
  }
}

//makes sure a choice was picked and moves to the next step
function confirmButtonClick(eventThing) {
  try {
    eventThing.preventDefault();

    //radio button that the user checked
    var radioButtons = choiceForm.querySelectorAll('input[name="phaseChoice"]');
    var checkedRadio = null;
    for (var i = 0; i < radioButtons.length; i++) {
      //if the radio button is checked store it
      if (radioButtons[i].checked) {
        checkedRadio = radioButtons[i];
        break;
      }
    }

    //if the user confirms but doesn't choose anything
    if (checkedRadio == null) {
      showMyAlert("Please pick one option.", false);
      return;
    }

    //get the choice number
    var choiceNumber = parseInt(checkedRadio.dataset.choiceIndex, 10);
    if (isNaN(choiceNumber)) {
      showMyAlert("INVALID CHOICE", false);
      return; //stop if not a number
    }

    //get the current game status
    var currentStepData =
      allStories[currentGameStatus.whichMainChoice].phases[
        currentGameStatus.stepNumber
      ];
    var theChosenOption = currentStepData.choices[choiceNumber];

    if (!theChosenOption) {
      showMyAlert(
        "ERROR CHOSEN OPTION NOT FOUND FOR CHOICE NUMBER " + choiceNumber,
        false
      );
      return; //stop if no option found
    }

    doTheChoice(theChosenOption);
  } catch (error) {
    console.error("ERROR CONFIRMING CHOICE", error);
    alert(
      "An error occurred while confirming choice. Please check the console."
    );
  }
}

//updates the village stats and moves forward based on the player’s pick
function doTheChoice(optionObj) {
  try {
    if (!optionObj) {
      showMyAlert(
        "doTheChoice WAS CALLED WITHOUT optionObj AS A PARAMETER",
        false
      );
      return;
    }
    rememberThisStep();
    updateVillageStats(currentVillageStatus, optionObj.impact);
    currentGameStatus.stepNumber = currentGameStatus.stepNumber + 1;

    showCurrentQuestion();
  } catch (error) {
    console.error("ERROR WITH CHOICE", error);
    alert("An error occurred with choice. Please check the console.");
  }
}

//lets the user undo their last step and go back
function goBackOneStep() {
  try {
    //check where to go back one step
    if (pastSteps.length > 0) {
      var previousStepInfo = pastSteps.pop();

      //go back to the previous step based on the saved state
      currentGameStatus = previousStepInfo.gameStatus;
      //go back to the previous village stats
      currentVillageStatus = new VillageInfo(
        previousStepInfo.villageStats.peopleHappy,
        previousStepInfo.villageStats.money,
        previousStepInfo.villageStats.water
      );

      if (currentGameStatus.currentStepName == "start") {
        showFirstChoices(); //show initial path choices if go back to start
      } else {
        showCurrentQuestion();
      }

      //only show back button if there are steps to go back to
      if (pastSteps.length == 0) {
        if (backButton) backButton.style.display = "none";
      } else {
        if (backButton) backButton.style.display = "inline-block";
      }

      //fade in animation for the story text
      if (storyDiv) {
        storyDiv.classList.remove("fadeOut");
        storyDiv.classList.add("storyFadeEffect");
      }
    }
  } catch (error) {
    console.error("ERROR GOING BACK", error);
    alert("An error occurred while going back. Please check the console.");
  }
}

//displays the final screen with feedback, stats, and restart button
function showTheEnd() {
  try {
    currentGameStatus.currentStepName = "theEnd"; //set the game to the end
    if (backButton) backButton.style.display = "none"; //get rid of back button (can't go back at the end)
    if (confirmButton) confirmButton.style.display = "none"; //get rid of confirm button (not needed at the end)

    //making sure game doesn't crash or behave weirdly when there is an invalid or missing choice
    var pathNum = currentGameStatus.whichMainChoice;
    if (pathNum === null || allStories[pathNum] === undefined) {
      changeStoryText("ERROR SHOWING THE SUMMARY");
      if (choicesDiv) choicesDiv.innerHTML = "";
      return;
    }
    var chosenStoryInfo = allStories[pathNum];

    //summary text for the end showing all data necessary for the user
    var summaryText =
      "The simulation for <strong>" +
      villageInputName +
      "</strong> has concluded, Leader <strong>" +
      userName +
      "</strong>.<br/><br/>";
    summaryText +=
      'You chose the path: "<strong>' +
      chosenStoryInfo.name +
      '</strong>".<br/><br/>';
    summaryText += "<strong>Final Village Status:</strong><br/>";
    summaryText += "<ul>";
    summaryText +=
      "<li>Community Support: <strong>" +
      currentVillageStatus.peopleHappy +
      "%</strong> " +
      getPeopleFeedback(currentVillageStatus.peopleHappy) +
      "</li>";
    summaryText +=
      "<li>Funding Level: <strong>" +
      currentVillageStatus.money +
      "%</strong> " +
      getMoneyFeedback(currentVillageStatus.money) +
      "</li>";
    summaryText +=
      "<li>Water Level: <strong>" +
      currentVillageStatus.water +
      "%</strong> " +
      getWaterFeedback(currentVillageStatus.water) +
      "</li>";
    summaryText += "</ul><br/>";

    //CALCULATE OVERALL SCORE
    var totalScore =
      currentVillageStatus.peopleHappy +
      currentVillageStatus.money +
      currentVillageStatus.water;
    var averageScore = Math.round(totalScore / 3); //rounding to nearest whole number
    summaryText +=
      "<strong>Overall Assessment:</strong> " +
      getFinalFeedback(averageScore) +
      "<br/><br/>";
    summaryText +=
      "This simulation highlights the difficult choices and trade-offs involved in managing water resources. Every decision has consequences.<br/><br/>";

    if (chosenStoryInfo && chosenStoryInfo.infoLink) {
      var lowerCaseName = chosenStoryInfo.name.toLowerCase();
      summaryText +=
        "Choosing to " +
        lowerCaseName +
        " is a difficult endeavour. Find out more about how similar projects work in the real world: ";
      summaryText +=
        '<a href="' +
        chosenStoryInfo.infoLink +
        '" target="_blank" rel="noopener noreferrer">Learn More Here</a><br/><br/>';
    }

    //adds the date to the summary
    summaryText += "Date Completed: " + getTodayDate();

    changeStoryText(summaryText);
    if (choicesDiv) choicesDiv.innerHTML = "";

    //play again button
    var restartButtonElement = document.createElement("button");
    restartButtonElement.textContent = "Play Again";
    restartButtonElement.id = "restartButton";
    restartButtonElement.onclick = function () {
      showMyAlert(
        "You are about to replay the simulation and lose your current progress. Are you sure?",
        true,
        function () {
          //if ok is clicked then this happens:
          if (storyDiv) storyDiv.classList.add("fadeOut");
          //waits for the fade animation to finish before resetting the game
          setTimeout(function () {
            resetTheGame();
            if (infoForm) infoForm.style.display = "flex";
            if (gameDiv) gameDiv.style.display = "none";
            if (storyDiv) storyDiv.classList.remove("fadeOut");
            var navDiv = document.getElementById("navButtonsDiv");
            if (navDiv) {
              navDiv.innerHTML = "";
              navDiv.appendChild(backButton);
              backButton.style.display = "none";
            }
            showFirstChoices();
          }, 400);
        }
      );
    };

    var navDiv = document.getElementById("navButtonsDiv");
    if (navDiv) {
      navDiv.innerHTML = "";
      navDiv.appendChild(restartButtonElement);
      navDiv.style.display = "block";
      navDiv.style.textAlign = "center";
    }
    updateTheBars();
  } catch (error) {
    console.error("ERROR SHOWING THE SUMMARY AT THE END", error);
    alert("An error occurred while showing summary. Please check the console.");
  }
}

//saves the current step and stats so the game can go back if needed
function rememberThisStep() {
  try {
    //create copies of the current state so that we don't change the saved version
    var gameStatusCopy = {};
    gameStatusCopy.currentStepName = currentGameStatus.currentStepName;
    gameStatusCopy.whichMainChoice = currentGameStatus.whichMainChoice;
    gameStatusCopy.stepNumber = currentGameStatus.stepNumber;

    var villageStatsCopy = {};
    villageStatsCopy.peopleHappy = currentVillageStatus.peopleHappy;
    villageStatsCopy.money = currentVillageStatus.money;
    villageStatsCopy.water = currentVillageStatus.water;

    pastSteps.push({
      gameStatus: gameStatusCopy,
      villageStats: villageStatsCopy,
    });
  } catch (error) {
    console.error("ERROR REMEMBERING THE STEP", error);
  }
}

//replaces the story text smoothly with the fancy fade effect on the screen
function changeStoryText(newText) {
  try {
    if (storyDiv) {
      storyDiv.classList.add("fadeOut");
      setTimeout(function () {
        if (storyParagraph) storyParagraph.innerHTML = newText;
        storyDiv.classList.remove("fadeOut");
      }, 200);
    }
  } catch (error) {
    console.error("ERROR CHANGING THE TEXT IN THE STORY", error);
    if (storyParagraph) storyParagraph.innerHTML = newText; //fallback if animation fails
  }
}

//creates and shows the list of choices as radio buttons
function showRadioOptions(optionsArray) {
  try {
    if (!choicesDiv) return;
    choicesDiv.innerHTML = "";
    //go through each choice in the array
    for (var i = 0; i < optionsArray.length; i++) {
      var currentOption = optionsArray[i];
      var optionId = "option_" + currentGameStatus.stepNumber + "_" + i;

      var divElement = document.createElement("div");
      divElement.className = "choiceItem";

      var labelElement = document.createElement("label");
      labelElement.htmlFor = optionId;

      var radioElement = document.createElement("input");
      radioElement.type = "radio";
      radioElement.id = optionId;
      radioElement.name = "phaseChoice";
      radioElement.value = i;
      radioElement.dataset.choiceIndex = i; //store index in data attribute

      labelElement.appendChild(radioElement);

      var textNode = document.createTextNode(" " + currentOption.text);
      labelElement.appendChild(textNode);

      divElement.appendChild(labelElement);
      choicesDiv.appendChild(divElement);
    }
    if (confirmButton) confirmButton.style.display = "block";
  } catch (error) {
    console.error("ERROR SHOWING THE OPTIONS", error);
    alert("An error occurred while showing options. Please check the console.");
  }
}

//function that creates and shows the first choices
function showButtonOptions(optionsArray) {
  try {
    if (!choicesDiv) return;
    choicesDiv.innerHTML = ""; // this clears choices before adding new things, used it above as well in other places
    if (confirmButton) confirmButton.style.display = "none";
    for (var i = 0; i < optionsArray.length; i++) {
      var buttonElement = document.createElement("button");
      buttonElement.innerHTML = optionsArray[i].buttonText;
      buttonElement.onclick = optionsArray[i].buttonAction;
      buttonElement.className = "choiceButtonStyle";
      choicesDiv.appendChild(buttonElement);
    }
  } catch (error) {
    console.error("ERROR SHOWING BUTTON OPTIONS", error);
    alert(
      "An error occurred while showing button options. Please check the console."
    );
  }
}

//updates the visual progress bars for happiness, money, and water
function updateTheBars() {
  try {
    //checks for all the progress
    if (
      !progressBarFill ||
      !peopleBar ||
      !moneyBar ||
      !waterBar ||
      !peopleValue ||
      !moneyValue ||
      !waterValue
    ) {
      return;
    }

    //calculate the progress
    var numberOfSteps = 0;
    if (
      currentGameStatus.whichMainChoice !== null &&
      allStories[currentGameStatus.whichMainChoice]
    ) {
      numberOfSteps =
        allStories[currentGameStatus.whichMainChoice].phases.length;
    }
    var currentStep = currentGameStatus.stepNumber;
    var progressPercent = 0;

    if (currentGameStatus.currentStepName == "theEnd") {
      progressPercent = 100;
    } else if (
      currentGameStatus.currentStepName != "start" &&
      currentGameStatus.currentStepName != "form" &&
      numberOfSteps > 0
    ) {
      progressPercent = Math.round((currentStep / numberOfSteps) * 100);
    }
    progressBarFill.style.width = progressPercent + "%";
    progressBarFill.textContent = progressPercent + "%";

    //fr community support
    var happyPercent = currentVillageStatus.peopleHappy;
    if (happyPercent < 0) {
      happyPercent = 0;
    }
    if (happyPercent > 100) {
      happyPercent = 100;
    }
    happyPercent = Math.round(happyPercent);

    //for funding
    var moneyPercent = currentVillageStatus.money;
    if (moneyPercent < 0) {
      moneyPercent = 0;
    }
    if (moneyPercent > 100) {
      moneyPercent = 100;
    }
    moneyPercent = Math.round(moneyPercent);

    //for water level
    var waterPercent = currentVillageStatus.water;
    if (waterPercent < 0) {
      waterPercent = 0;
    }
    if (waterPercent > 100) {
      waterPercent = 100;
    }
    waterPercent = Math.round(waterPercent);

    peopleBar.style.width = happyPercent + "%";
    peopleValue.textContent = happyPercent + "%";
    moneyBar.style.width = moneyPercent + "%";
    moneyValue.textContent = moneyPercent + "%";
    waterBar.style.width = waterPercent + "%";
    waterValue.textContent = waterPercent + "%";
  } catch (error) {
    console.error("ERROR UPDATING THE BARS", error);
  }
}

//function that gets the date and format as DD/MM/YYYY
function getTodayDate() {
  try {
    var today = new Date();
    var dayNum = today.getDate();
    var monthNum = today.getMonth() + 1; //bcz months are 0-indexed
    var yearNum = today.getFullYear();

    //convert to string
    var dayStr = String(dayNum);
    if (dayNum < 10) {
      dayStr = "0" + dayNum;
    }
    var monthStr = String(monthNum);
    if (monthNum < 10) {
      monthStr = "0" + monthNum;
    }

    var dateText = dayStr + "/" + monthStr + "/" + yearNum;
    return dateText;
  } catch (error) {
    console.error("ERROR GETTING THE DATE", error);
    return "N/A"; //return a fallback
  }
}

//all of these functions will give the user feedback based on a scores for the different categories
function getPeopleFeedback(value) {
  if (value >= 80) return "(Excellent!)";
  if (value >= 60) return "(Good)";
  if (value >= 40) return "(Fair)";
  if (value >= 20) return "(Poor)";
  return "(Very Poor)";
}
function getMoneyFeedback(value) {
  if (value >= 80) return "(Well Funded)";
  if (value >= 60) return "(Adequate Funding)";
  if (value >= 40) return "(Funding Concerns)";
  if (value >= 20) return "(Financial Strain)";
  return "(Critically Low Funds)";
}
function getWaterFeedback(value) {
  if (value >= 80) return "(Abundant)";
  if (value >= 60) return "(Sufficient)";
  if (value >= 40) return "(Stable but Limited)";
  if (value >= 20) return "(Scarcity Warning)";
  return "(Critical Shortage)";
}
function getFinalFeedback(score) {
  if (score >= 80) return "Your leadership led to outstanding results!";
  if (score >= 60) return "A commendable effort with positive outcomes.";
  if (score >= 40)
    return "A challenging situation managed with mixed results. Lessons were learned.";
  if (score >= 20)
    return "The village faced significant struggles under your plan.";
  return "The situation became dire. Rethinking the strategy is essential.";
}

//functions for the popup alert
var okButtonAction = null;
//shows custom popup
function showMyAlert(textMessage, showCancelButton, functionToRunOnOk) {
  try {
    //this checks if the popup elements exist first
    if (
      !myAlertPopupBackground ||
      !myAlertText ||
      !myAlertOkButton ||
      !myAlertCancelButton
    ) {
      //fallback to normal alert
      console.warn("Custom alert elements not found, using native dialogs.");
      if (showCancelButton) {
        if (confirm(textMessage)) {
          if (functionToRunOnOk) {
            functionToRunOnOk();
          }
        }
      } else {
        alert(textMessage);
        if (functionToRunOnOk) {
          functionToRunOnOk();
        }
      }
      return;
    }

    myAlertText.textContent = textMessage;
    okButtonAction = functionToRunOnOk;

    if (showCancelButton == true) {
      myAlertCancelButton.style.display = "inline-block";
    } else {
      myAlertCancelButton.style.display = "none";
    }

    myAlertPopupBackground.style.display = "flex";
    setTimeout(() => {
      myAlertPopupBackground.classList.add("visible");
      if (myAlertPopupBox) myAlertPopupBox.classList.add("visible");
    }, 10);
  } catch (error) {
    console.error("ERROR SHOWING ALERT", error);
    //fallback alert if custom fails catastrophically
    alert(textMessage);
    if (!showCancelButton && functionToRunOnOk) {
      functionToRunOnOk();
    }
  }
}

//hides the custom popup
function hideMyAlert() {
  try {
    if (!myAlertPopupBackground) {
      return;
    }
    myAlertPopupBackground.classList.remove("visible");
    if (myAlertPopupBox) myAlertPopupBox.classList.remove("visible");

    setTimeout(function () {
      if (myAlertPopupBackground) myAlertPopupBackground.style.display = "none";
      okButtonAction = null;
    }, 300);
  } catch (error) {
    console.error("ERROR HIDING ALERT", error);
    //IF custom hiding fails, ensure it's at least hidden
    if (myAlertPopupBackground) myAlertPopupBackground.style.display = "none";
  }
}

//COOKUES
//function to grt a cookie value
function getTheCookie(cookieName) {
  try {
    var allCookiesString = document.cookie; //get cookie
    //split into indiviudal cookies (using the ;)
    var listOfCookies = allCookiesString.split(";");

    //loop through all cookies
    for (var i = 0; i < listOfCookies.length; i++) {
      var oneCookie = listOfCookies[i];
      //remove spaces
      while (oneCookie.charAt(0) == " ") {
        oneCookie = oneCookie.substring(1);
      }

      var nameToFind = cookieName + "=";
      if (oneCookie.indexOf(nameToFind) == 0) {
        var value = oneCookie.substring(nameToFind.length, oneCookie.length);
        try {
          return decodeURIComponent(value);
        } catch (e) {
          console.error("ERROR DECODING COOKIE " + cookieName + ":", value, e);
          return value; //return raw value if decoding fails
        }
      }
    }
  } catch (error) {
    console.error("ERROR GETTING COOKIE " + cookieName + ":", error);
  }
  return null; //if there is no cookie
}

//function to apply colour blind mode
function applyColourBlindMode(isEnabled) {
  if (isEnabled) {
    document.body.classList.add("colour-blind-mode");
  } else {
    document.body.classList.remove("colour-blind-mode");
  }
}

//event listener for the colour blind toggle
if (colourBlindToggle) {
  colourBlindToggle.addEventListener("change", function () {
    try {
      applyColourBlindMode(this.checked);
      localStorage.setItem("colourBlindModeEnabled", this.checked);
    } catch (error) {
      console.error("Error handling colour blind toggle:", error);
    }
  });
}

//load colour-blind mode choice on page load
function loadColourBlindPreference() {
  try {
    const isEnabled = localStorage.getItem("colourBlindModeEnabled") === "true";
    if (colourBlindToggle) {
      colourBlindToggle.checked = isEnabled;
    }
    applyColourBlindMode(isEnabled);
  } catch (error) {
    console.error("Error loading colour blind preference:", error);
  }
}

//event lisreners
//the big setup function that runs when the page loads
document.addEventListener("DOMContentLoaded", function () {
  try {
    storyDiv = document.getElementById("storyDiv");
    storyParagraph = document.getElementById("storyParagraph");
    choicesDiv = document.getElementById("choicesDiv");
    infoForm = document.getElementById("infoForm");
    gameDiv = document.getElementById("gameDiv");
    backButton = document.getElementById("backButton");
    choiceForm = document.getElementById("choiceForm");
    confirmButton = document.getElementById("confirmButton");

    progressBarFill = document.getElementById("progressBarFill");
    peopleBar = document.getElementById("peopleBar");
    moneyBar = document.getElementById("moneyBar");
    waterBar = document.getElementById("waterBar");
    peopleValue = document.getElementById("peopleValue");
    moneyValue = document.getElementById("moneyValue");
    waterValue = document.getElementById("waterValue");

    myAlertPopupBackground = document.getElementById("myAlertPopupBackground");
    myAlertPopupBox = document.getElementById("myAlertPopupBox");
    myAlertText = document.getElementById("myAlertText");
    myAlertOkButton = document.getElementById("myAlertOkButton");
    myAlertCancelButton = document.getElementById("myAlertCancelButton");

    colourBlindToggle = document.getElementById("colourBlindToggle");
    loadColourBlindPreference();

    //getting names from cookies
    var savedUser = getTheCookie("userName");
    var savedVillage = getTheCookie("villageName");

    var nameInputBox = document.getElementById("userInputName");
    var villageInputBox = document.getElementById("villageInputName");

    if (savedUser != null && nameInputBox != null) {
      nameInputBox.value = savedUser;
      userName = savedUser;
    }

    if (savedVillage != null && villageInputBox != null) {
      villageInputBox.value = savedVillage;
      villageInputName = savedVillage;
    }

    if (infoForm) {
      infoForm.addEventListener("submit", startButtonClick);
    } else {
      console.error("ERROR infoForm IS NOT FOUND!!!");
    }

    if (backButton) {
      backButton.addEventListener("click", goBackOneStep);
    } else {
      console.error("ERROR backButton IS NOT FOUND!!!");
    }

    if (choiceForm) {
      choiceForm.addEventListener("submit", confirmButtonClick);
    } else {
      console.error("ERROR choiceForm IS NOT FOUND!!!");
    }

    if (myAlertOkButton) {
      myAlertOkButton.addEventListener("click", function () {
        try {
          if (okButtonAction) {
            okButtonAction();
          }
          hideMyAlert();
        } catch (e) {
          console.error("ERROR IN OK BUTTON:", e);
          hideMyAlert(); //ensure popup hides anyway
        }
      });
    }
    if (myAlertCancelButton) {
      myAlertCancelButton.addEventListener("click", function () {
        hideMyAlert();
      });
    }

    if (colourBlindToggle) {
      colourBlindToggle.addEventListener("change", function () {
        try {
          applyColourBlindMode(this.checked);
          localStorage.setItem("colourBlindModeEnabled", this.checked);
        } catch (error) {
          console.error("Error handling colour blind toggle:", error);
        }
      });
    } else {
      console.error(
        "colourBlindToggle element not found after DOMContentLoaded"
      );
    }

    // variables to get the menu elements
    var menuToggleButton = document.querySelector(".menuButton");
    var menuDiv = document.querySelector(".menuLinks");
    var mainContentArea = document.querySelector(".mainArea");
    var footerContentArea = document.querySelector(".footerContent");

    //check if all the menu elements are there
    if (menuToggleButton && menuDiv && mainContentArea && footerContentArea) {
      menuToggleButton.addEventListener("click", function (event) {
        try {
          event.stopPropagation();
          menuDiv.classList.toggle("active");
          var isActive = menuDiv.classList.contains("active");

          if (window.innerWidth > 992) {
            mainContentArea.style.marginLeft = isActive ? "170px" : "20px";
            footerContentArea.style.paddingLeft = isActive ? "170px" : "20px";
          } else {
            mainContentArea.style.marginLeft = "20px";
            footerContentArea.style.paddingLeft = "20px";
          }
        } catch (e) {
          console.error("ERROR IN MENU ", e);
        }
      });

      document.addEventListener("click", function (event) {
        try {
          var clickedElement = event.target;
          if (
            !clickedElement.closest(".menuBar") &&
            menuDiv.classList.contains("active")
          ) {
            menuDiv.classList.remove("active");
            if (window.innerWidth > 992) {
              mainContentArea.style.marginLeft = "20px";
              footerContentArea.style.paddingLeft = "20px";
            }
          }
        } catch (e) {
          console.error("ERROR IN DOCUMENT CLICK FOR MENU:", e);
        }
      });

      var menuLinksList = menuDiv.querySelectorAll("a");
      for (var i = 0; i < menuLinksList.length; i++) {
        menuLinksList[i].addEventListener("click", function (event) {
          try {
            var linkTarget = this.getAttribute("href");
            if (linkTarget && linkTarget.startsWith("#")) {
              event.preventDefault();
              var targetElement = document.querySelector(linkTarget);
              if (targetElement) {
                var topBarHeight =
                  document.querySelector(".topBar")?.offsetHeight || 100;
                var menuButtonHeight = 0;
                if (window.innerWidth <= 992) {
                  menuButtonHeight =
                    document.querySelector(".menuButton")?.offsetHeight || 45;
                }
                var headerHeight = topBarHeight;
                if (
                  window.innerWidth <= 992 &&
                  !menuDiv.classList.contains("active")
                )
                  var elementPos = targetElement.getBoundingClientRect().top;
                var scrollToPos =
                  elementPos + window.pageYOffset - headerHeight;

                if (linkTarget === "#gameSection" && window.innerWidth <= 992) {
                  let menuBarMobileHeight =
                    document.querySelector(".menuBar")?.offsetHeight || 45;
                  if (!menuDiv.classList.contains("active")) {
                    // if menu is closed
                    scrollToPos =
                      elementPos +
                      window.pageYOffset -
                      topBarHeight -
                      menuBarMobileHeight;
                  } else {
                    // if menu is open, it will cover part of top
                    scrollToPos =
                      elementPos + window.pageYOffset - topBarHeight;
                  }
                }

                window.scrollTo({ top: scrollToPos, behavior: "smooth" });

                if (menuDiv.classList.contains("active")) {
                  menuDiv.classList.remove("active");
                  if (window.innerWidth > 992) {
                    mainContentArea.style.marginLeft = "20px";
                    footerContentArea.style.paddingLeft = "20px";
                  }
                }
              }
            }
          } catch (e) {
            console.error("ERROR IN MENU LINK CLICK:", e);
          }
        });
      }
    } else {
      console.error(
        "ERROR, ONE OR MORE MENU ELEMENTS NOT FOUND: menuToggleButton, menuDiv, mainContentArea, or footerContentArea"
      );
    }

    //dropdown sections
    var allDropdownButtons = document.querySelectorAll(".dropdownButton");
    for (var i = 0; i < allDropdownButtons.length; i++) {
      allDropdownButtons[i].addEventListener("click", function (event) {
        try {
          event.stopPropagation();
          var thisDropdownContent = this.nextElementSibling;

          if (
            !thisDropdownContent ||
            !thisDropdownContent.classList.contains("dropdownInfo")
          ) {
            console.error("ERROR, CAN'T FIND DROPDOWN INFO FOR BUTTON:", this);
            return;
          }

          var wasActive = thisDropdownContent.classList.contains("active");

          var allActiveDropdownContents = document.querySelectorAll(
            ".dropdownInfo.active"
          );
          for (var j = 0; j < allActiveDropdownContents.length; j++) {
            if (allActiveDropdownContents[j] !== thisDropdownContent) {
              allActiveDropdownContents[j].classList.remove("active");
              var otherButton =
                allActiveDropdownContents[j].previousElementSibling;
              if (
                otherButton &&
                otherButton.classList.contains("dropdownButton")
              ) {
                otherButton.classList.remove("active");
              }
            }
          }

          if (wasActive) {
            thisDropdownContent.classList.remove("active");
            this.classList.remove("active");
          } else {
            thisDropdownContent.classList.add("active");
            this.classList.add("active");
          }
        } catch (e) {
          console.error("ERROR IN DROPDOWN BUTTON CLICK:", e);
        }
      });
    }

    document.addEventListener("click", function (event) {
      try {
        if (!event.target.closest(".aDropdown")) {
          var allDropdownContents = document.querySelectorAll(
            ".dropdownInfo.active"
          );
          for (var i = 0; i < allDropdownContents.length; i++) {
            allDropdownContents[i].classList.remove("active");
            var button = allDropdownContents[i].previousElementSibling;
            if (button && button.classList.contains("dropdownButton")) {
              button.classList.remove("active");
            }
          }
        }
      } catch (e) {
        console.error("ERROR IN DOCUMENT CLICK FOR DROPDOWN:", e);
      }
    });

    var yearSpan = document.getElementById("copyrightYear");
    if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear();
    }
  } catch (mainError) {
    console.error("ERROR LOADING THE PAGE!", mainError);
    alert(
      "A critical error occurred while loading the page. Please check the console."
    );
  }
});
