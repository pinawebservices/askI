// lib/industries/defaultIndustry.js
import { IndustryConfig } from '../config/industryConfig.js';

const defaultConfig = {
    industryType: 'default',
    displayName: 'Professional Services',

    complianceRules: [
        'Provide helpful general information.',
        'Recommend consulting with a professional for specific situations.',
        'Maintain professional boundaries.'
    ],

    urgencyIndicators: ['urgent', 'emergency', 'immediate', 'asap', 'right away'],

    getSystemPromptEnhancement(context) {
        const { businessName } = context;
        return `You are an AI assistant for ${businessName}.

PROFESSIONAL CONDUCT:
- Be helpful, professional, and courteous
- Provide accurate general information
- Recommend professional consultation when appropriate
`;
    }
};

IndustryConfig.register('default', defaultConfig);

export default defaultConfig;