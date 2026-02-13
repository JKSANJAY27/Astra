/**
 * region_carbon.ts - Cloud Region Carbon Intensity Data
 * 
 * Carbon intensity measured in gCO2eq per kWh of electricity consumed.
 * Sources: Electricity Maps, Google Environmental Reports, AWS Sustainability,
 *          IEA World Energy Outlook 2025.
 * 
 * Lower values = greener regions (hydro, nuclear, wind, solar).
 * Higher values = dirtier regions (coal, gas).
 */

export interface RegionInfo {
    provider: 'aws' | 'gcp' | 'azure';
    name: string;
    location: string;
    carbonIntensity: number; // gCO2eq/kWh
    renewablePercent: number; // estimated % renewable
    tier: 'green' | 'moderate' | 'dirty';
}

/**
 * Thresholds for tier classification
 * Green: < 100 gCO2/kWh (predominantly hydro/nuclear/wind)
 * Moderate: 100-350 gCO2/kWh (mixed grid)
 * Dirty: > 350 gCO2/kWh (coal/gas heavy)
 */
export const CARBON_THRESHOLDS = {
    green: 100,
    moderate: 350
};

function tier(intensity: number): 'green' | 'moderate' | 'dirty' {
    if (intensity < CARBON_THRESHOLDS.green) return 'green';
    if (intensity < CARBON_THRESHOLDS.moderate) return 'moderate';
    return 'dirty';
}

// ─── AWS Regions ────────────────────────────────────────────────
export const awsRegions: Record<string, RegionInfo> = {
    'us-east-1': { provider: 'aws', name: 'us-east-1', location: 'N. Virginia', carbonIntensity: 380, renewablePercent: 20, tier: tier(380) },
    'us-east-2': { provider: 'aws', name: 'us-east-2', location: 'Ohio', carbonIntensity: 410, renewablePercent: 15, tier: tier(410) },
    'us-west-1': { provider: 'aws', name: 'us-west-1', location: 'N. California', carbonIntensity: 200, renewablePercent: 45, tier: tier(200) },
    'us-west-2': { provider: 'aws', name: 'us-west-2', location: 'Oregon', carbonIntensity: 60, renewablePercent: 85, tier: tier(60) },
    'ca-central-1': { provider: 'aws', name: 'ca-central-1', location: 'Canada (Montreal)', carbonIntensity: 20, renewablePercent: 95, tier: tier(20) },
    'eu-west-1': { provider: 'aws', name: 'eu-west-1', location: 'Ireland', carbonIntensity: 290, renewablePercent: 40, tier: tier(290) },
    'eu-west-2': { provider: 'aws', name: 'eu-west-2', location: 'London', carbonIntensity: 230, renewablePercent: 50, tier: tier(230) },
    'eu-west-3': { provider: 'aws', name: 'eu-west-3', location: 'Paris', carbonIntensity: 55, renewablePercent: 90, tier: tier(55) },
    'eu-central-1': { provider: 'aws', name: 'eu-central-1', location: 'Frankfurt', carbonIntensity: 340, renewablePercent: 35, tier: tier(340) },
    'eu-north-1': { provider: 'aws', name: 'eu-north-1', location: 'Stockholm', carbonIntensity: 15, renewablePercent: 98, tier: tier(15) },
    'ap-southeast-1': { provider: 'aws', name: 'ap-southeast-1', location: 'Singapore', carbonIntensity: 410, renewablePercent: 10, tier: tier(410) },
    'ap-southeast-2': { provider: 'aws', name: 'ap-southeast-2', location: 'Sydney', carbonIntensity: 550, renewablePercent: 20, tier: tier(550) },
    'ap-northeast-1': { provider: 'aws', name: 'ap-northeast-1', location: 'Tokyo', carbonIntensity: 460, renewablePercent: 20, tier: tier(460) },
    'ap-northeast-2': { provider: 'aws', name: 'ap-northeast-2', location: 'Seoul', carbonIntensity: 420, renewablePercent: 10, tier: tier(420) },
    'ap-south-1': { provider: 'aws', name: 'ap-south-1', location: 'Mumbai', carbonIntensity: 700, renewablePercent: 15, tier: tier(700) },
    'sa-east-1': { provider: 'aws', name: 'sa-east-1', location: 'São Paulo', carbonIntensity: 70, renewablePercent: 80, tier: tier(70) },
    'me-south-1': { provider: 'aws', name: 'me-south-1', location: 'Bahrain', carbonIntensity: 500, renewablePercent: 5, tier: tier(500) },
    'af-south-1': { provider: 'aws', name: 'af-south-1', location: 'Cape Town', carbonIntensity: 750, renewablePercent: 10, tier: tier(750) },
};

