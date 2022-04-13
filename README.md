# Upload Android release to the Play Store

This action will help you update the version code of your app using the Google Play Developer API v3.

## Inputs

_You must provide  `serviceAccountJson`

### `serviceAccountJson`

The service account json private key file to authorize the upload request

### `packageName`

**Required:** The package name, or Application Id


## Example usage

```yaml
uses: lukasa1993/android-version-code-update@v2.0.0
with:
  serviceAccountJson: ${{ SERVICE_ACCOUNT_JSON }}
  packageName: com.example.MyApp
```
