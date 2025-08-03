// mcp-server/wellness-sheets-server.js
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { google } from 'googleapis';
import fs from 'fs/promises';

class WellnessSheetsServer {
    constructor() {
        this.server = new Server(
            {
                name: 'wellness-sheets-server',
                version: '0.1.0',
            },
            {
                capabilities: {
                    tools: {},
                },
            }
        );

        this.auth = null;
        this.sheets = null;
        this.setupToolHandlers();
    }

    async initializeAuth(credentialsPath, tokenPath) {
        try {
            const credentials = JSON.parse(await fs.readFile(credentialsPath, 'utf8'));
            // const { client_secret, client_id, redirect_uris } = credentials.web || credentials.installed;
            const { client_secret, client_id } = credentials.web || credentials.installed;

            // this.auth = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
            // Use your specific redirect URI here too
            const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:8080/oauth/callback'; // Hard code redirect URI for development
            this.auth = new google.auth.OAuth2(
                client_id,
                client_secret,
                redirectUri
            );

            try {
                const token = JSON.parse(await fs.readFile(tokenPath, 'utf8'));
                this.auth.setCredentials(token);
            } catch (error) {
                console.log('No existing token found. Authorization required.');
            }

            this.sheets = google.sheets({ version: 'v4', auth: this.auth });
        } catch (error) {
            console.error('Error initializing Google Sheets auth:', error);
        }
    }

