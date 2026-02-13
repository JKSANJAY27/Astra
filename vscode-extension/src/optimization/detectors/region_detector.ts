/**
 * region_detector.ts - Feature 2: Green Region Awareness
 * 
 * Scans code and config files for cloud region strings (AWS, GCP, Azure).
 * Warns when high-carbon regions are used and suggests greener alternatives.
 * 
 * Supports:
 *  - Infrastructure-as-Code: Terraform (.tf), CloudFormation (.yml/.yaml)
 *  - Application code: SDK initialization with region parameters
 *  - Config files: JSON/YAML with region settings
 */

import { OptimizationDetector, OptimizationSuggestion, FileContext } from '../types';
import { CodeUnit } from '../../types';
import { allRegions, findRegion, getGreenAlternatives, RegionInfo, CARBON_THRESHOLDS } from '../../data/region_carbon';

// Patterns that indicate a cloud region string
const REGION_CONTEXT_PATTERNS = [
    // AWS patterns
    /region\s*[=:]\s*["']([a-z]{2}-[a-z]+-\d)["']/g,
    /AWS_DEFAULT_REGION\s*[=:]\s*["']([a-z]{2}-[a-z]+-\d)["']/g,
    /AWS_REGION\s*[=:]\s*["']([a-z]{2}-[a-z]+-\d)["']/g,
    // GCP patterns
    /region\s*[=:]\s*["']([a-z]+-[a-z]+\d)["']/g,
    /zone\s*[=:]\s*["']([a-z]+-[a-z]+\d)-[a-z]?["']/g,
    /location\s*[=:]\s*["']([a-z]+-[a-z]+\d)["']/g,
    // Azure patterns
    /location\s*[=:]\s*["']([a-z]+)["']/g,
    // Generic patterns in code
    /["']([a-z]{2}-[a-z]+-\d)["']/g,                    // AWS-style: us-east-1
    /["']([a-z]+-[a-z]+\d)["']/g,                       // GCP-style: europe-west1
];

export class RegionDetector implements OptimizationDetector {
    id = 'region-detector';
    targetFileTypes = ['*', '.ts', '.js', '.py', '.tf', '.tfvars', '.yml', '.yaml', '.json', '.env', '.toml'];

    async analyze(context: FileContext, codeUnits?: CodeUnit[]): Promise<OptimizationSuggestion[]> {
        const suggestions: OptimizationSuggestion[] = [];
        const content = context.content;

        // Collect all region matches
        const regionMatches: { region: string; index: number; fullMatch: string; line: number }[] = [];

        for (const pattern of REGION_CONTEXT_PATTERNS) {
            pattern.lastIndex = 0;
            let match;
            while ((match = pattern.exec(content)) !== null) {
                const regionStr = match[1];
                const regionInfo = findRegion(regionStr);

                if (regionInfo) {
                    const pos = this.getLineCol(content, match.index);
                    regionMatches.push({
                        region: regionStr,
                        index: match.index,
                        fullMatch: match[0],
                        line: pos.line
                    });
                }
            }
        }

        // Deduplicate by line (avoid multiple warnings for the same region on the same line)
        const seenLines = new Set<string>();
        const uniqueMatches = regionMatches.filter(m => {
            const key = `${m.region}-${m.line}`;
            if (seenLines.has(key)) return false;
            seenLines.add(key);
            return true;
        });

        for (const matchInfo of uniqueMatches) {
            const regionInfo = findRegion(matchInfo.region);
            if (!regionInfo) continue;

            const pos = this.getLineCol(content, matchInfo.index);

            if (regionInfo.tier === 'dirty') {
                // HIGH CARBON REGION - suggest alternatives
                const alternatives = getGreenAlternatives(regionInfo.provider, 3);
                const altText = alternatives.map(a =>
                    `${a.name} (${a.location}, ${a.carbonIntensity}g/kWh, ${a.renewablePercent}% renewable)`
                ).join('\n  • ');

                const reduction = alternatives.length > 0
                    ? `${Math.round((1 - alternatives[0].carbonIntensity / regionInfo.carbonIntensity) * 100)}%`
                    : 'significant';

                suggestions.push({
                    id: `region-dirty-${pos.line}`,
                    title: `🌍 High-Carbon Region: ${matchInfo.region}`,
                    description:
                        `Region "${matchInfo.region}" (${regionInfo.location}) has high carbon intensity: ` +
                        `${regionInfo.carbonIntensity} gCO2/kWh (only ${regionInfo.renewablePercent}% renewable).\n\n` +
                        `🌱 Green alternatives (${reduction} less carbon):\n  • ${altText}`,
                    severity: 'warning',
                    costImpact: 'High',
                    location: {
                        fileUri: context.uri.toString(),
                        startLine: pos.line,
                        startColumn: pos.col,
                        endLine: pos.line,
                        endColumn: pos.col + matchInfo.fullMatch.length
                    },
                    quickFix: alternatives.length > 0 ? {
                        targetFile: context.uri.fsPath,
                        replacementRange: {
                            startLine: pos.line - 1,
                            startColumn: pos.col,
                            endLine: pos.line - 1,
                            endColumn: pos.col + matchInfo.fullMatch.length
                        },
                        replacementText: matchInfo.fullMatch.replace(matchInfo.region, alternatives[0].name)
                    } : undefined
                });
            } else if (regionInfo.tier === 'moderate') {
                // MODERATE CARBON REGION - info suggestion
                const alternatives = getGreenAlternatives(regionInfo.provider, 2);
                const altText = alternatives.map(a => `${a.name} (${a.carbonIntensity}g/kWh)`).join(', ');

                suggestions.push({
                    id: `region-moderate-${pos.line}`,
                    title: `🌍 Moderate-Carbon Region: ${matchInfo.region}`,
                    description:
                        `Region "${matchInfo.region}" (${regionInfo.location}) has moderate carbon intensity: ` +
                        `${regionInfo.carbonIntensity} gCO2/kWh.\n\n` +
                        `Greener options: ${altText}`,
                    severity: 'info',
                    costImpact: 'Medium',
                    location: {
                        fileUri: context.uri.toString(),
                        startLine: pos.line,
                        startColumn: pos.col,
                        endLine: pos.line,
                        endColumn: pos.col + matchInfo.fullMatch.length
                    }
                });
            }
            // Green regions: no warning needed
        }

        return suggestions;
    }

    private getLineCol(content: string, index: number): { line: number; col: number } {
        const prefix = content.substring(0, index);
        const line = (prefix.match(/\n/g) || []).length + 1;
        const lastNewLine = prefix.lastIndexOf('\n');
        const col = index - (lastNewLine === -1 ? 0 : lastNewLine + 1);
        return { line, col };
    }
}