// ─── GCP Regions ────────────────────────────────────────────────
export const gcpRegions: Record<string, RegionInfo> = {
    'us-central1': { provider: 'gcp', name: 'us-central1', location: 'Iowa', carbonIntensity: 410, renewablePercent: 30, tier: tier(410) },
    'us-east1': { provider: 'gcp', name: 'us-east1', location: 'South Carolina', carbonIntensity: 380, renewablePercent: 20, tier: tier(380) },
    'us-east4': { provider: 'gcp', name: 'us-east4', location: 'N. Virginia', carbonIntensity: 380, renewablePercent: 20, tier: tier(380) },
    'us-west1': { provider: 'gcp', name: 'us-west1', location: 'Oregon', carbonIntensity: 60, renewablePercent: 85, tier: tier(60) },
    'us-west4': { provider: 'gcp', name: 'us-west4', location: 'Las Vegas', carbonIntensity: 380, renewablePercent: 25, tier: tier(380) },
    'europe-west1': { provider: 'gcp', name: 'europe-west1', location: 'Belgium', carbonIntensity: 160, renewablePercent: 40, tier: tier(160) },
    'europe-west4': { provider: 'gcp', name: 'europe-west4', location: 'Netherlands', carbonIntensity: 340, renewablePercent: 35, tier: tier(340) },
    'europe-north1': { provider: 'gcp', name: 'europe-north1', location: 'Finland', carbonIntensity: 80, renewablePercent: 80, tier: tier(80) },
    'europe-west6': { provider: 'gcp', name: 'europe-west6', location: 'Zurich', carbonIntensity: 30, renewablePercent: 90, tier: tier(30) },
    'asia-east1': { provider: 'gcp', name: 'asia-east1', location: 'Taiwan', carbonIntensity: 500, renewablePercent: 10, tier: tier(500) },
    'asia-northeast1': { provider: 'gcp', name: 'asia-northeast1', location: 'Tokyo', carbonIntensity: 460, renewablePercent: 20, tier: tier(460) },
    'asia-south1': { provider: 'gcp', name: 'asia-south1', location: 'Mumbai', carbonIntensity: 700, renewablePercent: 15, tier: tier(700) },
    'southamerica-east1': { provider: 'gcp', name: 'southamerica-east1', location: 'São Paulo', carbonIntensity: 70, renewablePercent: 80, tier: tier(70) },
    'australia-southeast1': { provider: 'gcp', name: 'australia-southeast1', location: 'Sydney', carbonIntensity: 550, renewablePercent: 20, tier: tier(550) },
    'northamerica-northeast1': { provider: 'gcp', name: 'northamerica-northeast1', location: 'Montreal', carbonIntensity: 20, renewablePercent: 95, tier: tier(20) },
};

