// lib/multiSourceClient.js - UPDATED with folder restrictions
import { google } from 'googleapis';
import fs from 'fs/promises';
import pdf from 'pdf-parse';
import { join } from 'path';

export class MultiSourceClient {
    constructor(clientId) {
        this.clientId = clientId;
        this.auth = null;
        this.sheets = null;
        this.drive = null;
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes for sheets
        this.documentCacheTimeout = 30 * 60 * 1000; // 30 minutes for documents

        // Security: Define allowed folders per client
        this.allowedFolders = this.getAllowedFolders(clientId);
    }

    // Define which folders each client can access
    getAllowedFolders(clientId) {
        const folderPermissions = {
            'demo-wellness': [
                // '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms', // Wellness policies folder
                '1VpMAJYaJ_k-lyGuBGgsnR5OGRxRcN63e'  // Wellness all documents folder
            ],
            'demo-auto': [
                '1DxkOXu2ZTC7pH0fQxDfFbilnYWsrtufq09QrhG4vrono'  // Auto shop documents folder
            ],
            'demo-restaurant': [
                '1ExlPYv3aUD8qI1gRyEgGcjmoZXtsuvgr10RsiH5wspop'  // Restaurant menus folder
            ]
            // Add more clients and their allowed folders
        };

        return folderPermissions[clientId] || [];
    }

    async initialize() {
        try {
            console.log(`🔑 Initializing Multi-Source client for: ${this.clientId}`);
            console.log(`🛡️ Allowed folders: ${this.allowedFolders.length} configured`);

            // [Previous auth code remains the same...]
            const credentialsPath = join(process.cwd(), 'mcp-server', 'credentials.json');
            const clientTokenPath = join(process.cwd(), 'mcp-server', `token-${this.clientId}.json`);
            const genericTokenPath = join(process.cwd(), 'mcp-server', 'token.json');

            let tokenPath = null;
            try {
                await fs.access(clientTokenPath);
                tokenPath = clientTokenPath;
                console.log(`🎯 Using client-specific token for multi-source`);
            } catch (error) {
                await fs.access(genericTokenPath);
                tokenPath = genericTokenPath;
                console.log(`🔄 Using generic token for multi-source`);
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

            // Initialize both Sheets and Drive APIs
            this.sheets = google.sheets({ version: 'v4', auth: this.auth });
            this.drive = google.drive({ version: 'v3', auth: this.auth });

            console.log(`✅ Multi-Source client initialized for: ${this.clientId}`);
            return true;
        } catch (error) {
            console.error(`❌ Failed to initialize Multi-Source client for ${this.clientId}:`, error);
            return false;
        }
    }

    // SECURE: Only access documents from allowed folders
    async getDriveDocuments(requestedFolderId = null, fileTypes = ['pdf', 'doc', 'txt']) {
        // Security check: Ensure requested folder is in allowed list
        const foldersToSearch = this.getAuthorizedFolders(requestedFolderId);

        if (foldersToSearch.length === 0) {
            console.log(`🛡️ No authorized folders for ${this.clientId} - access denied`);
            return [];
        }

        const cacheKey = `drive-docs-${foldersToSearch.join(',')}-${fileTypes.join(',')}`;

        const cached = this.cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < this.documentCacheTimeout) {
            console.log(`📦 Using cached document list`);
            return cached.data;
        }

        try {
            console.log(`📄 Searching authorized folders for documents`);
            console.log(`🛡️ Authorized folders: ${foldersToSearch.length}`);

            let allFiles = [];

            // Search each authorized folder
            for (const folderId of foldersToSearch) {
                const folderFiles = await this.searchFolderForDocuments(folderId, fileTypes);
                allFiles = allFiles.concat(folderFiles);
            }

            console.log(`📁 Found ${allFiles.length} authorized documents`);

            // Cache the result
            this.cache.set(cacheKey, {
                data: allFiles,
                timestamp: Date.now()
            });

            return allFiles;
        } catch (error) {
            console.error('❌ Failed to fetch authorized documents:', error.message);
            return [];
        }
    }

