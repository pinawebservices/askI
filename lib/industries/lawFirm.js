// lib/industries/lawFirm.js
import { IndustryConfig } from "../config/industryConfig";

const lawFirmConfig = {
    industryType: "law_firm",
    displayName: "Law Firm",

    complianceRules: [
        'You MUST NOT provide legal advice. Only provide general information.',
        'Always recommend consulting with an attorney for specific legal situations.',
        'Never predict case outcomes or guarantee results.',
        'Do not create attorney-client privilege expectations.'
    ],

    urgencyIndicators: [
        'arrested', 'court date', 'sued', 'warrant', 'deadline',
        'served', 'subpoena', 'emergency', 'police', 'jail',
        'statute of limitations', 'foreclosure', 'eviction'
    ],

    contextualTriggers: {
        highUrgency: ['arrested', 'court tomorrow', 'warrant', 'in jail'],
        mediumUrgency: ['sued', 'served papers', 'deadline approaching'],
        requiresSpecialist: {
            'criminal': ['arrested', 'charged', 'police', 'criminal'],
            'injury': ['accident', 'injured', 'hurt', 'medical bills'],
            'family': ['divorce', 'custody', 'child support'],
            'business': ['contract', 'partnership', 'incorporation', 'LLC']
        }
    },

    getSystemPromptEnhancement(context) {
        const { userMessage, businessName } = context;

        let enhancement = `You are an AI assistant for ${businessName}, a professional law firm.

CRITICAL COMPLIANCE REQUIREMENTS:
${this.complianceRules.map(rule => `- ${rule}`).join('\n')}

PROFESSIONAL CONDUCT:
- Maintain attorney-client confidentiality expectations
- Express appropriate empathy for legal situations
- Emphasize urgency for time-sensitive legal matters
- Use proper legal terminology while keeping explanations accessible
`;

        // Check for urgency
        const urgencyLevel = this.detectUrgency(userMessage);
        if (urgencyLevel) {
            enhancement += `\n⚠️ URGENT MATTER DETECTED (${urgencyLevel}): Prioritize immediate assistance and expedited intake.`;
        }

        // Check for practice area
        const practiceArea = this.detectPracticeArea(userMessage);
        if (practiceArea) {
            enhancement += `\n📋 PRACTICE AREA: ${practiceArea} - Use relevant examples and terminology for this area of law.`;
        }

        return enhancement;
    },

    detectUrgency(message) {
        const lower = message.toLowerCase();
        for (const indicator of this.contextualTriggers.highUrgency) {
            if (lower.includes(indicator)) return 'HIGH';
        }
        for (const indicator of this.contextualTriggers.mediumUrgency) {
            if (lower.includes(indicator)) return 'MEDIUM';
        }
        return null;
    },

    detectPracticeArea(message) {
        const lower = message.toLowerCase();
        for (const [area, triggers] of Object.entries(this.contextualTriggers.requiresSpecialist)) {
            if (triggers.some(trigger => lower.includes(trigger))) {
                return area.charAt(0).toUpperCase() + area.slice(1) + ' Law';
            }
        }
        return null;
    }
};

// Register the configuration
IndustryConfig.register('law_firm', lawFirmConfig);

export default lawFirmConfig;