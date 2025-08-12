// lib/googleSheetsClient.js - CLEAN WORKING VERSION
import { google } from 'googleapis';
import fs from 'fs/promises';
import { join } from 'path';

export class GoogleSheetsClient {
    constructor(clientId) {
        this.clientId = clientId;
        this.auth = null;
        this.sheets = null;
        this.cache = new Map();
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

    async testConnection(spreadsheetId) {
        try {
            console.log(`🧪 Testing connection to spreadsheet: ${spreadsheetId}`);

            const response = await this.sheets.spreadsheets.get({
                spreadsheetId: spreadsheetId,
                fields: 'properties.title'
            });

            console.log(`✅ Connected to: ${response.data.properties.title}`);
            return true;
        } catch (error) {
            console.error(`❌ Connection test failed:`, error.message);
            if (error.code === 404) {
                console.log('💡 Check your spreadsheet ID and make sure the sheet is shared');
            }
            return false;
        }
    }

    async getLiveServices(spreadsheetId, sheetName = 'Services') {
        const cacheKey = `services-${spreadsheetId}`;

        const cached = this.cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            console.log(`📦 Using cached services data`);
            return cached.data;
        }

        try {
            console.log(`📊 Fetching live services from ${sheetName} sheet`);

            const response = await this.sheets.spreadsheets.values.get({
                spreadsheetId: spreadsheetId,
                range: `${sheetName}!A:E`,
            });

            const rows = response.data.values || [];

            if (rows.length <= 1) {
                console.log(`⚠️ No service data found in ${sheetName}`);
                return [];
            }

            // Parse services data
            const services = rows.slice(1).map(row => ({
                name: row[0] || '',
                category: row[1] || '',
                duration: row[2] || '',
                price: row[3] || '',
                description: row[4] || ''
            })).filter(service => service.name);

            console.log(`✅ Loaded ${services.length} services from Google Sheets`);

            // Cache the result
            this.cache.set(cacheKey, {
                data: services,
                timestamp: Date.now()
            });

            return services;
        } catch (error) {
            console.error(`❌ Failed to fetch services:`, error.message);
            return [];
        }
    }

    async getLiveSchedule(spreadsheetId, sheetName = 'Schedule') {
        const cacheKey = `schedule-${spreadsheetId}`;

        const cached = this.cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            console.log(`📦 Using cached schedule data`);
            return cached.data;
        }

        try {
            console.log(`📅 Fetching live schedule from ${sheetName} sheet`);

            const response = await this.sheets.spreadsheets.values.get({
                spreadsheetId: spreadsheetId,
                range: `${sheetName}!A:E`,
            });

            const rows = response.data.values || [];

            if (rows.length <= 1) {
                console.log(`⚠️ No schedule data found in ${sheetName}`);
                return [];
            }

            // Parse schedule data
            const schedule = rows.slice(1).map(row => ({
                date: row[0] || '',
                time: row[1] || '',
                practitioner: row[2] || '',
                service: row[3] || '',
                status: row[4] || ''
            })).filter(slot => slot.date);

            console.log(`✅ Loaded ${schedule.length} schedule entries from Google Sheets`);

            // Cache the result
            this.cache.set(cacheKey, {
                data: schedule,
                timestamp: Date.now()
            });

            return schedule;
        } catch (error) {
            console.error(`❌ Failed to fetch schedule:`, error.message);
            return [];
        }
    }

    async getLiveSpecials(spreadsheetId, sheetName = 'Specials') {
        const cacheKey = `specials-${spreadsheetId}`;

        const cached = this.cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            console.log(`📦 Using cached specials data`);
            return cached.data;
        }

        try {
            console.log(`🎯 Fetching live specials from ${sheetName} sheet`);

            const response = await this.sheets.spreadsheets.values.get({
                spreadsheetId: spreadsheetId,
                range: `${sheetName}!A:D`,
            });

            const rows = response.data.values || [];

            if (rows.length <= 1) {
                console.log(`⚠️ No specials data found in ${sheetName}`);
                return [];
            }

            // Parse specials data
            const specials = rows.slice(1).map(row => ({
                name: row[0] || '',
                description: row[1] || '',
                discount: row[2] || '',
                validUntil: row[3] || ''
            })).filter(special => special.name);

            console.log(`✅ Loaded ${specials.length} specials from Google Sheets`);

            // Cache the result
            this.cache.set(cacheKey, {
                data: specials,
                timestamp: Date.now()
            });

            return specials;
        } catch (error) {
            console.error(`❌ Failed to fetch specials:`, error.message);
            return [];
        }
    }

    clearCache() {
        this.cache.clear();
        console.log(`🗑️ Cache cleared for ${this.clientId}`);
    }
}