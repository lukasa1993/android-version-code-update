/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { androidpublisher_v3, google } from "googleapis";

const androidPublisher: androidpublisher_v3.Androidpublisher = google.androidpublisher(
  "v3"
);

export interface Options {
  auth: any;
  applicationId: string;
}

export async function fetchVersionCode(options: Options): Promise<Number> {
  const appEdit = await androidPublisher.edits.insert({
    packageName: options.applicationId,
    auth: options.auth
  });

  const lists = await androidPublisher.edits.bundles.list({
    auth: options.auth,
    packageName: options.applicationId,
    editId: appEdit.data.id!
  });

  let versionCode: number = 1;
  try {
    versionCode = lists.data.bundles![lists.data.bundles!.length - 1].versionCode || 1;
  } catch (e) {
  }


  return versionCode;
}
