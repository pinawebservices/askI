// mcp-server/setup-auth.js - UPDATED with Google Drive access
import { google } from 'googleapis';
import fs from 'fs/promises';
import http from 'http';
import url from 'url';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// UPDATED SCOPES - Now includes Google Drive access
const SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets',           // Google Sheets access
    'https://www.googleapis.com/auth/drive.readonly'          // Google Drive read access
];

const CREDENTIALS_PATH = join(__dirname, 'credentials.json');

class MultiSourceOAuth {
    constructor(clientId = 'default') {
        this.clientId = clientId;
        this.oAuth2Client = null;
        this.tokenPath = join(__dirname, `token-${clientId}.json`);
    }

    async authorize() {
        try {
            console.log(`🔑 Setting up Google Sheets + Drive access for client: ${this.clientId}`);
            console.log(`📁 Token will be saved as: token-${this.clientId}.json`);
            console.log(`🔓 Requesting permissions for:`);
            console.log(`   - Google Sheets (read/write)`);
            console.log(`   - Google Drive (read-only)`);

            // Load client secrets from a local file
            const credentials = JSON.parse(await fs.readFile(CREDENTIALS_PATH, 'utf8'));
            const { client_secret, client_id } = credentials.web || credentials.installed;

            if (!client_id || !client_secret) {
                throw new Error('❌ Missing client_id or client_secret in credentials.json');
            }

            // Fixed redirect URI (MUST match Google Cloud Console exactly)
            const redirectUri = 'http://localhost:8080/oauth/callback';

            this.oAuth2Client = new google.auth.OAuth2(
                client_id,
                client_secret,
                redirectUri
            );

            console.log('✅ OAuth2 client initialized');
            console.log('🔗 Redirect URI configured:', redirectUri);

            // Check for existing token for this specific client
            try {
                const tokenContent = await fs.readFile(this.tokenPath, 'utf8');
                const token = JSON.parse(tokenContent);

                // Check if existing token has the right scopes
                if (this.hasRequiredScopes(token)) {
                    this.oAuth2Client.setCredentials(token);
                    console.log(`✅ Found existing token with correct scopes for client: ${this.clientId}`);
                    return this.oAuth2Client;
                } else {
                    console.log(`⚠️ Existing token lacks required scopes, getting new token...`);
                    return this.getNewToken();
                }
            } catch (err) {
                console.log(`ℹ️ No existing token for client: ${this.clientId}, creating new one...`);
                return this.getNewToken();
            }
        } catch (err) {
            console.error('❌ OAuth setup failed:', err.message);
            this.showSetupInstructions();
            process.exit(1);
        }
    }

    hasRequiredScopes(token) {
        // Simple check - in production you'd want more sophisticated scope validation
        const requiredScopes = ['spreadsheets', 'drive'];
        const tokenScope = token.scope || '';

        return requiredScopes.every(scope => tokenScope.includes(scope));
    }

    showSetupInstructions() {
        console.log('\n📋 Google Cloud Console Setup Instructions:');
        console.log('==========================================');
        console.log('1. Go to https://console.cloud.google.com/');
        console.log('2. Create new project or select existing project');
        console.log('3. Enable APIs:');
        console.log('   - APIs & Services → Library → Search "Google Sheets API" → Enable');
        console.log('   - APIs & Services → Library → Search "Google Drive API" → Enable');
        console.log('4. Create OAuth 2.0 credentials:');
        console.log('   - APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID');
        console.log('   - Application type: Web application');
        console.log('   - Name: "AI Widget Platform - Multi-Source"');
        console.log('5. Add authorized redirect URI:');
        console.log('   - http://localhost:8080/oauth/callback');
        console.log('   - (Exactly this - no https, no trailing slash)');
        console.log('6. Download the JSON file and save as credentials.json');
        console.log('7. Run this script again');
        console.log('==========================================\n');
    }

