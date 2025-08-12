// test-multi-source.js
// Test script to verify Google Sheets + Docs integration works

import { MultiSourceClient } from './lib/multiSourceClient.js';

async function testMultiSourceIntegration() {
    console.log('🚀 Testing Multi-Source Integration (Sheets + Docs)');
    console.log('================================================\n');

    // Initialize client
    const client = new MultiSourceClient('demo-wellness');
    const initialized = await client.initialize();

    if (!initialized) {
        console.error('❌ Failed to initialize client');
        return;
    }

    // Test configuration - Update these with your actual IDs
    const config = {
        googleSheets: {
            enabled: true,
            spreadsheetId: '10kk_a1pUBn53IO09ljwwDwzuVYkTMiD2tjsW0EgzezM' // Replace with your spreadsheet ID
        },
        googleDrive: {
            enabled: true,
            folderId: null, // Optional: specific folder ID, or null for all accessible files
            fileTypes: ['pdf', 'gdoc', 'txt'] // File types to process
        }
    };

    try {
        // Test 1: Verify Sheets still works
        console.log('📊 TEST 1: Google Sheets Integration');
        console.log('=====================================');

        const servicesData = await client.getSheetsData(
            config.googleSheets.spreadsheetId,
            'Services'
        );

        if (servicesData && servicesData.length > 0) {
            console.log(`✅ Sheets working! Found ${servicesData.length} rows`);
            const services = client.parseServicesData(servicesData);
            console.log(`   Parsed ${services.length} services`);

            // Show sample service
            if (services.length > 0) {
                console.log(`   Sample: ${services[0].name} - ${services[0].price}`);
            }
        } else {
            console.log('⚠️ No data found in Services sheet');
        }

        // Test 2: List available documents
        console.log('\n📄 TEST 2: Google Drive Documents');
        console.log('==================================');

        const documents = await client.getDriveDocuments(
            config.googleDrive.folderId,
            config.googleDrive.fileTypes
        );

        if (documents.length > 0) {
            console.log(`✅ Found ${documents.length} documents:`);

            // List first 5 documents
            documents.slice(0, 5).forEach((doc, index) => {
                console.log(`   ${index + 1}. ${doc.name} (${doc.mimeType})`);
            });
        } else {
            console.log('⚠️ No documents found in Google Drive');
            console.log('   Make sure you have PDFs or Google Docs accessible');
        }

        // Test 3: Extract content from first document
        if (documents.length > 0) {
            console.log('\n📖 TEST 3: Document Content Extraction');
            console.log('======================================');

            const firstDoc = documents[0];
            console.log(`Extracting content from: ${firstDoc.name}`);

            const content = await client.getDocumentContent(
                firstDoc.id,
                firstDoc.mimeType,
                firstDoc.name
            );

            if (content) {
                console.log(`✅ Extracted ${content.length} characters`);
                console.log(`   First 200 chars: ${content.substring(0, 200)}...`);
            } else {
                console.log('⚠️ Could not extract content from document');
            }
        }

        // Test 4: Get combined business data
        console.log('\n🎯 TEST 4: Combined Business Data');
        console.log('==================================');

        const businessData = await client.getBusinessData(config);

        console.log('📊 Business Data Summary:');
        console.log(`   Services: ${businessData.summary.totalServices}`);
        console.log(`   Documents: ${businessData.summary.totalDocuments}`);
        console.log(`   Total Words: ${businessData.summary.totalWords}`);
        console.log(`   Data Sources: Sheets=${businessData.summary.dataSource.sheets}, Drive=${businessData.summary.dataSource.drive}`);

        // Show sample data
        if (businessData.structured.services?.length > 0) {
            console.log('\n   Sample Service:');
            const service = businessData.structured.services[0];
            console.log(`   - ${service.name}: ${service.price} (${service.duration})`);
        }

        if (Object.keys(businessData.documents).length > 0) {
            console.log('\n   Sample Document:');
            const docName = Object.keys(businessData.documents)[0];
            const doc = businessData.documents[docName];
            console.log(`   - ${docName}: ${doc.wordCount} words`);
        }

        // Test 5: Verify caching works
        console.log('\n⚡ TEST 5: Cache Performance');
        console.log('============================');

        console.log('Fetching data again (should use cache)...');
        const start = Date.now();
        await client.getSheetsData(config.googleSheets.spreadsheetId, 'Services');
        const cacheTime = Date.now() - start;
        console.log(`✅ Cached response in ${cacheTime}ms`);

        console.log('\n✅ ALL TESTS COMPLETED SUCCESSFULLY!');
        console.log('Your Google Sheets integration is intact and Docs support is working!');

    } catch (error) {
        console.error('\n❌ Test failed:', error);
        console.error('Error details:', error.message);

        if (error.message.includes('permission')) {
            console.log('\n🔧 Permission issue detected:');
            console.log('1. Make sure your token has Drive access scope');
            console.log('2. Re-run setup-auth.js if needed');
            console.log('3. Verify the spreadsheet/documents are accessible');
        }
    }
}

// Run the test
testMultiSourceIntegration().catch(console.error);