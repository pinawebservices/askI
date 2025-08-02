'use client';

export default function ApartmentsPage() {
  return (
      <>
        <style jsx>{`
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 20px;
                    line-height: 1.6;
                    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
                    min-height: 100vh;
                    color: #e0e0e0;
                }
                .content {
                    background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
                    padding: 40px;
                    border-radius: 15px;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                    border: 1px solid #4a5568;
                }
                .header {
                    text-align: center;
                    margin-bottom: 40px;
                }
                .header h1 {
                    color: #63b3ed;
                    font-size: 2.5em;
                    margin-bottom: 10px;
                    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
                }
                .header p {
                    font-size: 1.2em;
                    color: #a0aec0;
                }
                h2 {
                    color: #81e6d9;
                    border-bottom: 2px solid #4a5568;
                    padding-bottom: 10px;
                    margin-top: 30px;
                }
                .amenities {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 20px;
                    margin: 30px 0;
                }
                .amenity {
                    padding: 25px;
                    background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%);
                    border-radius: 12px;
                    border-left: 4px solid #63b3ed;
                    box-shadow: 0 8px 16px rgba(0,0,0,0.2);
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                .amenity:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 12px 24px rgba(0,0,0,0.3);
                }
                .amenity h3 {
                    color: #81e6d9;
                    margin-bottom: 10px;
                    font-size: 1.1em;
                }
                .amenity p {
                    color: #cbd5e0;
                    margin: 0;
                }
                .cta {
                    background: linear-gradient(135deg, #2b6cb0 0%, #2c5282 100%);
                    color: white;
                    padding: 35px;
                    border-radius: 15px;
                    text-align: center;
                    margin: 30px 0;
                    box-shadow: 0 10px 20px rgba(43, 108, 176, 0.3);
                    border: 1px solid #3182ce;
                }
                .cta h2 {
                    color: white;
                    border: none;
                    margin-bottom: 15px;
                }
                .cta p {
                    margin: 10px 0;
                    font-size: 1.1em;
                }
                ul {
                    background: #2d3748;
                    padding: 20px 30px;
                    border-radius: 10px;
                    border-left: 4px solid #81e6d9;
                }
                li {
                    margin: 8px 0;
                    color: #e2e8f0;
                }
                li strong {
                    color: #81e6d9;
                }
                .location-info {
                    background: #2d3748;
                    padding: 20px;
                    border-radius: 10px;
                    border-left: 4px solid #f6ad55;
                    margin-top: 20px;
                }
                .location-info p {
                    margin: 5px 0;
                    color: #e2e8f0;
                }
                .chat-prompt {
                    background: linear-gradient(135deg, #1E88E5 0%, #1976D2 100%);
                    color: white;
                    padding: 30px;
                    border-radius: 15px;
                    text-align: center;
                    margin: 40px 0;
                    box-shadow: 0 10px 20px rgba(30, 136, 229, 0.3);
                }
                .chat-prompt h2 {
                    color: white;
                    border: none;
                    margin-bottom: 15px;
                }
                .sample-questions {
                    background: rgba(255,255,255,0.1);
                    padding: 20px;
                    border-radius: 10px;
                    margin: 20px 0;
                    text-align: left;
                    display: inline-block;
                }
                .sample-questions ul {
                    background: none;
                    padding: 0;
                    border: none;
                    margin: 0;
                }
                /* Scrollbar styling for dark theme */
                ::-webkit-scrollbar {
                    width: 8px;
                }
                ::-webkit-scrollbar-track {
                    background: #2d3748;
                }
                ::-webkit-scrollbar-thumb {
                    background: #4a5568;
                    border-radius: 4px;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background: #63b3ed;
                }
            `}</style>

        <div className="content">
          <div className="header">
            <h1>Sunset Bay Apartments</h1>
            <p>Luxury Living in the Heart of Fort Lauderdale</p>
          </div>

          <h2>Welcome Home to Resort-Style Living</h2>
          <p>
            Discover luxury apartment living at Sunset Bay Apartments, where modern elegance meets
            prime Fort Lauderdale location. Just minutes from Las Olas Boulevard and the beach,
            our community offers the perfect blend of urban convenience and coastal lifestyle.
          </p>

          <div className="amenities">
            <div className="amenity">
              <h3>🏊‍♀️ Resort-Style Pool</h3>
              <p>Sparkling pool with cabanas and sundeck</p>
            </div>
            <div className="amenity">
              <h3>💪 Fitness Center</h3>
              <p>State-of-the-art equipment and yoga studio</p>
            </div>
            <div className="amenity">
              <h3>🐕 Pet Paradise</h3>
              <p>On-site dog park and pet washing station</p>
            </div>
            <div className="amenity">
              <h3>🏢 Rooftop Deck</h3>
              <p>Panoramic city and water views</p>
            </div>
          </div>

          <div className="chat-prompt">
            <h2>💬 Try Our AI Assistant!</h2>
            <p><strong>Ask questions about our apartments and see the structured responses:</strong></p>
            <div className="sample-questions">
              <ul>
                <li>"What apartments do you have available?"</li>
                <li>"Show me your floor plans and pricing"</li>
                <li>"What amenities do you offer?"</li>
                <li>"Can I schedule a tour?"</li>
                <li>"Do you allow pets?"</li>
                <li>"What's included in the rent?"</li>
              </ul>
            </div>
            <p><em>Click the blue chat button in the bottom-right corner!</em></p>
          </div>

          <div className="cta">
            <h2>Ready to Find Your New Home?</h2>
            <p>Schedule a tour today and see why Sunset Bay is Fort Lauderdale's premier apartment community!</p>
            <p><strong>The AI assistant will collect your information and schedule a tour!</strong></p>
          </div>

          <h2>Floor Plans Available</h2>
          <ul>
            <li><strong>Studios:</strong> Starting at $1,850/month - Perfect for professionals</li>
            <li><strong>One Bedroom:</strong> Starting at $2,200/month - Most popular!</li>
            <li><strong>Two Bedroom:</strong> Starting at $2,900/month - Great for roommates</li>
            <li><strong>Penthouse:</strong> Starting at $4,200/month - Luxury living</li>
          </ul>

          <h2>Prime Location</h2>
          <div className="location-info">
            <p>📍 2500 Bayview Drive, Fort Lauderdale, FL</p>
            <p>🏖️ 10 minutes to the beach</p>
            <p>🛍️ 5 minutes to Las Olas Boulevard</p>
            <p>🚗 Easy highway access</p>
            <p>🚌 Public transportation nearby</p>
          </div>
        </div>

        {/* AI Chatbot Widget for Apartment Complex */}
        <script
            dangerouslySetInnerHTML={{
              __html: `
                        window.aiChatbotConfig = {
                            apiUrl: "http://localhost:3000",
                            businessType: "apartment_complex", 
                            businessName: "Sunset Bay Apartments",
                            customerId: "sunset-bay-001",
                            theme: {
                                primaryColor: "#1E88E5",
                                textColor: "#FFFFFF"
                            }
                        };
                    `
            }}
        />
        <script src="http://localhost:3000/embed.js" />
      </>
  );
}