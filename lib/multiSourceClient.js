// lib/multiSourceClient.js
// Version that works WITHOUT pdf-parse library issues

import { google } from 'googleapis';
import fs from 'fs/promises';
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
        this.allowedFolders = [];
    }

    async initialize() {
        try {
            console.log(`🔄 Initializing Multi-Source client for: ${this.clientId}`);

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

    // ====== GOOGLE DRIVE/DOCS METHODS ======

    async getDriveDocuments(folderId = null, fileTypes = ['pdf', 'doc', 'txt']) {
        try {
            console.log(`📁 Fetching documents from Google Drive...`);

            // Build query - focusing on Google Docs and text files
            let query = '';
            const mimeTypes = {
                'pdf': 'application/pdf',
                'doc': 'application/vnd.google-apps.document',
                'gdoc': 'application/vnd.google-apps.document',
                'txt': 'text/plain',
                'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            };

            // For now, prioritize Google Docs and text files
            const supportedTypes = fileTypes.filter(type =>
                type === 'doc' || type === 'gdoc' || type === 'txt'
            );

            // Build MIME type query for supported types
            const mimeQueries = supportedTypes.map(type =>
                mimeTypes[type] ? `mimeType='${mimeTypes[type]}'` : null
            ).filter(Boolean);

            // Also include PDFs but we'll handle them differently
            if (fileTypes.includes('pdf')) {
                mimeQueries.push(`mimeType='application/pdf'`);
            }

            if (mimeQueries.length > 0) {
                query = `(${mimeQueries.join(' or ')})`;
            }

            // Add folder restriction if specified
            if (folderId) {
                query += query ? ' and ' : '';
                query += `'${folderId}' in parents`;
            }

            // Add filter to exclude trashed files
            query += query ? ' and ' : '';
            query += 'trashed=false';

            const response = await this.drive.files.list({
                q: query,
                fields: 'files(id, name, mimeType, modifiedTime, size)',
                pageSize: 100
            });

            const files = response.data.files || [];
            console.log(`📚 Found ${files.length} documents in Google Drive`);

            // Log file types found
            const typeCount = {};
            files.forEach(file => {
                const type = file.mimeType.split('/').pop();
                typeCount[type] = (typeCount[type] || 0) + 1;
            });
            console.log('   File types:', typeCount);

            return files;
        } catch (error) {
            console.error('❌ Error fetching Drive documents:', error.message);
            return [];
        }
    }

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

            if (mimeType === 'application/vnd.google-apps.document') {
                // Export Google Doc as plain text - THIS WORKS GREAT!
                const response = await this.drive.files.export({
                    fileId: fileId,
                    mimeType: 'text/plain'
                });

                content = response.data;
                console.log(`✅ Extracted ${content.length} characters from Google Doc: ${fileName}`);

            } else if (mimeType === 'text/plain') {
                // Download plain text file
                const response = await this.drive.files.get({
                    fileId: fileId,
                    alt: 'media'
                });

                content = response.data;
                console.log(`✅ Read ${content.length} characters from text file: ${fileName}`);

            } else if (mimeType === 'application/pdf') {
                // PDF Alternative Solutions:
                console.log(`📄 PDF detected: ${fileName}`);

                // OPTION 1: Inform user to convert PDFs to Google Docs
                content = `[PDF: ${fileName}] For best results, convert this PDF to a Google Doc. ` +
                    `Right-click the PDF in Google Drive and select "Open with > Google Docs"`;

                // OPTION 2: Try to export as Google Doc (if it was converted)
                try {
                    const exportResponse = await this.drive.files.export({
                        fileId: fileId,
                        mimeType: 'text/plain'
                    });
                    if (exportResponse.data) {
                        content = exportResponse.data;
                        console.log(`✅ PDF was pre-converted to Google Doc, extracted ${content.length} characters`);
                    }
                } catch (exportError) {
                    // PDF hasn't been converted to Google Doc
                    console.log(`   ℹ️ PDF not yet converted to Google Doc format`);
                }

            } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                // DOCX files
                console.log(`📄 DOCX detected: ${fileName}`);
                content = `[DOCX: ${fileName}] For best results, upload to Google Drive and it will auto-convert to Google Docs`;

            } else {
                console.log(`⚠️ Unsupported file type: ${mimeType} for ${fileName}`);
                content = `[Unsupported format: ${fileName}]`;
            }

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

    // ====== EXISTING GOOGLE SHEETS METHODS (UNCHANGED) ======

    async getSheetsData(spreadsheetId, sheetName, range = 'A:Z') {
        const cacheKey = `sheets-${spreadsheetId}-${sheetName}`;

        const cached = this.cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            console.log(`📦 Using cached data for ${sheetName}`);
            return cached.data;
        }

        try {
            console.log(`📊 Fetching data from ${sheetName} sheet`);

            const response = await this.sheets.spreadsheets.values.get({
                spreadsheetId: spreadsheetId,
                range: `${sheetName}!${range}`,
            });

            const rows = response.data.values || [];

            // Cache the result
            this.cache.set(cacheKey, {
                data: rows,
                timestamp: Date.now()
            });

            return rows;
        } catch (error) {
            console.error(`❌ Error fetching ${sheetName}:`, error.message);
            return [];
        }
    }

    // ====== UNIFIED DATA RETRIEVAL METHOD ======

    async getBusinessData(config) {
        console.log(`🔄 Fetching multi-source business data for ${this.clientId}`);

        const businessData = {
            structured: {},
            documents: {},
            summary: {},
            recommendations: [],
            lastUpdated: new Date().toISOString()
        };

        // Get structured data from Google Sheets
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

                console.log(`✅ Loaded ${businessData.structured.services?.length || 0} services`);
            } catch (error) {
                console.error('❌ Error fetching structured data:', error.message);
            }
        }

        // Get document content from Google Drive
        if (config.googleDrive?.enabled) {
            console.log('📄 Fetching documents from Google Drive...');

            try {
                const driveFiles = await this.getDriveDocuments(
                    config.googleDrive?.folderId,
                    config.googleDrive?.fileTypes || ['gdoc', 'txt', 'pdf']
                );

                // Separate files by type
                const googleDocs = driveFiles.filter(f =>
                    f.mimeType === 'application/vnd.google-apps.document'
                );
                const textFiles = driveFiles.filter(f =>
                    f.mimeType === 'text/plain'
                );
                const pdfFiles = driveFiles.filter(f =>
                    f.mimeType === 'application/pdf'
                );

                console.log(`📊 Document breakdown:`);
                console.log(`   - Google Docs: ${googleDocs.length}`);
                console.log(`   - Text files: ${textFiles.length}`);
                console.log(`   - PDFs: ${pdfFiles.length}`);

                // Process Google Docs and text files first (they work well)
                const documentsToProcess = [...googleDocs, ...textFiles].slice(0, 10);

                // Add PDFs if no other documents available
                if (documentsToProcess.length === 0 && pdfFiles.length > 0) {
                    documentsToProcess.push(...pdfFiles.slice(0, 5));
                    businessData.recommendations.push(
                        '💡 Tip: Convert PDFs to Google Docs for better text extraction. ' +
                        'Right-click PDFs in Drive and select "Open with > Google Docs"'
                    );
                }

                console.log(`📚 Processing ${documentsToProcess.length} documents...`);

                const documentContent = await Promise.all(
                    documentsToProcess.map(async file => {
                        const content = await this.getDocumentContent(
                            file.id,
                            file.mimeType,
                            file.name
                        );
                        return {
                            name: file.name,
                            content: content,
                            lastModified: file.modifiedTime,
                            type: file.mimeType,
                            wordCount: content.split(' ').length
                        };
                    })
                );

                businessData.documents = documentContent.reduce((acc, doc) => {
                    acc[doc.name] = {
                        content: doc.content,
                        lastModified: doc.lastModified,
                        type: doc.type,
                        wordCount: doc.wordCount
                    };
                    return acc;
                }, {});

                console.log(`✅ Processed ${Object.keys(businessData.documents).length} documents`);
            } catch (error) {
                console.error('❌ Error fetching document data:', error.message);
            }
        }

        // Create summary
        businessData.summary = {
            totalServices: businessData.structured.services?.length || 0,
            totalDocuments: Object.keys(businessData.documents).length,
            totalWords: Object.values(businessData.documents).reduce(
                (sum, doc) => sum + (doc.wordCount || 0), 0
            ),
            lastUpdated: businessData.lastUpdated,
            dataSource: {
                sheets: !!config.googleSheets?.enabled,
                drive: !!config.googleDrive?.enabled
            }
        };

        console.log(`📊 Data Summary: ${businessData.summary.totalServices} services, ${businessData.summary.totalDocuments} documents`);

        if (businessData.recommendations.length > 0) {
            console.log('\n💡 Recommendations:');
            businessData.recommendations.forEach(rec => console.log(`   ${rec}`));
        }

        return businessData;
    }

    // ====== PARSING HELPER METHODS ======

    parseServicesData(rows) {
        if (!rows || rows.length <= 1) return [];

        return rows.slice(1).map(row => ({
            name: row[0] || '',
            category: row[1] || '',
            duration: row[2] || '',
            price: row[3] || '',
            description: row[4] || ''
        })).filter(service => service.name);
    }

    parseScheduleData(rows) {
        if (!rows || rows.length <= 1) return [];

        return rows.slice(1).map(row => ({
            date: row[0] || '',
            time: row[1] || '',
            practitioner: row[2] || '',
            service: row[3] || '',
            status: row[4] || ''
        })).filter(slot => slot.date);
    }

    parseSpecialsData(rows) {
        if (!rows || rows.length <= 1) return [];

        return rows.slice(1).map(row => ({
            name: row[0] || '',
            description: row[1] || '',
            discount: row[2] || '',
            validUntil: row[3] || ''
        })).filter(special => special.name);
    }

    // ====== CACHE MANAGEMENT ======

    clearCache() {
        this.cache.clear();
        console.log(`🗑️ Cache cleared for ${this.clientId}`);
    }

    clearDocumentCache() {
        // Clear only document cache entries
        for (const [key, value] of this.cache.entries()) {
            if (key.startsWith('doc-content-')) {
                this.cache.delete(key);
            }
        }
        console.log(`🗑️ Document cache cleared for ${this.clientId}`);
    }
}

export default MultiSourceClient;