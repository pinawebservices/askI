// lib/industries/index.js
import './defaultIndustry.js';
import './lawFirm.js';
// import './accountingFirm.js';
// Future: just add new imports here

import { IndustryConfig } from '../config/industryConfig.js';

export { IndustryConfig };

// Export a function to ensure all configs are loaded
export function loadIndustryConfigs() {
    console.log('✅ Loaded industry configurations:', Object.keys(IndustryConfig.configs));
}