const angular = require("./angular");
const { execSync } = require("child_process");

const buildConfigs =
  angular.projects["vdesk"].architect.build.configurations;

for (const buildConfigKey in buildConfigs) {
  if (buildConfigKey.endsWith("-release")) {
    console.log(`Building '${buildConfigKey}' configuration...`);
    const stdout = execSync(
      `ng build -c ${buildConfigKey}`
    );
    console.log(stdout.toString());
  } else {
    console.log(`Skip '${buildConfigKey}' configuration.`);
  }
}