    setupToolHandlers() {
        this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
            tools: [
                {
                    name: 'read_service_menu',
                    description: 'Read current wellness services and pricing from Google Sheets',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            spreadsheetId: {
                                type: 'string',
                                description: 'The ID of the Google Spreadsheet'
                            },
                            servicesSheet: {
                                type: 'string',
                                description: 'Sheet name for services data',
                                default: 'Services'
                            }
                        },
                        required: ['spreadsheetId']
                    }
                },
                {
                    name: 'read_practitioner_schedule',
                    description: 'Read practitioner availability and schedule',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            spreadsheetId: {
                                type: 'string',
                                description: 'The ID of the Google Spreadsheet'
                            },
                            scheduleSheet: {
                                type: 'string',
                                description: 'Sheet name for schedule data',
                                default: 'Schedule'
                            },
                            practitioner: {
                                type: 'string',
                                description: 'Specific practitioner name (optional)'
                            }
                        },
                        required: ['spreadsheetId']
                    }
                },
                {
                    name: 'read_current_specials',
                    description: 'Read current wellness promotions and package deals',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            spreadsheetId: {
                                type: 'string',
                                description: 'The ID of the Google Spreadsheet'
                            },
                            specialsSheet: {
                                type: 'string',
                                description: 'Sheet name for specials data',
                                default: 'Specials'
                            }
                        },
                        required: ['spreadsheetId']
                    }
                },
                {
                    name: 'read_intake_policies',
                    description: 'Read intake forms, policies, and preparation instructions',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            spreadsheetId: {
                                type: 'string',
                                description: 'The ID of the Google Spreadsheet'
                            },
                            policiesSheet: {
                                type: 'string',
                                description: 'Sheet name for policies data',
                                default: 'Policies'
                            }
                        },
                        required: ['spreadsheetId']
                    }
                },
                {
                    name: 'read_wellness_packages',
                    description: 'Read multi-session packages and membership options',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            spreadsheetId: {
                                type: 'string',
                                description: 'The ID of the Google Spreadsheet'
                            },
                            packagesSheet: {
                                type: 'string',
                                description: 'Sheet name for packages data',
                                default: 'Packages'
                            }
                        },
                        required: ['spreadsheetId']
                    }
                },
                {
                    name: 'read_health_considerations',
                    description: 'Read contraindications and health screening information',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            spreadsheetId: {
                                type: 'string',
                                description: 'The ID of the Google Spreadsheet'
                            },
                            healthSheet: {
                                type: 'string',
                                description: 'Sheet name for health considerations',
                                default: 'Health'
                            }
                        },
                        required: ['spreadsheetId']
                    }
                }
            ]
        }));

        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;

            try {
                switch (name) {
                    case 'read_service_menu':
                        return await this.readServiceMenu(args.spreadsheetId, args.servicesSheet);

                    case 'read_practitioner_schedule':
                        return await this.readPractitionerSchedule(args.spreadsheetId, args.scheduleSheet, args.practitioner);

                    case 'read_current_specials':
                        return await this.readCurrentSpecials(args.spreadsheetId, args.specialsSheet);

                    case 'read_intake_policies':
                        return await this.readIntakePolicies(args.spreadsheetId, args.policiesSheet);

                    case 'read_wellness_packages':
                        return await this.readWellnessPackages(args.spreadsheetId, args.packagesSheet);

                    case 'read_health_considerations':
                        return await this.readHealthConsiderations(args.spreadsheetId, args.healthSheet);

                    default:
                        throw new Error(`Unknown tool: ${name}`);
                }
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Error: ${error.message}`
                        }
                    ]
                };
            }
        });
    }

    async readServiceMenu(spreadsheetId, sheetName = 'Services') {
        try {
            const response = await this.sheets.spreadsheets.values.get({
                spreadsheetId,
                range: `${sheetName}!A:F`,
            });

            const rows = response.data.values || [];
            if (rows.length === 0) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: 'No services found in the menu.'
                        }
                    ]
                };
            }

            // Assuming format: Service | Duration | Price | Description | Category | Notes
            const headers = rows[0];
            const servicesData = rows.slice(1).map(row => {
                const service = {};
                headers.forEach((header, index) => {
                    service[header] = row[index] || '';
                });
                return service;
            }).filter(service => service['Service']); // Filter out empty rows

            // Group by category
            const categorizedServices = servicesData.reduce((acc, service) => {
                const category = service['Category'] || 'General Services';
                if (!acc[category]) acc[category] = [];
                acc[category].push(service);
                return acc;
            }, {});

            let formattedServices = '';
            Object.entries(categorizedServices).forEach(([category, services]) => {
                formattedServices += `\n**${category.toUpperCase()}:**\n\n`;
                services.forEach(service => {
                    formattedServices += `**${service['Service']}**\n`;
                    formattedServices += `**Price:** ${service['Price'] || 'Contact for pricing'}\n`;
                    formattedServices += `**Duration:** ${service['Duration'] || 'Varies'}\n`;
                    if (service['Description']) {
                        formattedServices += `**Description:** ${service['Description']}\n`;
                    }
                    if (service['Notes']) {
                        formattedServices += `**Notes:** ${service['Notes']}\n`;
                    }
                    formattedServices += '\n';
                });
            });

            return {
                content: [
                    {
                        type: 'text',
                        text: `Current Services & Pricing:${formattedServices}`
                    }
                ]
            };
        } catch (error) {
            throw new Error(`Failed to read services menu: ${error.message}`);
        }
    }

    async readPractitionerSchedule(spreadsheetId, sheetName = 'Schedule', practitioner = null) {
        try {
            const response = await this.sheets.spreadsheets.values.get({
                spreadsheetId,
                range: `${sheetName}!A:E`,
            });

            const rows = response.data.values || [];
            if (rows.length === 0) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: 'No schedule information available.'
                        }
                    ]
                };
            }

            const headers = rows[0];
            const scheduleData = rows.slice(1).map(row => {
                const slot = {};
                headers.forEach((header, index) => {
                    slot[header] = row[index] || '';
                });
                return slot;
            });

            // Filter by practitioner if specified
            let filteredSchedule = scheduleData;
            if (practitioner) {
                filteredSchedule = scheduleData.filter(slot =>
                    slot['Practitioner']?.toLowerCase().includes(practitioner.toLowerCase())
                );
            }

            // Filter for available slots
            const availableSlots = filteredSchedule.filter(slot =>
                slot['Status']?.toLowerCase() === 'available'
            );

            if (availableSlots.length === 0) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: practitioner
                                ? `No available appointments found for ${practitioner}. Please check our schedule or consider booking with another practitioner.`
                                : 'No appointments currently available. Please call us to check for last-minute openings or to join our waitlist.'
                        }
                    ]
                };
            }

            // Group by date
            const groupedByDate = availableSlots.reduce((acc, slot) => {
                const date = slot['Date'] || 'Unknown Date';
                if (!acc[date]) acc[date] = [];
                acc[date].push(slot);
                return acc;
            }, {});

            let formattedSchedule = '';
            Object.entries(groupedByDate).forEach(([date, slots]) => {
                formattedSchedule += `\n**${date}:**\n`;
                slots.forEach(slot => {
                    formattedSchedule += `• ${slot['Time'] || 'Time TBD'}`;
                    if (slot['Practitioner']) {
                        formattedSchedule += ` with ${slot['Practitioner']}`;
                    }
                    if (slot['Service']) {
                        formattedSchedule += ` (${slot['Service']})`;
                    }
                    formattedSchedule += '\n';
                });
            });

            return {
                content: [
                    {
                        type: 'text',
                        text: `Available Appointments:${formattedSchedule}\n\nWould you like to book one of these appointments? I can help collect your information.`
                    }
                ]
            };
        } catch (error) {
            throw new Error(`Failed to read schedule: ${error.message}`);
        }
    }

    async readCurrentSpecials(spreadsheetId, sheetName = 'Specials') {
        try {
            const response = await this.sheets.spreadsheets.values.get({
                spreadsheetId,
                range: `${sheetName}!A:E`,
            });

            const rows = response.data.values || [];
            if (rows.length === 0) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: 'No current specials or promotions available.'
                        }
                    ]
                };
            }

            const specialsData = rows.slice(1).map(row => ({
                special: row[0] || '',
                description: row[1] || '',
                discount: row[2] || '',
                expires: row[3] || '',
                terms: row[4] || ''
            })).filter(special => special.special);

            // Filter for active specials
            const now = new Date();
            const activeSpecials = specialsData.filter(special => {
                if (!special.expires) return true;
                try {
                    const expiryDate = new Date(special.expires);
                    return expiryDate > now;
                } catch {
                    return true; // If date parsing fails, include the special
                }
            });

            if (activeSpecials.length === 0) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: 'No current specials available, but check back soon for new wellness packages and promotions!'
                        }
                    ]
                };
            }

            const formattedSpecials = activeSpecials.map(special => {
                let formatted = `**${special.special}**\n`;
                if (special.description) formatted += `${special.description}\n`;
                if (special.discount) formatted += `**Savings:** ${special.discount}\n`;
                if (special.expires) formatted += `**Valid until:** ${special.expires}\n`;
                if (special.terms) formatted += `**Terms:** ${special.terms}\n`;
                return formatted;
            }).join('\n');

            return {
                content: [
                    {
                        type: 'text',
                        text: `Current Wellness Specials:\n\n${formattedSpecials}`
                    }
                ]
            };
        } catch (error) {
            throw new Error(`Failed to read specials: ${error.message}`);
        }
    }

    async readIntakePolicies(spreadsheetId, sheetName = 'Policies') {
        try {
            const response = await this.sheets.spreadsheets.values.get({
                spreadsheetId,
                range: `${sheetName}!A:C`,
            });

            const rows = response.data.values || [];
            if (rows.length === 0) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: 'No policy information available.'
                        }
                    ]
                };
            }

            const policiesData = rows.slice(1).map(row => ({
                policy: row[0] || '',
                description: row[1] || '',
                category: row[2] || 'General'
            })).filter(policy => policy.policy);

            // Group by category
            const groupedPolicies = policiesData.reduce((acc, policy) => {
                if (!acc[policy.category]) acc[policy.category] = [];
                acc[policy.category].push(policy);
                return acc;
            }, {});

            let formattedPolicies = '';
            Object.entries(groupedPolicies).forEach(([category, policies]) => {
                formattedPolicies += `\n**${category.toUpperCase()}:**\n`;
                policies.forEach(policy => {
                    formattedPolicies += `• **${policy.policy}**`;
                    if (policy.description) {
                        formattedPolicies += `: ${policy.description}`;
                    }
                    formattedPolicies += '\n';
                });
            });

            return {
                content: [
                    {
                        type: 'text',
                        text: `Practice Policies & Information:${formattedPolicies}`
                    }
                ]
            };
        } catch (error) {
            throw new Error(`Failed to read policies: ${error.message}`);
        }
    }

    async readWellnessPackages(spreadsheetId, sheetName = 'Packages') {
        try {
            const response = await this.sheets.spreadsheets.values.get({
                spreadsheetId,
                range: `${sheetName}!A:F`,
            });

            const rows = response.data.values || [];
            if (rows.length === 0) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: 'No wellness packages currently available.'
                        }
                    ]
                };
            }

            const packagesData = rows.slice(1).map(row => ({
                package: row[0] || '',
                sessions: row[1] || '',
                totalPrice: row[2] || '',
                savings: row[3] || '',
                validity: row[4] || '',
                description: row[5] || ''
            })).filter(pkg => pkg.package);

            const formattedPackages = packagesData.map(pkg => {
                let formatted = `**${pkg.package}**\n`;
                if (pkg.sessions) formatted += `**Sessions:** ${pkg.sessions}\n`;
                if (pkg.totalPrice) formatted += `**Price:** ${pkg.totalPrice}\n`;
                if (pkg.savings) formatted += `**You Save:** ${pkg.savings}\n`;
                if (pkg.validity) formatted += `**Valid for:** ${pkg.validity}\n`;
                if (pkg.description) formatted += `**Details:** ${pkg.description}\n`;
                return formatted;
            }).join('\n');

            return {
                content: [
                    {
                        type: 'text',
                        text: `Wellness Packages & Memberships:\n\n${formattedPackages}\n\nPackages offer significant savings and are perfect for regular wellness maintenance!`
                    }
                ]
            };
        } catch (error) {
            throw new Error(`Failed to read packages: ${error.message}`);
        }
    }

    async readHealthConsiderations(spreadsheetId, sheetName = 'Health') {
        try {
            const response = await this.sheets.spreadsheets.values.get({
                spreadsheetId,
                range: `${sheetName}!A:D`,
            });

            const rows = response.data.values || [];
            if (rows.length === 0) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: 'Please consult with our practitioners about any health considerations.'
                        }
                    ]
                };
            }

            const healthData = rows.slice(1).map(row => ({
                service: row[0] || '',
                contraindications: row[1] || '',
                recommendations: row[2] || '',
                preparation: row[3] || ''
            })).filter(item => item.service);

            let formattedHealth = '';
            healthData.forEach(item => {
                formattedHealth += `\n**${item.service}:**\n`;
                if (item.contraindications) {
                    formattedHealth += `**Important Note:** ${item.contraindications}\n`;
                }
                if (item.recommendations) {
                    formattedHealth += `**Recommendations:** ${item.recommendations}\n`;
                }
                if (item.preparation) {
                    formattedHealth += `**Preparation:** ${item.preparation}\n`;
                }
            });

            return {
                content: [
                    {
                        type: 'text',
                        text: `Health & Safety Information:${formattedHealth}\n\n**Important:** Please inform your practitioner of any health conditions, medications, or concerns during booking or before your session.`
                    }
                ]
            };
        } catch (error) {
            throw new Error(`Failed to read health considerations: ${error.message}`);
        }
    }

    async run() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error('Wellness Google Sheets MCP server running on stdio');
    }
}

// Initialize and run the server
const server = new WellnessSheetsServer();

const credentialsPath = process.env.GOOGLE_CREDENTIALS_PATH || './credentials.json';
const tokenPath = process.env.GOOGLE_TOKEN_PATH || './token.json';

server.initializeAuth(credentialsPath, tokenPath).then(() => {
    server.run().catch(console.error);
});