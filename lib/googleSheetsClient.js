// lib/googleSheetsClient.js - NEW FILE
import { google } from 'googleapis';
import fs from 'fs/promises';
import { join } from 'path';

export class GoogleSheetsClient {
    constructor(clientId) {
        this.clientId = clientId;
        this.auth = null;
        this.sheets = null;
        this.cache = new Map();
        // this.cacheTimeout = 5 * 60 * 1000; // 5 minutes cache for PROD
        this.cacheTimeout = 30 * 1000; // 30 secs cache for DEV
    }

    async initialize() {
        try {
            console.log(`🔑 Initializing Google Sheets client for: ${this.clientId}`);

            // Load credentials from mcp-server directory
            const credentialsPath = join(process.cwd(), 'mcp-server', 'credentials.json');
            const tokenPath = join(process.cwd(), 'mcp-server', `token-${this.clientId}.json`);

            // Check if files exist
            try {
                await fs.access(credentialsPath);
                await fs.access(tokenPath);
            } catch (error) {
                console.error(`❌ Missing auth files for ${this.clientId}`);
                return false;
            }

            const credentials = JSON.parse(await fs.readFile(credentialsPath, 'utf8'));
            const token = JSON.parse(await fs.readFile(tokenPath, 'utf8'));

            const { client_secret, client_id } = credentials.web || credentials.installed;
            this.auth = new google.auth.OAuth2(
                client_id,
                client_secret,
                'http://localhost:8080/oauth/callback'
            );

            this.auth.setCredentials(token);
            this.sheets = google.sheets({ version: 'v4', auth: this.auth });

            console.log(`✅ Google Sheets client initialized for: ${this.clientId}`);
            return true;
        } catch (error) {
            console.error(`❌ Failed to initialize Google Sheets for ${this.clientId}:`, error.message);
            return false;
        }
    }

    async getLiveServices(spreadsheetId) {
        const cacheKey = `services-${spreadsheetId}`;

        // Check cache first
        const cached = this.cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            console.log(`📦 Using cached services data for ${this.clientId}`);
            return cached.data;
        }

        try {
            console.log(`📊 Fetching live services from Google Sheets for ${this.clientId}`);

            const response = await this.sheets.spreadsheets.values.get({
                spreadsheetId: spreadsheetId,
                range: 'Services!A:E',
            });

            const rows = response.data.values;
            if (!rows || rows.length <= 1) {
                console.log(`⚠️ No services data found in spreadsheet for ${this.clientId}`);
                return [];
            }

            // Convert to structured data
            const services = rows.slice(1).map(row => ({
                name: row[0] || '',
                category: row[1] || '',
                duration: row[2] || '',
                price: row[3] || '',
                description: row[4] || ''
            })).filter(service => service.name);

            console.log(`✅ Found ${services.length} services for ${this.clientId}`);

            // Cache the result
            this.cache.set(cacheKey, {
                data: services,
                timestamp: Date.now()
            });

            return services;
        } catch (error) {
            console.error(`❌ Failed to fetch services for ${this.clientId}:`, error.message);
            return [];
        }
    }

    async getLiveSchedule(spreadsheetId, date = null) {
        const cacheKey = `schedule-${spreadsheetId}-${date || 'all'}`;

        const cached = this.cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            console.log(`📦 Using cached schedule data for ${this.clientId}`);
            return cached.data;
        }

        try {
            console.log(`📅 Fetching live schedule from Google Sheets for ${this.clientId}`);

            const response = await this.sheets.spreadsheets.values.get({
                spreadsheetId: spreadsheetId,
                range: 'Schedule!A:E',
            });

            const rows = response.data.values;
            if (!rows || rows.length <= 1) {
                console.log(`⚠️ No schedule data found in spreadsheet for ${this.clientId}`);
                return [];
            }

            let schedule = rows.slice(1).map(row => ({
                date: row[0] || '',
                time: row[1] || '',
                practitioner: row[2] || '',
                service: row[3] || '',
                status: row[4] || ''
            })).filter(slot => slot.date);

            // Filter by date if provided
            if (date) {
                schedule = schedule.filter(slot => slot.date === date);
            }

            console.log(`✅ Found ${schedule.length} schedule entries for ${this.clientId}`);

            // Cache the result
            this.cache.set(cacheKey, {
                data: schedule,
                timestamp: Date.now()
            });

            return schedule;
        } catch (error) {
            console.error(`❌ Failed to fetch schedule for ${this.clientId}:`, error.message);
            return [];
        }
    }

    async getLiveSpecials(spreadsheetId) {
        const cacheKey = `specials-${spreadsheetId}`;

        const cached = this.cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            console.log(`📦 Using cached specials data for ${this.clientId}`);
            return cached.data;
        }

        try {
            console.log(`🎉 Fetching live specials from Google Sheets for ${this.clientId}`);

            const response = await this.sheets.spreadsheets.values.get({
                spreadsheetId: spreadsheetId,
                range: 'Specials!A:D',
            });

            const rows = response.data.values;
            if (!rows || rows.length <= 1) {
                console.log(`⚠️ No specials data found in spreadsheet for ${this.clientId}`);
                return [];
            }

            const specials = rows.slice(1).map(row => ({
                name: row[0] || '',
                description: row[1] || '',
                discount: row[2] || '',
                validUntil: row[3] || ''
            })).filter(special => special.name);

            console.log(`✅ Found ${specials.length} specials for ${this.clientId}`);

            this.cache.set(cacheKey, {
                data: specials,
                timestamp: Date.now()
            });

            return specials;
        } catch (error) {
            console.error(`❌ Failed to fetch specials for ${this.clientId}:`, error.message);
            return [];
        }
    }

    async testConnection(spreadsheetId) {
        try {
            console.log(`🧪 Testing connection to spreadsheet for ${this.clientId}`);

            const metadata = await this.sheets.spreadsheets.get({
                spreadsheetId: spreadsheetId
            });

            console.log(`✅ Successfully connected to: "${metadata.data.properties.title}"`);

            const sheetNames = metadata.data.sheets.map(sheet => sheet.properties.title);
            console.log(`📊 Available sheets: ${sheetNames.join(', ')}`);

            return true;
        } catch (error) {
            console.error(`❌ Connection test failed for ${this.clientId}:`, error.message);
            return false;
        }
    }

    // Clear cache (useful for testing)
    clearCache() {
        this.cache.clear();
        console.log(`🗑️ Cache cleared for ${this.clientId}`);
    }
}