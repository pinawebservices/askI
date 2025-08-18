// ============================================
// Simple Admin API to Add New Clients
// ============================================

// app/api/admin/add-client/route.js

export async function POST(request) {
    const { clientId, spreadsheetId } = await request.json();

    // Save to your database
    // Then process their documents
    const vectorStore = new PineconeVectorStore();
    await vectorStore.initializeIndex();

    // Clear any old data
    await vectorStore.clearClientData(clientId);

    // Process new documents
    const chunks = await vectorStore.processClientDocuments(clientId);

    return Response.json({
        success: true,
        message: `Added ${clientId} with ${chunks} chunks`
    });
}