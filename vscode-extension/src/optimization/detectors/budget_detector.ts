/**
 * budget_detector.ts - Feature 3: Carbon Budget Enforcement
 * 
 * Reads a .astra.json project config file to enforce carbon budgets.
 * Projects monthly carbon usage based on detected API calls and user count,
 * then warns when the project is on track to exceed its budget.
 * 
 * .astra.json format:
 * {
 *   "carbonBudget": {
 *     "monthly": 5000,        // gCO2e per month
 *     "daily": 200,           // optional daily limit
 *     "alertThreshold": 0.8   // warn at 80%
 *   },
 *   "team": {
 *     "dailyUsers": 100       // expected daily active users
 *   },
 *   "greenPolicy": {
 *     "maxModelTier": "medium",      // disallow "heavy" models
 *     "allowedRegions": ["eu-north-1", "us-west-2", "ca-central-1"],
 *     "requireCaching": true
 *   }
 * }
 */

import { OptimizationDetector, OptimizationSuggestion, FileContext } from '../types';
import { CodeUnit } from '../../types';
import * as vscode from 'vscode';
import * as path from 'path';

export interface AstraConfig {
    carbonBudget?: {
        monthly?: number;       // gCO2e
        daily?: number;         // gCO2e
        alertThreshold?: number; // 0-1, default 0.8
    };
    team?: {
        dailyUsers?: number;
    };
    greenPolicy?: {
        maxModelTier?: 'heavy' | 'medium' | 'light';
        allowedRegions?: string[];
        requireCaching?: boolean;
    };
}

// Heavy models that violate "medium" or "light" tier policy
const HEAVY_MODEL_PATTERNS = [
    'gpt-4-32k', 'gpt-4-turbo', 'gpt-5-pro', 'o1',
    'claude-3-opus', 'dall-e',
    'gemini-3-pro', 'gemini-2.5-pro', 'gemini-1.5-pro',
];

const MEDIUM_MODEL_PATTERNS = [
    'gpt-5', 'gpt-4o', 'gpt-4.1',
    'claude-3-5-sonnet', 'claude-sonnet',
    'mistral-large', 'command-r-plus', 'llama-3.3-70b',
];

export class BudgetDetector implements OptimizationDetector {
    id = 'budget-detector';
    targetFileTypes = ['typescript', 'javascript', 'python', '.ts', '.js', '.py', '.tsx', '.jsx'];

    private config: AstraConfig | null = null;
    private configLoaded: boolean = false;

    async analyze(context: FileContext, codeUnits?: CodeUnit[]): Promise<OptimizationSuggestion[]> {
        const suggestions: OptimizationSuggestion[] = [];

        // Load config if not loaded
        if (!this.configLoaded) {
            await this.loadConfig();
        }

        // If no config, skip budget enforcement
        if (!this.config) return suggestions;

        const content = context.content;
        const greenPolicy = this.config.greenPolicy;

        if (!greenPolicy) return suggestions;

        // ─── Policy: Model Tier Enforcement ─────────────────
        if (greenPolicy.maxModelTier) {
            const violations = this.checkModelTierViolations(
                content,
                greenPolicy.maxModelTier,
                context.uri.toString(),
                context.uri.fsPath
            );
            suggestions.push(...violations);
        }

        // ─── Policy: Region Allowlist ───────────────────────
        if (greenPolicy.allowedRegions && greenPolicy.allowedRegions.length > 0) {
            const regionViolations = this.checkRegionViolations(
                content,
                greenPolicy.allowedRegions,
                context.uri.toString(),
                context.uri.fsPath
            );
            suggestions.push(...regionViolations);
        }

        // ─── Policy: Require Caching ──────────────────────
        if (greenPolicy.requireCaching) {
            const cacheViolation = this.checkCachingRequired(content, context.uri.toString());
            if (cacheViolation) {
                suggestions.push(cacheViolation);
            }
        }

        return suggestions;
    }

    /**
     * Load .astra.json from workspace root.
     */
    async loadConfig(): Promise<void> {
        this.configLoaded = true;
        try {
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (!workspaceFolders) return;

            const configPath = vscode.Uri.joinPath(workspaceFolders[0].uri, '.astra.json');
            const configContent = await vscode.workspace.fs.readFile(configPath);
            const configText = new TextDecoder().decode(configContent);
            this.config = JSON.parse(configText);
            console.log('📋 Loaded .astra.json config:', JSON.stringify(this.config));
        } catch (err) {
            // No config file - that's fine, budget enforcement is optional
            this.config = null;
        }
    }

    /**
     * Reload config (called when .astra.json changes).
     */
    async reloadConfig(): Promise<void> {
        this.configLoaded = false;
        await this.loadConfig();
    }

    /**
     * Get the loaded config (for use by treeview/status bar).
     */
    getConfig(): AstraConfig | null {
        return this.config;
    }

