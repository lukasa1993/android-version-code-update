import * as core from "@actions/core";
import { google } from "googleapis";
import { fetchVersionCode } from "./publish";

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

    const versionCode = await fetchVersionCode({
      auth: auth,
      applicationId: packageName
    });
    core.info(`Your play store version ${versionCode} next version ${versionCode + 1}`);
    core.setOutput("version", versionCode);
    core.setOutput("next_version", versionCode + 1);
  } catch (error) {
    core.debug(error);
    core.setFailed(error.message);
  }
}

run().catch(e => console.log("run error", e));
