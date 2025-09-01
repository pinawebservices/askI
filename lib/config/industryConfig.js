// lib/industries/industryConfig.js
export class IndustryConfig {
    static configs = {};

    static register(industryType, config) {
        this.configs[industryType] = config;
    }

    static get(industryType) {
        return this.configs[industryType] || this.configs.default;
    }

    static getSystemPromptEnhancement(industryType, context) {
        const config = this.get(industryType);
        return config?.getSystemPromptEnhancement(context) || '';
    }

    static getComplianceRules(industryType) {
        const config = this.get(industryType);
        return config?.complianceRules || [];
    }

    static getUrgencyIndicators(industryType) {
        const config = this.get(industryType);
        return config?.urgencyIndicators || [];
    }

    // FIXME: Not used yet - possible future enhancement
    // static getLeadQualificationFlow(industryType) {
    //     const config = this.get(industryType);
    //     return config?.leadQualificationFlow || null;
    // }
}