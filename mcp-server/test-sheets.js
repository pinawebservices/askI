// mcp-server/test-sheets.js - Test your Google Sheets connection
import { google } from 'googleapis';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TOKEN_PATH = join(__dirname, 'token.json');
const CREDENTIALS_PATH = join(__dirname, 'credentials.json');

class SheetsTestRunner {
    constructor() {
        this.auth = null;
        this.sheets = null;
    }

    async initialize() {
        try {
            console.log('🔑 Loading authentication...');

            // Load credentials
            const credentialsContent = await fs.readFile(CREDENTIALS_PATH, 'utf8');
            const credentials = JSON.parse(credentialsContent);
            const { client_secret, client_id } = credentials.web || credentials.installed;

            // Set up OAuth2 client
            const redirectUri = 'http://localhost:8080/oauth/callback';
            this.auth = new google.auth.OAuth2(client_id, client_secret, redirectUri);

            // Load saved token
            const tokenContent = await fs.readFile(TOKEN_PATH, 'utf8');
            const token = JSON.parse(tokenContent);
            this.auth.setCredentials(token);

            // Initialize Sheets API
            this.sheets = google.sheets({ version: 'v4', auth: this.auth });

            console.log('✅ Authentication successful!');
            return true;

        } catch (error) {
            console.error('❌ Authentication failed:', error.message);
            console.log('\nMake sure you have:');
            console.log('1. Run setup-auth.js successfully');
            console.log('2. credentials.json file exists');
            console.log('3. token.json file was created');
            return false;
        }
    }

    async testBasicConnection(spreadsheetId) {
        try {
            console.log('\n🧪 Testing basic connection...');

            // Get spreadsheet metadata
            const metadata = await this.sheets.spreadsheets.get({
                spreadsheetId: spreadsheetId
            });

            console.log('✅ Connected to spreadsheet:', metadata.data.properties.title);
            console.log('📊 Available sheets:');

            metadata.data.sheets.forEach(sheet => {
                console.log(`   - ${sheet.properties.title} (${sheet.properties.gridProperties.rowCount} rows)`);
            });

            return true;
        } catch (error) {
            console.error('❌ Basic connection test failed:', error.message);

            if (error.code === 404) {
                console.log('\n🔍 Troubleshooting:');
                console.log('1. Double-check your spreadsheet ID');
                console.log('2. Make sure the spreadsheet is shared with your Google account');
                console.log('3. Verify the spreadsheet exists and you have access');
            }
            return false;
        }
    }

    async testReadServices(spreadsheetId) {
        try {
            console.log('\n📋 Testing Services sheet...');

            const response = await this.sheets.spreadsheets.values.get({
                spreadsheetId: spreadsheetId,
                range: 'Services!A:E',
            });

            const rows = response.data.values;
            if (!rows || rows.length === 0) {
                console.log('⚠️ No data found in Services sheet');
                return false;
            }

            console.log('✅ Services data found:');
            console.log(`   Headers: ${rows[0].join(' | ')}`);
            console.log(`   Data rows: ${rows.length - 1}`);

            // Show sample services
            rows.slice(1, 4).forEach((row, index) => {
                console.log(`   ${index + 1}. ${row[0]} - ${row[3]} (${row[2]})`);
            });

            return true;
        } catch (error) {
            console.error('❌ Services test failed:', error.message);
            return false;
        }
    }

    async testReadSchedule(spreadsheetId) {
        try {
            console.log('\n📅 Testing Schedule sheet...');

            const response = await this.sheets.spreadsheets.values.get({
                spreadsheetId: spreadsheetId,
                range: 'Schedule!A:E',
            });

            const rows = response.data.values;
            if (!rows || rows.length === 0) {
                console.log('⚠️ No data found in Schedule sheet');
                return false;
            }

            console.log('✅ Schedule data found:');
            console.log(`   Headers: ${rows[0].join(' | ')}`);
            console.log(`   Appointments: ${rows.length - 1}`);

            // Show available appointments
            const available = rows.slice(1).filter(row => row[4] === 'Available');
            console.log(`   Available slots: ${available.length}`);

            available.slice(0, 3).forEach((row, index) => {
                console.log(`   ${index + 1}. ${row[1]} on ${row[0]} - ${row[2]} (${row[3]})`);
            });

            return true;
        } catch (error) {
            console.error('❌ Schedule test failed:', error.message);
            return false;
        }
    }

