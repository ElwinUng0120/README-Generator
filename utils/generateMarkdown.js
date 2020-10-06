// function to generate markdown for README
function generateTitle(title) {
  return `\n# ${title}`;
}

function generateBody(description){
  return `\n${description} <br>`;
}

function generateSection(sectionName){
  return `\n## ${sectionName}`;
}

module.exports = {
  generateTitle = generateTitle,
  generateBody = generateBody,
  generateSection = generateSection
}
