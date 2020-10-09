// import inquirer.js
var inquirer = require("inquirer");
// import fs.js
var fs = require("fs");
// import generateMarkdown.js
var MD = require("./utils/generateMarkdown.js");

// array of questions for user
const questions = ["What's the title of your project?", 
                   "Please enter the description/abstract for the project",
                   "Please enter installation instructions",
                   "Please enter usage information",
                   "Please enter contributing guidelines",
                   "Please enter testing guidelines",
                   "Please enter any text intended for the Enquiry section",
                   "This will be added to the Enquiry sections. \nPlease enter your github username",
                   "This will be added to the Enquiry sections. \nPlease enter you email address"];

// array of choices for user to select
const choices = ["Title",
                 "Project Description",
                 "Installation_Instruction",
                 "Usage",
                 "License",
                 "Contribution_Guidelines",
                 "Testing_Guidelines",
                 "For_Enquiry",
                 "Add Github Link",
                 "Add Email Address",
                 new inquirer.Separator()]

// array of licenses for user to choose from
const licenseChoices = ["Apache 2.0 License",
                        "BSD 3-Clause",
                        "BSD 2-Clause",
                        "Eclipse Public License 1.0",
                        "GNU GPL v3",
                        "GNU GPL v2",
                        "GNU AGPL v3",
                        "GNU LGPL v3",
                        "ISC License",
                        "The MIT License",
                        "Mozilla Public License 2.0",
                        "The Artistic License 2.0",
                        "The Unlicense",
                        new inquirer.Separator()];

// for storing all the elements
// 0 -> Description, 1 -> ToC, 2 -> Installation, 3 -> Usage, 4 -> License, 5 -> Contribution, 6 -> Testing, 7 -> Questions
var build = [];
var descriptions = Array(8).fill("");
var title;
var badges = [];
var licenseInfo = [];


// asking user which part to be added
function userSelect(){
    inquirer.prompt({
        type: "list",
        message: "Please select the section you want to add",
        name: "userSelect",
        choices: choices
    }).then(function(response){
        build[0] = MD.generateSection("Description");
        build[2] = MD.generateSection("Installation_Instruction");
        build[3] = MD.generateSection("Usage");
        build[5] = MD.generateSection("Contribution_Guidelines");
        build[6] = MD.generateSection("Testing_Guidelines");
        build[7] = MD.generateSection("For_Enquiry");
        switch (response.userSelect){
            case "Title": userPrompt(0); break;
            case "Project Description": userPrompt(1); break;
            case "Installation_Instruction": userPrompt(2); break;
            case "Usage": userPrompt(3); break;
            case "License": licensePrompt(); break;
            case "Contribution_Guidelines": userPrompt(4); break;
            case "Testing_Guidelines": userPrompt(5); break;
            case "For_Enquiry": userPrompt(6); break;
            case "Add Github Link": userPrompt(7); break;
            case "Add Email Address": userPrompt(8); break;
            default: break;
        }
    });
}

// asking user for details based on choice in userSelect()
function userPrompt(index){
    inquirer.prompt({
        type: "input",
        message: questions[index],
        name: "userInput",
        default: "Default PlaceHolder"
    }).then(function(response){
        // checking if input is empty
        if(response.userInput == "") {
            console.log("Input cannot be empty");
            morePrompt(); // sending user back to the menu by asking if there is more to add
            return;
        }
        switch (index){
            case 0: title = MD.generateTitle(response.userInput); break;
            case 1: descriptions[0] = MD.generateBody(response.userInput); break; // Project Description
            case 2: descriptions[2] = MD.generateBody(response.userInput); break; // Installation
            case 3: descriptions[3] = MD.generateBody(response.userInput); break; // Usage
            case 4: descriptions[5] = MD.generateBody(response.userInput); break; // Contribution
            case 5: descriptions[6] = MD.generateBody(response.userInput); break; // Testing
            case 6: descriptions[7] = MD.generateBody(response.userInput); break; // Questions
            case 7: descriptions[7] += MD.generateGitLink(response.userInput); break;
            case 8: descriptions[7] += MD.generateBody(response.userInput); break;
            default: break;
        }
        morePrompt(); // asking user if there is more to add
    })
}