    /**
     * Check if models used in the file violate the max tier policy.
     */
    private checkModelTierViolations(
        content: string,
        maxTier: 'heavy' | 'medium' | 'light',
        fileUri: string,
        filePath: string
    ): OptimizationSuggestion[] {
        const suggestions: OptimizationSuggestion[] = [];

        let disallowedPatterns: string[] = [];
        if (maxTier === 'light') {
            disallowedPatterns = [...HEAVY_MODEL_PATTERNS, ...MEDIUM_MODEL_PATTERNS];
        } else if (maxTier === 'medium') {
            disallowedPatterns = [...HEAVY_MODEL_PATTERNS];
        }
        // 'heavy' = allow everything

        for (const pattern of disallowedPatterns) {
            const regex = new RegExp(`["']${this.escapeRegex(pattern)}[^"']*["']`, 'gi');
            let match;
            while ((match = regex.exec(content)) !== null) {
                const pos = this.getLineCol(content, match.index);
                suggestions.push({
                    id: `budget-tier-${pos.line}-${pattern}`,
                    title: `🚫 Policy Violation: Model "${match[0].replace(/["']/g, '')}"`,
                    description:
                        `Your .astra.json policy restricts models to "${maxTier}" tier or lighter. ` +
                        `"${match[0].replace(/["']/g, '')}" exceeds this limit. ` +
                        `Please use a lighter model to comply with your team's green policy.`,
                    severity: 'critical',
                    costImpact: 'Critical',
                    location: {
                        fileUri: fileUri,
                        startLine: pos.line,
                        startColumn: pos.col,
                        endLine: pos.line,
                        endColumn: pos.col + match[0].length
                    }
                });
            }
        }

        return suggestions;
    }

    /**
     * Check if regions used in the file are on the allowlist.
     */
    private checkRegionViolations(
        content: string,
        allowedRegions: string[],
        fileUri: string,
        filePath: string
    ): OptimizationSuggestion[] {
        const suggestions: OptimizationSuggestion[] = [];
        const allowedSet = new Set(allowedRegions.map(r => r.toLowerCase()));

        // Match common region patterns
        const regionPatterns = [
            /region\s*[=:]\s*["']([a-z][a-z0-9-]+)["']/g,
            /AWS_REGION\s*[=:]\s*["']([a-z][a-z0-9-]+)["']/g,
            /location\s*[=:]\s*["']([a-z][a-z0-9-]+)["']/g,
        ];

        for (const pattern of regionPatterns) {
            pattern.lastIndex = 0;
            let match;
            while ((match = pattern.exec(content)) !== null) {
                const region = match[1].toLowerCase();
                if (!allowedSet.has(region)) {
                    const pos = this.getLineCol(content, match.index);
                    suggestions.push({
                        id: `budget-region-${pos.line}`,
                        title: `🚫 Policy Violation: Region "${match[1]}"`,
                        description:
                            `Your .astra.json policy only allows regions: ${allowedRegions.join(', ')}. ` +
                            `Region "${match[1]}" is not on the allowlist.`,
                        severity: 'warning',
                        costImpact: 'High',
                        location: {
                            fileUri: fileUri,
                            startLine: pos.line,
                            startColumn: pos.col,
                            endLine: pos.line,
                            endColumn: pos.col + match[0].length
                        }
                    });
                }
            }
        }

        return suggestions;
    }

    /**
     * Check if file with API calls has caching when policy requires it.
     */
    private checkCachingRequired(content: string, fileUri: string): OptimizationSuggestion | null {
        // Check if file has API calls
        const hasApiCalls = /\.(create|complete|generate|fetch|get|post)\s*\(/gi.test(content);
        if (!hasApiCalls) return null;

        // Check if file has caching
        const hasCaching = ['cache', 'Cache', 'redis', 'memoize', 'lru_cache', 'withCache', 'with_cache']
            .some(pattern => content.includes(pattern));

        if (!hasCaching) {
            return {
                id: `budget-cache-required`,
                title: `🚫 Policy: Caching Required`,
                description:
                    `Your .astra.json policy requires caching for files with API calls. ` +
                    `This file has API calls but no caching infrastructure detected. ` +
                    `Add a caching layer to comply with the green policy.`,
                severity: 'warning',
                costImpact: 'High',
                location: {
                    fileUri: fileUri,
                    startLine: 1,
                    startColumn: 0,
                    endLine: 1,
                    endColumn: 0
                }
            };
        }

        return null;
    }

    private escapeRegex(str: string): string {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    private getLineCol(content: string, index: number): { line: number; col: number } {
        const prefix = content.substring(0, index);
        const line = (prefix.match(/\n/g) || []).length + 1;
        const lastNewLine = prefix.lastIndexOf('\n');
        const col = index - (lastNewLine === -1 ? 0 : lastNewLine + 1);
        return { line, col };
    }
}