// ─── Azure Regions ──────────────────────────────────────────────
export const azureRegions: Record<string, RegionInfo> = {
    'eastus': { provider: 'azure', name: 'eastus', location: 'Virginia', carbonIntensity: 380, renewablePercent: 20, tier: tier(380) },
    'eastus2': { provider: 'azure', name: 'eastus2', location: 'Virginia', carbonIntensity: 380, renewablePercent: 20, tier: tier(380) },
    'westus': { provider: 'azure', name: 'westus', location: 'California', carbonIntensity: 200, renewablePercent: 45, tier: tier(200) },
    'westus2': { provider: 'azure', name: 'westus2', location: 'Washington', carbonIntensity: 60, renewablePercent: 85, tier: tier(60) },
    'centralus': { provider: 'azure', name: 'centralus', location: 'Iowa', carbonIntensity: 410, renewablePercent: 30, tier: tier(410) },
    'canadacentral': { provider: 'azure', name: 'canadacentral', location: 'Toronto', carbonIntensity: 20, renewablePercent: 95, tier: tier(20) },
    'northeurope': { provider: 'azure', name: 'northeurope', location: 'Ireland', carbonIntensity: 290, renewablePercent: 40, tier: tier(290) },
    'westeurope': { provider: 'azure', name: 'westeurope', location: 'Netherlands', carbonIntensity: 340, renewablePercent: 35, tier: tier(340) },
    'uksouth': { provider: 'azure', name: 'uksouth', location: 'London', carbonIntensity: 230, renewablePercent: 50, tier: tier(230) },
    'francecentral': { provider: 'azure', name: 'francecentral', location: 'Paris', carbonIntensity: 55, renewablePercent: 90, tier: tier(55) },
    'swedencentral': { provider: 'azure', name: 'swedencentral', location: 'Gävle', carbonIntensity: 15, renewablePercent: 98, tier: tier(15) },
    'norwayeast': { provider: 'azure', name: 'norwayeast', location: 'Oslo', carbonIntensity: 10, renewablePercent: 99, tier: tier(10) },
    'southeastasia': { provider: 'azure', name: 'southeastasia', location: 'Singapore', carbonIntensity: 410, renewablePercent: 10, tier: tier(410) },
    'eastasia': { provider: 'azure', name: 'eastasia', location: 'Hong Kong', carbonIntensity: 600, renewablePercent: 10, tier: tier(600) },
    'japaneast': { provider: 'azure', name: 'japaneast', location: 'Tokyo', carbonIntensity: 460, renewablePercent: 20, tier: tier(460) },
    'centralindia': { provider: 'azure', name: 'centralindia', location: 'Pune', carbonIntensity: 700, renewablePercent: 15, tier: tier(700) },
    'australiaeast': { provider: 'azure', name: 'australiaeast', location: 'Sydney', carbonIntensity: 550, renewablePercent: 20, tier: tier(550) },
    'brazilsouth': { provider: 'azure', name: 'brazilsouth', location: 'São Paulo', carbonIntensity: 70, renewablePercent: 80, tier: tier(70) },
};

/**
 * Combined lookup of all regions across all providers.
 */
export const allRegions: Record<string, RegionInfo> = {
    ...awsRegions,
    ...gcpRegions,
    ...azureRegions
};

/**
 * Get the greenest alternatives for a given provider.
 * Returns sorted list (lowest carbon first), limited to top N.
 */
export function getGreenAlternatives(provider: 'aws' | 'gcp' | 'azure', topN: number = 3): RegionInfo[] {
    let regions: Record<string, RegionInfo>;
    switch (provider) {
        case 'aws': regions = awsRegions; break;
        case 'gcp': regions = gcpRegions; break;
        case 'azure': regions = azureRegions; break;
    }

    return Object.values(regions)
        .filter(r => r.tier === 'green')
        .sort((a, b) => a.carbonIntensity - b.carbonIntensity)
        .slice(0, topN);
}

/**
 * Find region info by partial string match (case-insensitive).
 */
export function findRegion(regionStr: string): RegionInfo | undefined {
    const normalized = regionStr.toLowerCase().replace(/['"]/g, '').trim();
    return allRegions[normalized];
}
