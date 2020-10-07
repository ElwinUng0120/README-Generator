// import inquirer node_modules
var inquirer = require("inquirer");
// import fs node_modules
var fs = require("fs");
// import markdown generator
var MD = require("./utils/generateMarkdown.js");

// array of questions for user
const questions = ["What's the title of your project?", 
                   "Please enter the description/abstract for the project",
                   "Please enter the lists of contents",
                   "Please enter installation instructions",
                   "Please enter usage information",
                   "Please enter license information",
                   "Please enter contributing guidelines",
                   "Please enter testing guidelines",
                   "Please enter any links for questions"];
var build = [];

// getting initial infos
function userSelect(){
    inquirer.prompt([{
        type: "list",
        message: "Please select the section you want to add",
        name: "userSelect",
        choices: ["Title",
                "Project Description",
                "Table of Contents",
                "Installation Instruction",
                "Usage Information",
                "License",
                "Contribution Guidelines",
                "Testing Guidelines",
                "Links for Questions",
                new inquirer.Separator()]
    }]).then(function(response){
        switch (response.userSelect){
            case "Title":{
                userPrompt(0);
                break;
            }
            case "Project Description":{
                userPrompt(1);
                build[1] = MD.generateSection("Description");
                break;
            }
            case "Table of Contents":{
                userPrompt(2);
                build[3] = MD.generateSection("Table of Contents");
                break;
            }
            case "Installation Instruction":{
                userPrompt(3);
                build[5] = MD.generateSection("Installation");
                break;
            }
            case "Usage Information":{
                userPrompt(4);
                build[7] = MD.generateSection("Usage");
                break;
            }
            case "License":{
                userPrompt(5);
                build[9] = MD.generateSection("License");
                break;
            }
            case "Contribution Guidelines":{
                userPrompt(6);
                build[11] = MD.generateSection("Contributing");
                break;
            }   
            case "Testing Guidelines":{
                userPrompt(7);
                build[13] = MD.generateSection("Tests");
                break;
            }
            case "Links for Questions":{
                userPrompt(8);
                build[15] = MD.generateSection("Questions");
                break;
            }
            default:{
                break;
            }
        }
    });
}

async function userPrompt(index){
    inquirer.prompt({
        type: "input",
        message: questions[index],
        name: "userInput"
    }).then(function(response){
        if(response.userInput == "") {
            console.log("Input cannot be empty");
            morePrompt();
            return;
        }
        switch (index){
            case 0:{
                build[0] = MD.generateTitle(response.userInput);
                break;
            }
            case 1:{
                build[2] = MD.generateBody(response.userInput);
                break;
            }
            case 2:{
                build[4] = MD.generateTitle(response.userInput);
                break;
            }
            case 3:{
                build[6] = MD.generateTitle(response.userInput);
                break;
            }
            case 4:{
                build[8] = MD.generateTitle(response.userInput);
                break;
            }
            case 5:{
                build[10] = MD.generateTitle(response.userInput);
                break;
            }
            case 6:{
                build[12] = MD.generateTitle(response.userInput);
                break;
            }
            case 7:{
                build[14] = MD.generateTitle(response.userInput);
                break;
            }
            case 8:{
                build[16] = MD.generateTitle(response.userInput);
                break;
            }
        }
        morePrompt();
    })
}

function morePrompt(){
    inquirer.prompt({
        type: "confirm",
        message: "Do you want to add more sections?",
        name: "confirm"
    }).then(function(response){
        if(response.confirm) userSelect();
        else {
            writeToFile("temp.md", build);
            console.log("Thank you for using this README generator! \nYour README is in temp.md.");
        }
    })
}

// function to write README file
function writeToFile(fileName, data) {
    console.log(build);
    for(let i=0; i < data.length; i++){
        if(data[i] != null) fs.appendFileSync(fileName, data[i], "utf8");
    }
}

// function to initialize program
async function init() {
    console.log("")
    // creating a file to put the generated README
    fs.writeFileSync("temp.md", "", (err)=>{
        console.log(`Error creating file: ${err}`);
    });
    userSelect();
}

// function call to initialize program
init();
