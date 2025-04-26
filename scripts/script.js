//function to store the village status
function VillageInfo(peopleHappy = 50, money = 50, water = 50) {
  this.peopleHappy = peopleHappy;
  this.money = money;
  this.water = water;
}

//updates the village's status based on the impact of a choice
function update_village_stats(village_obj, impact_obj) {
  if (impact_obj.support !== undefined) {
    //get the current value from the village object
    var current_happy = village_obj.peopleHappy;
    //get the change amount from the impact object
    var change_happy = impact_obj.support;
    //calculate the new value
    var new_happy = current_happy + change_happy;
    //make sure happiness doesn't go below 0
    if (new_happy < 0) {
      new_happy = 0;
    }
    //make sure it doesn't go above 100
    if (new_happy > 100) {
      new_happy = 100;
    }
    //update the village object with the new value
    village_obj.peopleHappy = new_happy;
  }

  if (impact_obj.funding !== undefined) {
    var current_money = village_obj.money;
    var change_money = impact_obj.funding;
    var new_money = current_money + change_money;
    if (new_money < 0) {
      new_money = 0;
    }
    if (new_money > 100) {
      new_money = 100;
    }
    village_obj.money = new_money;
  }
  if (impact_obj.waterLevel !== undefined) {
    var current_water = village_obj.water;
    var change_water = impact_obj.waterLevel;
    var new_water = current_water + change_water;
    if (new_water < 0) {
      new_water = 0;
    }
    if (new_water > 100) {
      new_water = 100;
    }
    village_obj.water = new_water;
  }
}

//declating global variables
var first_village_status = new VillageInfo(); //initial village status (which will be used for resetting)
var current_village_status = new VillageInfo(); //village status that changes during the game
//information about where the player is in the game
var current_game_status = {
  current_step_name: "form",
  which_main_choice: null,
  step_number: 0,
};
var past_steps = []; //to remember the previous steps taken
var user_name = ""; //variable to store the player's name
var village_input_name = ""; //variable to store the village name

//getting html elements by their IDs
var story_div = document.getElementById("story_div"); //story text area
var story_paragraph = document.getElementById("story_paragraph"); //paragraph of the story text
var choices_div = document.getElementById("choices_div"); //choice buttons/radios
var info_form = document.getElementById("info_form"); //form where the user enters their name and village
var game_div = document.getElementById("game_div"); //game/simulation div
var back_button = document.getElementById("back_button"); //back button
var choice_form = document.getElementById("choice_form"); //form holds the radio button choices
var confirm_button = document.getElementById("confirm_button"); //confirm choice button

//getting progress bar elements
var progress_bar_fill = document.getElementById("progress_bar_fill"); //filling part of the main progress bar
var people_bar = document.getElementById("people_bar"); //filling part of the community support bar
var money_bar = document.getElementById("money_bar"); //filling part of the money bar
var water_bar = document.getElementById("water_bar"); //filling part of the water bar
var people_value = document.getElementById("people_value"); //community support percentage
var money_value = document.getElementById("money_value"); //money percentage
var water_value = document.getElementById("water_value"); //water percentage

//popup alert elements
//overlay for the popup
var my_alert_popup_background = document.getElementById(
  "my_alert_popup_background"
);
var my_alert_popup_box = document.getElementById("my_alert_popup_box"); //white box for the popup message
var my_alert_text = document.getElementById("my_alert_text"); //paragraph for popup message
var my_alert_ok_button = document.getElementById("my_alert_ok_button"); //ok button
var my_alert_cancel_button = document.getElementById("my_alert_cancel_button"); //cancel button

