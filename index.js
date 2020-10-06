// import inquirer node_modules
var inquirer = require("inquirer");
// import fs node_modules
var fs = require("fs");
// import markdown generator
var MD = require("./utils/generateMarkdown.js");

// array of questions for user
const questions = ["What's the title of your project?", "How many sections do you need?", "Please enter the description/abstract for the project"];
// for building the README.md sequenctially
var markDown = [];

// getting initial infos
function userPrompt(){
    inquirer.prompt([
        {
            type: "input",
            message: questions[0],
            name: "title"
        },
        {
            type: "number",
            message: question[1],
            name: "numbSection"
        },
        {
            type: "input",
            message: questions[2],
            name: "abstract"
        },
    ]).then(function(response){
        markDown.push(MD.generateTitle(response.title));
        markDown.push(MD.generateBody(response.abstract));
        makeSection(response.numbSection);
    });
}

// getting description for sections
function makeSection(numbSection){
    for(let index = 1; index <= numbSection; index++){
        inquirer.prompt([
            {
                type: "input",
                message: `Please enter title for section ${index}`,
                name: "sectionTitle"
            },
            {
                type: "input",
                message: `Please enter description for section ${index}`,
                name: "description"
            }
        ]).then(function(response){
            markDown.push(MD.generateSection(response.sectionTitle));
            markDown.push(MD.generateBody(response.descriptions));
        });
    }
}

// function to write README file
function writeToFile(fileName, data) {
    fs.appendFileSync(fileName, data, "utf8");
}

// function to initialize program
function init() {
    // checking if README.md exists
    fs.accessSync("./README.md", fs.constants.F_OK, (err) =>{
        console.log(err);
        console.log("README.md doesn't exists, creating now...");
        // creating README.md if one doesn't exist
        fs.open("./README.md", "r", (err)=>{
            console.log(`Error creating file: ${err}`);
        });
    });
    userPrompt();
    makeDescription();
    // building the README.md
    for(let i = 0; i < markDown.length; i++){
        writeToFile("./README.md", markDown[i]);
    }
}

// function call to initialize program
init();