    // Determine which folders this client is authorized to access
    getAuthorizedFolders(requestedFolderId) {
        if (requestedFolderId) {
            // Check if requested folder is in allowed list
            if (this.allowedFolders.includes(requestedFolderId)) {
                console.log(`✅ Access granted to requested folder: ${requestedFolderId}`);
                return [requestedFolderId];
            } else {
                console.log(`🚫 Access denied to folder: ${requestedFolderId}`);
                console.log(`🛡️ Client ${this.clientId} is only authorized for: ${this.allowedFolders.join(', ')}`);
                return [];
            }
        } else {
            // No specific folder requested, use all allowed folders
            console.log(`📂 Using all authorized folders for ${this.clientId}`);
            return this.allowedFolders;
        }
    }

    // Search a specific folder for documents
    async searchFolderForDocuments(folderId, fileTypes) {
        try {
            // Build query for different file types
            const mimeTypes = {
                pdf: "mimeType='application/pdf'",
                doc: "mimeType='application/vnd.openxmlformats-officedocument.wordprocessingml.document'",
                txt: "mimeType='text/plain'",
                gdoc: "mimeType='application/vnd.google-apps.document'"
            };

            const typeQueries = fileTypes.map(type => mimeTypes[type]).filter(Boolean);
            let query = `(${typeQueries.join(' or ')}) and '${folderId}' in parents and trashed=false`;

            console.log(`🔍 Searching folder ${folderId} with query: ${query}`);

            const response = await this.drive.files.list({
                q: query,
                fields: 'files(id, name, mimeType, modifiedTime, size, parents)',
                orderBy: 'modifiedTime desc',
                pageSize: 10 // Limit per folder for performance
            });

            const files = response.data.files || [];
            console.log(`📁 Found ${files.length} documents in folder ${folderId}`);

            // Add folder info to each file for tracking
            return files.map(file => ({
                ...file,
                sourceFolder: folderId
            }));

        } catch (error) {
            console.error(`❌ Error searching folder ${folderId}:`, error.message);
            return [];
        }
    }

    // [Rest of the methods remain the same - getDocumentContent, getBusinessData, etc.]
    async getDocumentContent(fileId, mimeType, fileName = 'unknown') {
        const cacheKey = `doc-content-${fileId}`;

        const cached = this.cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < this.documentCacheTimeout) {
            console.log(`📦 Using cached content for: ${fileName}`);
            return cached.data;
        }

