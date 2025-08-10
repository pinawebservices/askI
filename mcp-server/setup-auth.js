// mcp-server/setup-auth.js
import { google } from 'googleapis';
import fs from 'fs/promises';
import readline from 'readline';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const TOKEN_PATH = join(__dirname, 'token.json');
const CREDENTIALS_PATH = join(__dirname, 'credentials.json');

class GoogleSheetsAuth {
    constructor() {
        this.oAuth2Client = null;
    }

    async authorize() {
        try {
            // Load client secrets from a local file
            const credentials = JSON.parse(await fs.readFile(CREDENTIALS_PATH, 'utf8'));
            //const { client_secret, client_id, redirect_uris } = credentials.web || credentials.installed;
            const { client_secret, client_id } = credentials.web || credentials.installed;

            // this.oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
            // Use your specific redirect URI instead
            const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:8080/oauth/callback'; // Hard code redirect URI for development
            this.oAuth2Client = new google.auth.OAuth2(
                client_id,
                client_secret,
                redirectUri
            );

            // Check if we have previously stored a token
            try {
                const token = JSON.parse(await fs.readFile(TOKEN_PATH, 'utf8'));
                this.oAuth2Client.setCredentials(token);
                console.log('✅ Found existing token, authentication ready!');
                return this.oAuth2Client;
            } catch (err) {
                // Get new token
                return this.getNewToken();
            }
        } catch (err) {
            console.error('❌ Error loading client secret file:', err);
            console.log('\n📋 Setup Instructions:');
            console.log('1. Go to https://console.developers.google.com/');
            console.log('2. Enable the Google Sheets API');
            console.log('3. Create credentials (OAuth 2.0)');
            console.log('4. Download the credentials.json file');
            console.log('5. Place it in the mcp-server directory');
            process.exit(1);
        }
    }

    async getNewToken() {
        const authUrl = this.oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
            redirect_uri: 'http://localhost:8080/oauth/callback' // Add this line
        });

        console.log('🔑 Authorize this app by visiting this url:', authUrl);

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        return new Promise((resolve, reject) => {
            rl.question('Enter the code from that page here: ', async (code) => {
                rl.close();
                try {
                    const { tokens } = await this.oAuth2Client.getToken(code);
                    this.oAuth2Client.setCredentials(tokens);

                    // Store the token to disk for later program executions
                    await fs.writeFile(TOKEN_PATH, JSON.stringify(tokens));
                    console.log('✅ Token stored to', TOKEN_PATH);
                    resolve(this.oAuth2Client);
                } catch (err) {
                    console.error('❌ Error retrieving access token', err);
                    reject(err);
                }
            });
        });
    }

    async testConnection() {
        if (!this.oAuth2Client) {
            throw new Error('OAuth client not initialized');
        }

        try {
            const sheets = google.sheets({ version: 'v4', auth: this.oAuth2Client });

            // Test with a sample spreadsheet (create one for testing)
            console.log('\n🧪 Testing Google Sheets connection...');
            console.log('Create a test spreadsheet and update SAMPLE_SPREADSHEET_ID in this file');

            // Uncomment and add your test spreadsheet ID
            // const SAMPLE_SPREADSHEET_ID = 'your-test-spreadsheet-id-here';
            // const response = await sheets.spreadsheets.values.get({
            //   spreadsheetId: SAMPLE_SPREADSHEET_ID,
            //   range: 'A1:C3',
            // });
            // console.log('✅ Successfully connected to Google Sheets!');
            // console.log('Sample data:', response.data.values);

        } catch (error) {
            console.error('❌ Error testing connection:', error);
        }
    }
}

async function main() {
    console.log('🚀 Setting up Google Sheets Authentication for MCP Server\n');

    const auth = new GoogleSheetsAuth();
    await auth.authorize();
    await auth.testConnection();

    console.log('\n✅ Setup complete! Your MCP server is ready to connect to Google Sheets.');
    console.log('\n📝 Next steps:');
    console.log('1. Create test spreadsheets for your apartment data');
    console.log('2. Share the spreadsheets with your service account');
    console.log('3. Update your main application to use the MCP server');
}

main().catch(console.error);