// asking user to choose the licenses they wanted to add
function licensePrompt(){
    var index;
    inquirer.prompt({
        type:"rawlist",
        message: "Please select the license you would like to add",
        name: "licenseChoice",
        choices: licenseChoices
    }).then(function(response){
        switch (response.licenseChoice){
            case "Apache 2.0 License": index = 0; break;
            case "BSD 3-Clause": index = 1; break;
            case "BSD 2-Clause": index = 2; break;
            case "Eclipse Public License 1.0": index = 3; break;
            case "GNU GPL v3": index = 4; break;
            case "GNU GPL v2": index = 5; break;
            case "GNU AGPL v3": index = 6; break;
            case "GNU LGPL v3": index = 7; break;
            case "ISC License": index = 8; break;
            case "The MIT License": index = 9; break;
            case "Mozilla Public License 2.0": index = 10; break;
            case "The Artistic License 2.0": index = 11; break;
            case "The Unlicense": index = 12; break;
        }
        badges.push(MD.generateBadge(index)); // pushing the selected badges onto the stack
        licenseInfo.push(MD.generateLicenseInfo(index)); // pushing the selected license info onto the stack
        morePrompt(); // asking user if there is more to add
    });
}

// asking user if there is more to add
function morePrompt(){
    console.log("Please note that by saying No, the program will end and a file named temp.md will be created or overwritten.");
    inquirer.prompt({
        type: "confirm",
        message: "Do you want to add more sections?",
        name: "confirm"
    }).then(function(response){
        if(response.confirm) userSelect();
        else {
            createFile("temp.md");// creating file to write or overwritting
            writeToFile("temp.md"); // building the README
            console.log("Thank you for using this README generator! \nYour README is in temp.md.");
        }
    })
}

// creating a file to put the generated README
function createFile(fileName){
    console.log("creating files...");
    fs.writeFile(fileName, "", (err)=>{
        if(err) console.log(`Error creating file: ${err}`);
    });
}

// building README.md by iterating throught the "build" array
function writeToFile(fileName) {
    fs.accessSync(fileName, (err) => {
        if(err){
            console.log("creating files...");
            fs.writeFile(fileName, "", (err)=>{
                if(err) console.log(`Error creating file: ${err}`);
            });
        }
    });
    // writing title
    console.log("writing title...")
    if(title != undefined) fs.appendFileSync(fileName, title);
    else console.log("[title]: Title is undefined");
    // adding badges
    console.log("adding badges...")
    for(let i=0; i < badges.length; i++){
        if(badges[i] != null) fs.appendFileSync(fileName, badges);
    }
    // writing sections sequentially
    for(let i=0; i < build.length; i++){
        // build[1] = ToC, build[4] = License; They are left empty to trigger inserting ToC and License 
        // writing ToC
        if(i == 1){
            console.log("writing ToC...");
            let temp = MD.generateSection("Table of Contents");
            fs.appendFileSync(fileName, temp);
            temp = MD.generateList(choices.slice(2, 8));
            fs.appendFileSync(fileName, temp);
        // writing license
        } else if (i == 4){
            console.log("writing License...");
            let temp = MD.generateSection("License");
            fs.appendFileSync(fileName, temp);
            licenseInfo.forEach(item => fs.appendFileSync(fileName, item));
        // writing sections sequentially
        } else {
            console.log("writing other sections...");
            fs.appendFileSync(fileName, build[i]);
            fs.appendFileSync(fileName, descriptions[i]);
        }

    }
    
}

// function to initialize program
function init() {

    console.log("This is not an editor and will overwrite any previous outputs/files named temp.md. \nPlease remove/save any files named temp.md before proceeding.");
    userSelect(); // starting sequence
}

// function call to initialize program
init();