//data for the story paths and phases
//holds all data for the simulation paths
var all_stories = [
  {
    //choice name
    name: "Dig a Well",
    //resource
    info_link:
      "https://washmatters.wateraid.org/publications/technology-issue-sheet-2007",
    phases: [
      //phases for path
      {
        text: "Phase 1: Digging involves careful planning. How will you approach finding the right spot and method?", // Question text
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
    info_link:
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
    info_link:
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
    info_link: "https://thewaterproject.org/sand-dams",
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
//function for first form submissiom
function start_button_click(event_thing) {
  event_thing.preventDefault(); //stop the page from reloading on submit
  user_name = document.getElementById("user_input_name").value.trim(); //get name and remove spaces
  //get name and remove spaces
  village_input_name = document
    .getElementById("village_input_name")
    .value.trim();

  //check if user left fields empty
  if (user_name == "" || village_input_name == "") {
    alert("Please type your name and village name.");
    return;
  }

  //storing names in cookies and make sure special characters in names are saved correctly
  document.cookie = "user_name=" + encodeURIComponent(user_name);
  document.cookie = "village_name=" + encodeURIComponent(village_input_name);

  //show custom popup
  show_my_alert("You are about to begin the simulation.", false, function () {
    info_form.style.display = "none"; //hide the form
    game_div.style.display = "block"; //show main game area
    reset_the_game(); //reset all variables
    show_first_choices(); //show the initial choices
  });
}

//reset game to initial state function
function reset_the_game() {
  current_village_status = new VillageInfo(); //create new village
  //reset progress
  current_game_status = {
    current_step_name: "start",
    which_main_choice: null,
    step_number: 0,
  };
  past_steps = [];
  update_the_bars();
  back_button.style.display = "none"; //hide button
  confirm_button.style.display = "none"; //hide button
}

//show initial choices function
function show_first_choices() {
  current_game_status.current_step_name = "start";

  var welcome_text = "Welcome, Leader <strong>" + user_name + "</strong>! ";
  welcome_text +=
    "The village of <strong>" + village_input_name + "</strong> needs water. ";
  welcome_text += "Choose your first big plan:";
  change_story_text(welcome_text);

  var button_options = [];
  //loop through each path
  for (var i = 0; i < all_stories.length; i++) {
    //make sure each button remembers correct 'i' value
    var make_action_func = function (index_num) {
      return function () {
        main_choice_picked(index_num); //correct path number passed
      };
    };
    //add object to list
    button_options.push({
      button_text: all_stories[i].name,
      button_action: make_action_func(i),
    });
  }
  show_button_options(button_options);
  update_the_bars(); //update progress bars
  back_button.style.display = "none";
  confirm_button.style.display = "none";
}

//this function handles what happens when the user picks a main choice in the game.
function main_choice_picked(choice_number) {
  remember_this_step(); //saves state so user can go back
  current_game_status.which_main_choice = choice_number; //store path user picked
  current_game_status.step_number = 0;
  current_game_status.current_step_name = "step1";
  show_current_question();
}

//this function shows the CURRENT question based on the choice made
function show_current_question() {
  var path_num = current_game_status.which_main_choice; //get the path
  if (path_num === null || all_stories[path_num] === undefined) {
    reset_the_game();
    show_first_choices();
    return;
  }

  var current_story = all_stories[path_num]; //get data for chosen story path
  var step_num = current_game_status.step_number; //get current step

  //checking if the step is beyond the last step, then ending if true
  if (step_num >= current_story.phases.length) {
    show_the_end();
    return;
  }

  //if it isnt finished, get the data for the current step
  var current_step_data = current_story.phases[step_num];
  current_game_status.current_step_name = "step" + (step_num + 1);

  change_story_text(current_step_data.text); //display question
  show_radio_options(current_step_data.choices); //display choices
  update_the_bars();
  confirm_button.style.display = "block";

  if (past_steps.length > 0) {
    back_button.style.display = "inline-block";
  } else {
    back_button.style.display = "none";
  }
}

//function for when the user confirms their choice
function confirm_button_click(event_thing) {
  event_thing.preventDefault();

  //radio button that the user checked
  var radio_buttons = choice_form.querySelectorAll('input[name="phaseChoice"]');
  var checked_radio = null;
  for (var i = 0; i < radio_buttons.length; i++) {
    //if the radio button is checked store it
    if (radio_buttons[i].checked) {
      checked_radio = radio_buttons[i];
      break;
    }
  }

  //if the user confirms but doesn't choose anything
  if (checked_radio == null) {
    alert("Please pick one option.");
    return;
  }

  //get the choice number
  var choice_number = parseInt(checked_radio.dataset.choiceIndex, 10);
  if (isNaN(choice_number)) {
    return; //stop if not a number
  }

  //get the current game status
  var current_step_data =
    all_stories[current_game_status.which_main_choice].phases[
      current_game_status.step_number
    ];
  var the_chosen_option = current_step_data.choices[choice_number];

  if (!the_chosen_option) {
    return; //stop if no option found
  }

  do_the_choice(the_chosen_option);
}

//function that processes the choice
function do_the_choice(option_obj) {
  if (!option_obj) {
    return;
  }
  remember_this_step();
  update_village_stats(current_village_status, option_obj.impact);
  current_game_status.step_number = current_game_status.step_number + 1;

  show_current_question();
}

//function for go back button
function go_back_one_step() {
  //check where to go back one step
  if (past_steps.length > 0) {
    var previous_step_info = past_steps.pop();

    //go back to the previous step based on the saved state
    current_game_status = previous_step_info.game_status;
    //go back to the previous village stats
    current_village_status = new VillageInfo(
      previous_step_info.village_stats.peopleHappy,
      previous_step_info.village_stats.money,
      previous_step_info.village_stats.water
    );

    if (current_game_status.current_step_name == "start") {
      show_first_choices(); //show initial path choices if go back to start
    } else {
      show_current_question();
    }

    //only show back button if there are steps to go back to
    if (past_steps.length == 0) {
      back_button.style.display = "none";
    } else {
      back_button.style.display = "inline-block";
    }

    //fade in animation for the story text
    story_div.classList.remove("fade-out");
    story_div.classList.add("story_fade_effect");
  }
}

//function for the summary at the end
function show_the_end() {
  current_game_status.current_step_name = "the_end"; //set the game to the end
  back_button.style.display = "none"; //get rid of back button (can't go back at the end)
  confirm_button.style.display = "none"; //get rid of confirm button (not needed at the end)

  //making sure game doesn't crash or behave weirdly when there is an invalid or missing choice
  var path_num = current_game_status.which_main_choice;
  if (path_num === null || all_stories[path_num] === undefined) {
    change_story_text("ERROR SHOWING THE SUMNMARY");
    choices_div.innerHTML = "";
    return;
  }
  var chosen_story_info = all_stories[path_num];

  //summary text for the end showing all data necessary for the user
  var summary_text =
    "The simulation for <strong>" +
    village_input_name +
    "</strong> has concluded, Leader <strong>" +
    user_name +
    "</strong>.<br/><br/>";
  summary_text +=
    'You chose the path: "<strong>' +
    chosen_story_info.name +
    '</strong>".<br/><br/>';
  summary_text += "<strong>Final Village Status:</strong><br/>";
  summary_text += "<ul>";
  summary_text +=
    "<li>Community Support: <strong>" +
    current_village_status.peopleHappy +
    "%</strong> " +
    get_people_feedback(current_village_status.peopleHappy) +
    "</li>";
  summary_text +=
    "<li>Funding Level: <strong>" +
    current_village_status.money +
    "%</strong> " +
    get_money_feedback(current_village_status.money) +
    "</li>";
  summary_text +=
    "<li>Water Level: <strong>" +
    current_village_status.water +
    "%</strong> " +
    get_water_feedback(current_village_status.water) +
    "</li>";
  summary_text += "</ul><br/>";

  //CALCULATE OVERALL SCORE
  var total_score =
    current_village_status.peopleHappy +
    current_village_status.money +
    current_village_status.water;
  var average_score = Math.round(total_score / 3); //rounding to nearest whole number
  summary_text +=
    "<strong>Overall Assessment:</strong> " +
    get_final_feedback(average_score) +
    "<br/><br/>";
  summary_text +=
    "This simulation highlights the difficult choices and trade-offs involved in managing water resources. Every decision has consequences.<br/><br/>";

  if (chosen_story_info && chosen_story_info.info_link) {
    var lower_case_name = chosen_story_info.name.toLowerCase();
    summary_text +=
      "Choosing to " +
      lower_case_name +
      " is a difficult endeavour. Find out more about how similar projects work in the real world: ";
    summary_text +=
      '<a href="' +
      chosen_story_info.info_link +
      '" target="_blank" rel="noopener noreferrer">Learn More Here</a><br/><br/>';
  }

  //adds the date to the summary
  summary_text += "Date Completed: " + get_today_date();

  change_story_text(summary_text);
  choices_div.innerHTML = "";

  //play again button
  var restart_button = document.createElement("button");
  restart_button.textContent = "Play Again";
  restart_button.id = "restart_button";
  restart_button.onclick = function () {
    show_my_alert(
      "You are about to replay the simulation and lose your current progress. Are you sure?",
      true,
      function () {
        //if ok is clicked then this happens:
        story_div.classList.add("fade-out");
        //waits for the fade animation to finish before resetting the game
        setTimeout(function () {
          reset_the_game();
          info_form.style.display = "flex";
          game_div.style.display = "none";
          story_div.classList.remove("fade-out");
        }, 400);
      }
    );
  };

  var nav_div = document.getElementById("nav_buttons_div");
  nav_div.innerHTML = "";
  nav_div.appendChild(restart_button);
  nav_div.style.display = "block";
  nav_div.style.textAlign = "center";
  update_the_bars();
}

//functions saves the current game state
function remember_this_step() {
  //create copies of the current state so that we don't change the saved version
  var game_status_copy = {};
  game_status_copy.current_step_name = current_game_status.current_step_name;
  game_status_copy.which_main_choice = current_game_status.which_main_choice;
  game_status_copy.step_number = current_game_status.step_number;

  var village_stats_copy = {};
  village_stats_copy.peopleHappy = current_village_status.peopleHappy;
  village_stats_copy.money = current_village_status.money;
  village_stats_copy.water = current_village_status.water;

  past_steps.push({
    game_status: game_status_copy,
    village_stats: village_stats_copy,
  });
}

//function that changes story text with fancy fade effect
function change_story_text(new_text) {
  story_div.classList.add("fade-out");
  setTimeout(function () {
    story_paragraph.innerHTML = new_text;
    story_div.classList.remove("fade-out");
  }, 200);
}

//function that will create and show the choices
function show_radio_options(options_array) {
  choices_div.innerHTML = "";
  //go through each choice in the array
  for (var i = 0; i < options_array.length; i++) {
    var current_option = options_array[i];
    var option_id = "option_" + current_game_status.step_number + "_" + i;

    var div_element = document.createElement("div");
    div_element.className = "choice-item";

    var label_element = document.createElement("label");
    label_element.htmlFor = option_id;

    var radio_element = document.createElement("input");
    radio_element.type = "radio";
    radio_element.id = option_id;
    radio_element.name = "phaseChoice";
    radio_element.value = i;
    radio_element.dataset.choiceIndex = i;

    label_element.appendChild(radio_element);

    var text_node = document.createTextNode(" " + current_option.text);
    label_element.appendChild(text_node);

    div_element.appendChild(label_element);
    choices_div.appendChild(div_element);
  }
  confirm_button.style.display = "block";
}

//function that creates and shows the first choices
function show_button_options(options_array) {
  choices_div.innerHTML = ""; // this clears choices before adding new things, used it above as well in other places
  confirm_button.style.display = "none";
  for (var i = 0; i < options_array.length; i++) {
    var button_element = document.createElement("button");
    button_element.innerHTML = options_array[i].button_text;
    button_element.onclick = options_array[i].button_action;
    button_element.className = "choice_button_style";
    choices_div.appendChild(button_element);
  }
}

//function that updates the progress bars
function update_the_bars() {
  //checks for all the progress
  if (
    !progress_bar_fill ||
    !people_bar ||
    !money_bar ||
    !water_bar ||
    !people_value ||
    !money_value ||
    !water_value
  ) {
    return;
  }

  //calculate the progress
  var number_of_steps = 0;
  if (current_game_status.which_main_choice !== null) {
    number_of_steps =
      all_stories[current_game_status.which_main_choice].phases.length;
  }
  var current_step = current_game_status.step_number;
  var progress_percent = 0;

  if (current_game_status.current_step_name == "the_end") {
    progress_percent = 100;
  } else if (
    current_game_status.current_step_name != "start" &&
    current_game_status.current_step_name != "form" &&
    number_of_steps > 0
  ) {
    progress_percent = Math.round((current_step / number_of_steps) * 100);
  }
  progress_bar_fill.style.width = progress_percent + "%";
  progress_bar_fill.textContent = progress_percent + "%";

  //fr community support
  var happy_percent = current_village_status.peopleHappy;
  if (happy_percent < 0) {
    happy_percent = 0;
  }
  if (happy_percent > 100) {
    happy_percent = 100;
  }
  happy_percent = Math.round(happy_percent);

  //for funding
  var money_percent = current_village_status.money;
  if (money_percent < 0) {
    money_percent = 0;
  }
  if (money_percent > 100) {
    money_percent = 100;
  }
  money_percent = Math.round(money_percent);

  //for water level
  var water_percent = current_village_status.water;
  if (water_percent < 0) {
    water_percent = 0;
  }
  if (water_percent > 100) {
    water_percent = 100;
  }
  water_percent = Math.round(water_percent);

  people_bar.style.width = happy_percent + "%";
  people_value.textContent = happy_percent + "%";
  money_bar.style.width = money_percent + "%";
  money_value.textContent = money_percent + "%";
  water_bar.style.width = water_percent + "%";
  water_value.textContent = water_percent + "%";
}

//function that gets the date and format as DD/MM/YYYY
function get_today_date() {
  var today = new Date();
  var day_num = today.getDate();
  var month_num = today.getMonth() + 1; //bcz months are 0-indexed
  var year_num = today.getFullYear();

  //convert to string
  var day_str = String(day_num);
  if (day_num < 10) {
    day_str = "0" + day_num;
  }
  var month_str = String(month_num);
  if (month_num < 10) {
    month_str = "0" + month_num;
  }

  var date_text = day_str + "/" + month_str + "/" + year_num;
  return date_text;
}

//all of these functions will give the user feedback based on a scores for the different categories
function get_people_feedback(value) {
  if (value >= 80) return "(Excellent!)";
  if (value >= 60) return "(Good)";
  if (value >= 40) return "(Fair)";
  if (value >= 20) return "(Poor)";
  return "(Very Poor)";
}
function get_money_feedback(value) {
  if (value >= 80) return "(Well Funded)";
  if (value >= 60) return "(Adequate Funding)";
  if (value >= 40) return "(Funding Concerns)";
  if (value >= 20) return "(Financial Strain)";
  return "(Critically Low Funds)";
}
function get_water_feedback(value) {
  if (value >= 80) return "(Abundant)";
  if (value >= 60) return "(Sufficient)";
  if (value >= 40) return "(Stable but Limited)";
  if (value >= 20) return "(Scarcity Warning)";
  return "(Critical Shortage)";
}
function get_final_feedback(score) {
  if (score >= 80) return "Your leadership led to outstanding results!";
  if (score >= 60) return "A commendable effort with positive outcomes.";
  if (score >= 40)
    return "A challenging situation managed with mixed results. Lessons were learned.";
  if (score >= 20)
    return "The village faced significant struggles under your plan.";
  return "The situation became dire. Rethinking the strategy is essential.";
}

//functions for the popup alert
var ok_button_action = null;
//shows custom popup
function show_my_alert(
  text_message,
  show_cancel_button,
  function_to_run_on_ok
) {
  //this checks if the popup elements exist first
  if (
    !my_alert_popup_background ||
    !my_alert_text ||
    !my_alert_ok_button ||
    !my_alert_cancel_button
  ) {
    if (show_cancel_button) {
      if (confirm(text_message)) {
        if (function_to_run_on_ok) {
          function_to_run_on_ok();
        }
      }
    } else {
      alert(text_message);
      if (function_to_run_on_ok) {
        function_to_run_on_ok();
      }
    }
    return;
  }

  my_alert_text.textContent = text_message;
  ok_button_action = function_to_run_on_ok;

  if (show_cancel_button == true) {
    my_alert_cancel_button.style.display = "inline-block";
  } else {
    my_alert_cancel_button.style.display = "none";
  }

  my_alert_popup_background.style.display = "flex";
  my_alert_popup_background.style.opacity = "1";
}

//hides the custom popup
function hide_my_alert() {
  if (!my_alert_popup_background) {
    return;
  }
  my_alert_popup_background.style.opacity = "0";
  setTimeout(function () {
    my_alert_popup_background.style.display = "none";
    ok_button_action = null;
  }, 300);
}

//COOKUES
//function to grt a cookie value
function get_the_cookie(cookie_name) {
  var all_cookies_string = document.cookie; //get cookie
  //split into indiviudal cookies (using the ;)
  var list_of_cookies = all_cookies_string.split(";");

  //loop through all cookies
  for (var i = 0; i < list_of_cookies.length; i++) {
    var one_cookie = list_of_cookies[i]; //get current cookie
    //remove spaces
    while (one_cookie.charAt(0) == " ") {
      one_cookie = one_cookie.substring(1);
    }

    var name_to_find = cookie_name + "=";
    if (one_cookie.indexOf(name_to_find) == 0) {
      var value = one_cookie.substring(name_to_find.length, one_cookie.length);
      try {
        return decodeURIComponent(value);
      } catch (e) {
        console.log("Error reading cookie: " + cookie_name);
        return null;
      }
    }
  }
  return null; //if there is no cookie
}

//event lisreners
//all of this will only run when the page is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  //getting names from cookies
  var saved_user = get_the_cookie("user_name");
  var saved_village = get_the_cookie("village_name");

  var name_input_box = document.getElementById("user_input_name");
  var village_input_box = document.getElementById("village_input_name");

  if (saved_user != null && name_input_box != null) {
    name_input_box.value = saved_user;
    user_name = saved_user;
  }

  if (saved_village != null && village_input_box != null) {
    village_input_box.value = saved_village;
    village_input_name = saved_village;
  }

  if (info_form) {
    info_form.addEventListener("submit", start_button_click);
  } else {
    console.log("Error: info_form not found!");
  }

  if (back_button) {
    back_button.addEventListener("click", go_back_one_step);
  } else {
    console.log("Error: back_button not found!");
  }

  if (choice_form) {
    choice_form.addEventListener("submit", confirm_button_click);
  } else {
    console.log("Error: choice_form not found!");
  }

  if (my_alert_ok_button) {
    my_alert_ok_button.addEventListener("click", function () {
      if (ok_button_action) {
        ok_button_action();
      }
      hide_my_alert();
    });
  }
  if (my_alert_cancel_button) {
    my_alert_cancel_button.addEventListener("click", function () {
      hide_my_alert();
    });
  }

  // variables to get the menu elements
  var menu_toggle_button = document.querySelector(".menu_button");
  var menu_div = document.querySelector(".menu_links");
  var main_content_area = document.querySelector(".main_area");
  var footer_content_area = document.querySelector(".footer_content");

  //check if all the menu elements are there
  if (
    menu_toggle_button &&
    menu_div &&
    main_content_area &&
    footer_content_area
  ) {
    menu_toggle_button.addEventListener("click", function (event) {
      event.stopPropagation();
      menu_div.classList.toggle("active");
      var is_active = menu_div.classList.contains("active");
      if (window.innerWidth > 768) {
        main_content_area.style.marginLeft = is_active ? "170px" : "20px";
        footer_content_area.style.paddingLeft = is_active ? "170px" : "20px";
      } else {
        main_content_area.style.marginLeft = "20px";
        footer_content_area.style.paddingLeft = "20px";
      }
    });

    document.addEventListener("click", function (event) {
      var clicked_element = event.target;
      if (
        !clicked_element.closest(".menu_bar") &&
        menu_div.classList.contains("active")
      ) {
        menu_div.classList.remove("active");
        if (window.innerWidth > 768) {
          main_content_area.style.marginLeft = "20px";
          footer_content_area.style.paddingLeft = "20px";
        }
      }
    });
    var menu_links_list = menu_div.querySelectorAll("a");
    for (var i = 0; i < menu_links_list.length; i++) {
      menu_links_list[i].addEventListener("click", function (event) {
        var link_target = this.getAttribute("href");
        if (link_target && link_target.startsWith("#")) {
          event.preventDefault();
          var target_element = document.querySelector(link_target);
          if (target_element) {
            var header_height = 110; // Approx height of top bar + toggle
            var element_pos = target_element.getBoundingClientRect().top;
            var scroll_to_pos =
              element_pos + window.pageYOffset - header_height;
            //smoooooth scroll
            window.scrollTo({ top: scroll_to_pos, behavior: "smooth" });
            if (menu_div.classList.contains("active")) {
              menu_div.classList.remove("active");
              if (window.innerWidth > 768) {
                main_content_area.style.marginLeft = "20px";
                footer_content_area.style.paddingLeft = "20px";
              }
            }
          }
        }
      });
    }
  }

  //dropdown sections
  var all_dropdown_buttons = document.querySelectorAll(".dropdown_button");
  for (var i = 0; i < all_dropdown_buttons.length; i++) {
    all_dropdown_buttons[i].addEventListener("click", function (event) {
      event.stopPropagation();
      var this_dropdown_content = this.nextElementSibling;
      if (
        !this_dropdown_content ||
        !this_dropdown_content.classList.contains("dropdown_info")
      ) {
        console.log("Could not find dropdown info for button: ", this);
        return;
      }
      var was_active = this_dropdown_content.classList.contains("active");
      var all_dropdown_contents = document.querySelectorAll(".dropdown_info");
      for (var j = 0; j < all_dropdown_contents.length; j++) {
        if (all_dropdown_contents[j] !== this_dropdown_content) {
          all_dropdown_contents[j].classList.remove("active");
        }
      }
      if (was_active) {
        this_dropdown_content.classList.remove("active");
      } else {
        this_dropdown_content.classList.add("active");
      }
    });
  }

  document.addEventListener("click", function (event) {
    if (!event.target.closest(".a_dropdown")) {
      var all_dropdown_contents = document.querySelectorAll(
        ".dropdown_info.active"
      );
      for (var i = 0; i < all_dropdown_contents.length; i++) {
        all_dropdown_contents[i].classList.remove("active");
      }
    }
  });

  //dynamic copyright year to be extra fancy
  var year_span = document.getElementById("copyright-year");
  if (year_span) {
    year_span.textContent = new Date().getFullYear();
  }

  //shows user browser info in a popup when the page loads
  //because the assignment decided that this is necessary even though it doesn't look nice
  alert('You are using "' + navigator.userAgent + '" browser.');
});
