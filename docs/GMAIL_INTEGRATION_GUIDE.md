# Gmail API & n8n Integration Guide

This guide outlines the exact, actionable steps required to configure Google Cloud Platform (GCP) and connect your Gmail account to n8n for fully automated Request for Quote (RFQ) processing.

---

## Part 1: Google Cloud Platform Setup

To allow n8n to read incoming RFQ emails, you must create a Google Cloud Project and generate OAuth credentials.

### 1. Create a Google Cloud Project
1. Navigate to the [Google Cloud Console](https://console.cloud.google.com/).
2. Click the project dropdown near the top left corner.
3. Click **New Project**. Name it something identifying (e.g., `Chemveda-RFQ-Automation`) and click **Create**.
4. Once created, ensure the target project is selected.

### 2. Enable the Gmail API
1. On the left sidebar, go to **APIs & Services > Library**.
2. Search for "Gmail API".
3. Click the **Gmail API** result and click **Enable**.

### 3. Configure the OAuth Consent Screen
1. Go to **APIs & Services > OAuth consent screen**.
2. Select **External** (unless you are setting this up within a paid internal Google Workspace organization, in which case select **Internal**) and click **Create**.
3. **App information**:
   - App Name: `RFQ Automation n8n`
   - User Support Email: *Your email address*
   - App logo: *(Optional)*
4. **App domain**: *(Leave blank for now unless you have a specific policy)*
5. **Developer contact information**: *Your email address*
6. Click **Save and Continue**.
7. **Scopes**:
   - Click **Add or Remove Scopes**.
   - Search for the following scope and select it: `https://mail.google.com/` (Allows full access to read, send, and modify emails).
   - Click **Update**, then **Save and Continue**.
8. **Test Users** (If you selected "External" above):
   - Click **Add Users**.
   - Enter the exact Gmail address(es) you will use inside n8n to fetch emails.
   - Click **Save and Continue**.

### 4. Create OAuth Credentials
1. Go to **APIs & Services > Credentials**.
2. Click **+ Create Credentials > OAuth client ID**.
3. **Application Type**: Select **Web application**.
4. **Name**: `n8n Credentials`
5. **Authorized redirect URIs**: 
   - You need the OAuth Callback URL from your n8n instance. 
   - If running locally, this is typically `http://localhost:5678/rest/oauth2-credential/callback`.
   - *If hosting n8n on a domain, use `https://your-n8n-domain.com/rest/oauth2-credential/callback`.*
6. Click **Create**.
7. **Important:** A dialog will appear containing your **Client ID** and **Client Secret**. Save these immediately.

---

## Part 2: Connecting n8n to Gmail

Now that GCP is configured, you will authorize your n8n workflows to access the inbox.

### 1. Add Credentials in n8n
1. Open your n8n dashboard (e.g., `http://localhost:5678`).
2. Go to **Credentials** in the left sidebar and click **Add Credential**.
3. Search for and select **Gmail API**.
4. Enter the details from Part 1:
   - **Client ID**: Paste your Client ID.
   - **Client Secret**: Paste your Client Secret.
5. Click **Sign in with Google**.
6. A popup will appear asking you to log into your Google Account.
   - *(Note: Since the app is in testing mode, Google will show a "Google hasn't verified this app" warning. Click **Advanced > Go to RFQ Automation n8n (unsafe)**.)*
7. Grant the requested permissions.
8. Back in n8n, you should see a success message. Name this credential `RFQ Procurement Mailbox` and click **Save**.

### 2. Configure the Gmail Trigger Node
1. Create a new Workflow in n8n.
2. Add a new node: Search for **Gmail** and select the **Gmail Trigger**.
3. Select the `RFQ Procurement Mailbox` credential you just created.
4. **Parameters**:
   - **Action**: `On Message Received`
   - **Poll Interval**: `1 Minute` (Adjust based on automation needs)
   - **Options > Filters > Query**: Set this to something specific to avoid parsing junk mail. Example queries:
     - `subject:RFQ`
     - `from:vendor@example.com`
     - `has:attachment`
5. Click **Fetch Test Event** to verify that n8n can successfully read your inbox.

---

## Part 3: Wrapping Up the Workflow

With the Gmail trigger active:
- Connect the Gmail Trigger to an **HTTP Request** node in n8n.
- Point the HTTP Request node to our Next.js backend: `POST http://localhost:3000/api/parse`.
- Set the JSON Body payload:
  ```json
  {
    "emailText": "={{ $json.snippet }} \n\n {{ $json.textPlain }}"
  }
  ```
- Send the Next.js JSON results into to the **Google Sheets** or **Airtable** nodes to log the parsed vendors, or back into our `Excel` endpoint to generate the final Chemveda file.

Your workflow is now fully automated and production-ready!