        try {
            console.log(`📖 Extracting content from: ${fileName} (${mimeType})`);
            let content = '';

            if (mimeType === 'application/pdf') {
                // Download PDF and extract text
                const response = await this.drive.files.get({
                    fileId: fileId,
                    alt: 'media'
                }, { responseType: 'arraybuffer' });

                const pdfData = await pdf(Buffer.from(response.data));
                content = pdfData.text;
                console.log(`📄 Extracted ${content.length} characters from PDF: ${fileName}`);

            } else if (mimeType === 'application/vnd.google-apps.document') {
                // Export Google Doc as text
                const response = await this.drive.files.export({
                    fileId: fileId,
                    mimeType: 'text/plain'
                });

                content = response.data;
                console.log(`📄 Extracted ${content.length} characters from Google Doc: ${fileName}`);
            }
            // Add other file types as needed...

            // Cache the result
            this.cache.set(cacheKey, {
                data: content,
                timestamp: Date.now()
            });

            return content;

        } catch (error) {
            console.error(`❌ Failed to extract content from ${fileName}:`, error.message);
            return '';
        }
    }

    // Get business data with folder restrictions
    async getBusinessData(config) {
        console.log(`🔄 Fetching secure business data for ${this.clientId}`);

        const businessData = {
            structured: {},
            documents: {},
            security: {
                allowedFolders: this.allowedFolders,
                accessRestricted: true
            },
            summary: {},
            lastUpdated: new Date().toISOString()
        };

        // Get structured data from Google Sheets (unchanged)
        if (config.googleSheets?.enabled && config.googleSheets?.spreadsheetId) {
            console.log('📊 Fetching structured data from Google Sheets...');

            try {
                const [services, schedule, specials] = await Promise.all([
                    this.getSheetsData(config.googleSheets.spreadsheetId, 'Services'),
                    this.getSheetsData(config.googleSheets.spreadsheetId, 'Schedule'),
                    this.getSheetsData(config.googleSheets.spreadsheetId, 'Specials')
                ]);

                businessData.structured = {
                    services: this.parseServicesData(services),
                    schedule: this.parseScheduleData(schedule),
                    specials: this.parseSpecialsData(specials)
                };
            } catch (error) {
                console.error('❌ Error fetching structured data:', error.message);
            }
        }

        // Get document content from authorized Google Drive folders only
        if (config.googleDrive?.enabled && this.allowedFolders.length > 0) {
            console.log('📄 Fetching documents from authorized Google Drive folders...');

            try {
                const driveFiles = await this.getDriveDocuments(
                    config.googleDrive?.folderId,
                    config.googleDrive?.fileTypes || ['pdf', 'gdoc', 'txt']
                );

                // Process documents (limit for performance)
                const documentsToProcess = driveFiles.slice(0, 5);
                console.log(`📚 Processing ${documentsToProcess.length} authorized documents...`);

                const documentContent = await Promise.all(
                    documentsToProcess.map(async file => {
                        const content = await this.getDocumentContent(file.id, file.mimeType, file.name);
                        return {
                            name: file.name,
                            content: content,
                            lastModified: file.modifiedTime,
                            type: file.mimeType,
                            sourceFolder: file.sourceFolder,
                            wordCount: content.split(' ').length
                        };
                    })
                );

                businessData.documents = documentContent.reduce((acc, doc) => {
                    acc[doc.name] = {
                        content: doc.content,
                        lastModified: doc.lastModified,
                        type: doc.type,
                        sourceFolder: doc.sourceFolder,
                        wordCount: doc.wordCount
                    };
                    return acc;
                }, {});

                console.log(`✅ Secure document data: ${Object.keys(businessData.documents).length} documents from authorized folders`);
            } catch (error) {
                console.error('❌ Error fetching authorized document data:', error.message);
            }
        } else if (config.googleDrive?.enabled && this.allowedFolders.length === 0) {
            console.log(`🚫 Google Drive enabled but no authorized folders for ${this.clientId}`);
        }

        // Create summary
        businessData.summary = {
            totalServices: businessData.structured.services?.length || 0,
            totalDocuments: Object.keys(businessData.documents).length,
            totalWords: Object.values(businessData.documents).reduce((sum, doc) => sum + (doc.wordCount || 0), 0),
            authorizedFolders: this.allowedFolders.length,
            dataSource: {
                sheets: !!config.googleSheets?.enabled,
                drive: !!config.googleDrive?.enabled,
                secure: true
            }
        };

        console.log(`📊 Secure Data Summary: ${businessData.summary.totalServices} services, ${businessData.summary.totalDocuments} documents from ${businessData.summary.authorizedFolders} authorized folders`);

        return businessData;
    }

    // Helper methods remain the same...
    async getSheetsData(spreadsheetId, sheetName, range = 'A:Z') {
        // [Same as before...]
    }

    parseServicesData(rows) {
        // [Same as before...]
    }

    // Add method to update allowed folders (for client management)
    updateAllowedFolders(newFolders) {
        console.log(`🔧 Updating allowed folders for ${this.clientId}`);
        console.log(`Old: ${this.allowedFolders.join(', ')}`);
        console.log(`New: ${newFolders.join(', ')}`);
        this.allowedFolders = newFolders;
        this.clearCache(); // Clear cache when permissions change
    }

    clearCache() {
        this.cache.clear();
        console.log(`🗑️ All caches cleared for ${this.clientId}`);
    }
}