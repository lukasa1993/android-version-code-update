import * as core from "@actions/core";
import { google } from "googleapis";
import { fetchVersionCode } from "./publish";
import * as fs from "fs";

const auth = new google.auth.GoogleAuth({
  scopes: ["https://www.googleapis.com/auth/androidpublisher"]
});

async function run(): Promise<void> {
  try {
    const serviceAccountJson = core.getInput("serviceAccountJson", { required: true });
    const packageName = core.getInput("packageName", { required: true });

    // Validate that we have a service account json in some format
    if (!serviceAccountJson) {
      core.setFailed(
        "You must provide one of 'serviceAccountJson' or 'serviceAccountJsonPlainText' to use this action"
      );
      return;
    }

    if (serviceAccountJson) {
      // In sure that the api can find our service account credentials
      core.exportVariable("GOOGLE_APPLICATION_CREDENTIALS", serviceAccountJson);
    }

    const versionCodeRegexPattern = /(versionCode(?:\s|=)*)(.*)/;
    const gradlePaths = [`app/build.gradle`, `android/app/build.gradle`];
    const gradlePath = gradlePaths.find(p=>fs.existsSync(p))

    let gradleVersionCode = 0

    if(gradlePath) {
      const gradleFile = fs.readFileSync(gradlePath, 'utf8')
      const matched = gradleFile.match(versionCodeRegexPattern)
      
      gradleVersionCode = parseInt(matched?.[2] || '0');
      gradleVersionCode = isNaN(gradleVersionCode) ? 0 : gradleVersionCode
    }

    let versionCode = await fetchVersionCode({
      auth: auth,
      applicationId: packageName
    });
    core.info(`Your play store version ${versionCode}`);

    versionCode = Math.max(gradleVersionCode, versionCode);

    core.info(`Combined ${versionCode} next version ${versionCode + 1}`);
    core.setOutput("version", versionCode);
    core.setOutput("next_version", versionCode + 1);
  } catch (error) {
    core.debug(error);
    core.setFailed(error.message);
  }
}

run().catch(e => console.log("run error", e));