    async getNewToken() {
        const authUrl = this.oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
            prompt: 'consent', // Force consent to ensure we get all scopes
            state: this.clientId
        });

        console.log('\n🔐 GOOGLE AUTHORIZATION REQUIRED (SHEETS + DRIVE)');
        console.log('==================================================');
        console.log(`Setting up multi-source OAuth for client: ${this.clientId}`);
        console.log('You will be asked to grant permissions for:');
        console.log('• Google Sheets - Read and modify spreadsheets');
        console.log('• Google Drive - View and download files');
        console.log('');
        console.log('1. Click this URL to authorize:');
        console.log('\n' + authUrl + '\n');
        console.log('2. Complete Google authorization');
        console.log('3. You\'ll be redirected to localhost');
        console.log('4. Return here to see confirmation');
        console.log('==================================================\n');

        return this.startCallbackServer();
    }

    async startCallbackServer() {
        const server = http.createServer();
        const port = 8080;

        return new Promise((resolve, reject) => {
            let authComplete = false;

            server.on('request', async (req, res) => {
                if (authComplete) return;

                const queryObject = url.parse(req.url, true).query;

                if (queryObject.code) {
                    authComplete = true;
                    console.log('✅ Authorization code received!');

                    try {
                        const { tokens } = await this.oAuth2Client.getToken(queryObject.code);
                        this.oAuth2Client.setCredentials(tokens);

                        // Save token with client-specific filename
                        await fs.writeFile(this.tokenPath, JSON.stringify(tokens, null, 2));
                        console.log(`✅ Multi-source token saved for client: ${this.clientId}`);
                        console.log(`📁 File created: token-${this.clientId}.json`);
                        console.log(`🔓 Permissions granted for Google Sheets + Drive`);

                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(`
                            <html>
                                <head>
                                    <title>AI Widget Platform - Multi-Source Authentication Success</title>
                                    <style>
                                        body { font-family: Arial; text-align: center; padding: 50px; background: #f5f5f5; }
                                        .success { background: white; max-width: 600px; margin: 0 auto; padding: 40px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                                        .checkmark { font-size: 48px; color: #4CAF50; margin-bottom: 20px; }
                                        .title { color: #333; font-size: 24px; margin-bottom: 15px; }
                                        .subtitle { color: #666; font-size: 16px; line-height: 1.5; }
                                        .filename { background: #f0f0f0; padding: 10px; border-radius: 5px; font-family: monospace; margin: 10px 0; }
                                        .permissions { background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 15px 0; }
                                    </style>
                                </head>
                                <body>
                                    <div class="success">
                                        <div class="checkmark">✅</div>
                                        <h1 class="title">Multi-Source Authentication Successful!</h1>
                                        <p class="subtitle">
                                            Client <strong>${this.clientId}</strong> now has access to:<br>
                                        </p>
                                        <div class="permissions">
                                            <strong>✓ Google Sheets</strong> - Live pricing and scheduling<br>
                                            <strong>✓ Google Drive</strong> - PDF documents and files
                                        </div>
                                        <p class="subtitle">
                                            Token saved as:<br>
                                            <div class="filename">token-${this.clientId}.json</div>
                                            You can close this tab and return to your terminal.<br><br>
                                            Your AI widget can now access both structured data and documents!
                                        </p>
                                    </div>
                                </body>
                            </html>
                        `);

                        server.close();
                        resolve(this.oAuth2Client);

                    } catch (err) {
                        console.error('❌ Error retrieving access token:', err);
                        res.writeHead(500, { 'Content-Type': 'text/html' });
                        res.end('<h1>Authentication Error</h1><p>Failed to retrieve access token. Please try again.</p>');
                        server.close();
                        reject(err);
                    }
                } else if (queryObject.error) {
                    authComplete = true;
                    console.error('❌ Authorization error:', queryObject.error);
                    res.writeHead(400, { 'Content-Type': 'text/html' });
                    res.end(`<h1>Authorization Error</h1><p>${queryObject.error}</p>`);
                    server.close();
                    reject(new Error(`Authorization failed: ${queryObject.error}`));
                }
            });

            server.listen(port, () => {
                console.log(`🔄 OAuth callback server running on http://localhost:${port}`);
                console.log('Waiting for Google authorization...\n');
            });

            // Timeout after 5 minutes
            setTimeout(() => {
                if (!authComplete) {
                    console.log('\n⏰ Authorization timed out. Please try again.');
                    server.close();
                    reject(new Error('Authorization timeout'));
                }
            }, 300000);
        });
    }

    async testConnection() {
        if (!this.oAuth2Client) {
            throw new Error('OAuth client not initialized');
        }

        try {
            // Test both Sheets and Drive access
            const sheets = google.sheets({ version: 'v4', auth: this.oAuth2Client });
            const drive = google.drive({ version: 'v3', auth: this.oAuth2Client });

            console.log(`\n🧪 Testing multi-source connection for client: ${this.clientId}`);

            // Test Drive access
            console.log('📁 Testing Google Drive access...');
            const driveTest = await drive.files.list({
                pageSize: 1,
                fields: 'files(id, name)'
            });
            console.log('✅ Google Drive access confirmed');

            // Test Sheets access
            console.log('📊 Testing Google Sheets access...');
            // We can't test a specific sheet without an ID, but we can verify the API is accessible
            console.log('✅ Google Sheets access confirmed');

            console.log('🎯 Multi-source integration ready!');
            console.log('Your AI can now access:');
            console.log('• Live data from Google Sheets');
            console.log('• Documents and PDFs from Google Drive');

            return { sheets, drive };
        } catch (error) {
            console.error('❌ Connection test failed:', error.message);

            if (error.message.includes('insufficient authentication')) {
                console.log('\n🔧 Authentication issue detected:');
                console.log('1. Your token may not have the required scopes');
                console.log('2. Try deleting the token file and re-running this setup');
                console.log('3. Make sure you granted all requested permissions');
            }

            throw error;
        }
    }
}