    async testReadSpecials(spreadsheetId) {
        try {
            console.log('\n🎉 Testing Specials sheet...');

            const response = await this.sheets.spreadsheets.values.get({
                spreadsheetId: spreadsheetId,
                range: 'Specials!A:D',
            });

            const rows = response.data.values;
            if (!rows || rows.length === 0) {
                console.log('⚠️ No data found in Specials sheet');
                return false;
            }

            console.log('✅ Specials data found:');
            rows.slice(1).forEach((row, index) => {
                console.log(`   ${index + 1}. ${row[0]}: ${row[1]} (${row[2]})`);
            });

            return true;
        } catch (error) {
            console.error('❌ Specials test failed:', error.message);
            return false;
        }
    }

    async simulateAIQuery(spreadsheetId) {
        try {
            console.log('\n🤖 Simulating AI chatbot queries...');

            // Query 1: Get service pricing
            console.log('\n   Query: "What are your massage prices?"');
            const servicesResponse = await this.sheets.spreadsheets.values.get({
                spreadsheetId: spreadsheetId,
                range: 'Services!A:E',
            });

            const services = servicesResponse.data.values.slice(1);
            const massages = services.filter(row => row[1] === 'Massage');

            console.log('   AI Response would include:');
            massages.forEach(service => {
                console.log(`     - ${service[0]}: ${service[3]} (${service[2]})`);
            });

            // Query 2: Check availability
            console.log('\n   Query: "Do you have any appointments tomorrow?"');
            const scheduleResponse = await this.sheets.spreadsheets.values.get({
                spreadsheetId: spreadsheetId,
                range: 'Schedule!A:E',
            });

            const schedule = scheduleResponse.data.values.slice(1);
            const tomorrow = '2025-08-12'; // Adjust based on your test data
            const available = schedule.filter(row => row[0] === tomorrow && row[4] === 'Available');

            console.log('   AI Response would include:');
            if (available.length > 0) {
                available.forEach(slot => {
                    console.log(`     - ${slot[1]} with ${slot[2]} for ${slot[3]}`);
                });
            } else {
                console.log('     - "No available appointments found for that date"');
            }

            // Query 3: Current specials
            console.log('\n   Query: "Do you have any current specials?"');
            const specialsResponse = await this.sheets.spreadsheets.values.get({
                spreadsheetId: spreadsheetId,
                range: 'Specials!A:D',
            });

            const specials = specialsResponse.data.values.slice(1);
            console.log('   AI Response would include:');
            specials.forEach(special => {
                console.log(`     - ${special[0]}: ${special[1]} (Valid until ${special[3]})`);
            });

            return true;
        } catch (error) {
            console.error('❌ AI simulation test failed:', error.message);
            return false;
        }
    }

    async runAllTests(spreadsheetId) {
        console.log('🚀 Google Sheets API Test Suite');
        console.log('================================');
        console.log(`Testing with spreadsheet ID: ${spreadsheetId}\n`);

        const tests = [
            () => this.testBasicConnection(spreadsheetId),
            () => this.testReadServices(spreadsheetId),
            () => this.testReadSchedule(spreadsheetId),
            () => this.testReadSpecials(spreadsheetId),
            () => this.simulateAIQuery(spreadsheetId)
        ];

        let passed = 0;
        for (const test of tests) {
            const result = await test();
            if (result) passed++;
        }

        console.log('\n' + '='.repeat(50));
        console.log(`📊 Test Results: ${passed}/${tests.length} passed`);

        if (passed === tests.length) {
            console.log('🎉 ALL TESTS PASSED! Your Google Sheets integration is ready!');
            console.log('\n💰 This is HUGE for your sales demos:');
            console.log('   - Real-time pricing updates');
            console.log('   - Live availability checking');
            console.log('   - Current promotions automatically shown');
            console.log('   - Zero maintenance for clients');
        } else {
            console.log('⚠️ Some tests failed. Check the errors above.');
        }

        return passed === tests.length;
    }
}

async function main() {
    // Get spreadsheet ID from command line or prompt for it
    const spreadsheetId = process.argv[2];

    if (!spreadsheetId) {
        console.error('❌ Please provide a spreadsheet ID');
        console.log('\nUsage: node test-sheets.js YOUR_SPREADSHEET_ID');
        console.log('\nTo get your spreadsheet ID:');
        console.log('1. Open your Google Sheet');
        console.log('2. Look at the URL');
        console.log('3. Copy the ID from: https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit');
        process.exit(1);
    }

    const tester = new SheetsTestRunner();

    const initialized = await tester.initialize();
    if (!initialized) {
        process.exit(1);
    }

    await tester.runAllTests(spreadsheetId);
}

main().catch(console.error);