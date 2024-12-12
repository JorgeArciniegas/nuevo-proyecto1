//
// Please install on your system gitversion before run this script
//
// You can download the executable from github (https://github.com/GitTools/GitVersion/releases) then install it on your system to let the executable be run wherever
// You can also install it with chocolatey install gitversion.portable -y
// You can also install it with brew install gitversion
// You can install by having dotnet sdk installed (https://dotnet.microsoft.com/download) then: dotnet tool install -g gitversion.tool --version 5.1.2
//

const { execSync } = require("child_process");

console.log('Calculating the version using gitversion...');
console.log();

const stdout = execSync('gitversion');
const gitversion = stdout.toString();
const json = JSON.parse(gitversion);
const releaseVersion = `v${json.MajorMinorPatch}`;
const tagVersion = `v${json.SemVer}`;

console.log('-------------------------------------');
console.log(`release branch: release/${releaseVersion}`);
console.log(`tag (deploy) version: ${tagVersion}`);
console.log('-------------------------------------');
console.log();

console.log('Done. Bye bye!');