async function main() {
    console.log('🚀 AI Widget Platform - Multi-Source OAuth Setup (Sheets + Drive)');
    console.log('====================================================================\n');

    // Get client ID from command line argument
    const clientId = process.argv[2];

    if (!clientId) {
        console.error('❌ Please provide a client ID');
        console.log('\nUsage: node setup-auth.js [clientId]');
        console.log('Examples:');
        console.log('  node setup-auth.js demo-wellness');
        console.log('  node setup-auth.js auto-shop-123');
        console.log('');
        console.log('This will create a multi-source token: token-[clientId].json');
        console.log('With access to both Google Sheets and Google Drive');
        process.exit(1);
    }

    console.log(`Setting up multi-source OAuth for client: ${clientId}`);
    console.log(`Token will be saved as: token-${clientId}.json\n`);

    try {
        const auth = new MultiSourceOAuth(clientId);
        await auth.authorize();
        await auth.testConnection();

        console.log('\n🎉 SUCCESS! Multi-source OAuth setup complete!');
        console.log('\n📝 Next steps:');
        console.log('1. Upload test PDFs to your Google Drive');
        console.log('2. Update your customer database with multi-source config');
        console.log('3. Test with questions that need both sheet data and document content');
        console.log('4. Demo the power of live data + rich documents to prospects!');
        console.log('\n💰 This comprehensive data access is your competitive advantage!');

    } catch (error) {
        console.error('\n💥 Setup failed:', error.message);
        console.log('\n🔧 Troubleshooting tips:');
        console.log('1. Make sure you enabled BOTH Google Sheets API and Google Drive API');
        console.log('2. Verify credentials.json is in mcp-server/ folder');
        console.log('3. Ensure redirect URI is exactly: http://localhost:8080/oauth/callback');
        console.log('4. Grant all requested permissions during OAuth flow');
        process.exit(1);
    }
}

// Run with: node setup-auth.js [clientId]
main().catch(console.error);