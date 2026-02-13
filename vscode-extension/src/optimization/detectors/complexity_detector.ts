/**
 * complexity_detector.ts - Feature 1: Intelligent Model Right-Sizing
 * 
 * Analyzes prompt text passed to LLM calls and scores its complexity.
 * If a heavyweight model is used for a simple task, suggests a greener alternative.
 * 
 * Scoring heuristic (no API calls required):
 *  - Prompt length (short prompts = simple)
 *  - Keyword analysis (reasoning, code generation, math = complex)
 *  - Conversation depth (single turn = simple)
 *  - Output constraints (high max_tokens = complex)
 */

import { OptimizationDetector, OptimizationSuggestion, FileContext } from '../types';
import { CodeUnit } from '../../types';
import * as path from 'path';

// ─── Model Tiers ────────────────────────────────────────────────
// Ordered from most expensive/heavy to cheapest/lightest
interface ModelTier {
    names: string[];           // regex-friendly substrings
    tier: 'heavy' | 'medium' | 'light';
    carbonWeight: number;      // relative carbon multiplier
    costPerKToken: number;     // approximate $/1k input tokens
}

const MODEL_TIERS: ModelTier[] = [
    // Heavy tier (expensive, high carbon)
    {
        names: ['gpt-4-32k', 'gpt-4-turbo', 'gpt-5-pro', 'o1', 'claude-3-opus', 'dall-e', 'gemini-3-pro', 'gemini-2.5-pro', 'gemini-1.5-pro'],
        tier: 'heavy',
        carbonWeight: 10,
        costPerKToken: 0.01
    },
    // Medium tier
    {
        names: ['gpt-5', 'gpt-4o', 'gpt-4.1', 'claude-3-5-sonnet', 'claude-sonnet', 'mistral-large', 'command-r-plus', 'llama-3.3-70b'],
        tier: 'medium',
        carbonWeight: 5,
        costPerKToken: 0.002
    },
    // Light tier (cheap, low carbon)
    {
        names: ['gpt-5-mini', 'gpt-4o-mini', 'gpt-3.5', 'o3-mini', 'o1-mini', 'claude-3-5-haiku', 'claude-3-haiku', 'claude-haiku',
            'gemini-2.5-flash', 'gemini-1.5-flash', 'mistral-small', 'mistral-medium', 'command-r', 'llama-3.1-8b',
            'text-embedding', 'embed-english'],
        tier: 'light',
        carbonWeight: 1,
        costPerKToken: 0.0002
    }
];

// ─── Complexity Keywords ────────────────────────────────────────

const COMPLEX_KEYWORDS = [
    // Reasoning & analysis
    'analyze', 'reason', 'explain step by step', 'think through', 'chain of thought',
    'compare and contrast', 'evaluate', 'critically',
    // Code generation
    'write a function', 'implement', 'refactor', 'debug', 'generate code',
    'write a program', 'create a class', 'build a',
    // Math & science
    'calculate', 'derive', 'prove', 'equation', 'algorithm',
    // Creative long-form
    'write an essay', 'write a story', 'write a report', 'detailed analysis',
    'comprehensive', 'in-depth',
    // Multi-step
    'first,', 'then,', 'finally,', 'step 1', 'step 2',
];

const SIMPLE_KEYWORDS = [
    // Classification / extraction
    'classify', 'categorize', 'extract', 'label', 'tag',
    // Short answers
    'yes or no', 'true or false', 'one word', 'short answer',
    // Translation / conversion
    'translate', 'convert', 'format', 'rewrite',
    // Simple tasks
    'summarize', 'summary', 'tldr', 'hello', 'hi', 'greet',
    'what is', 'define', 'list', 'name',
    // JSON/structured output
    'return json', 'return as json', 'output json', 'json format',
];

// ─── Green Alternatives Map ────────────────────────────────────
// For each heavy model, what's the green alternative?
const GREEN_ALTERNATIVES: Record<string, { model: string; savingsPercent: number; carbonReduction: string }> = {
    'gpt-4-32k': { model: 'gpt-4o-mini', savingsPercent: 99, carbonReduction: '95%' },
    'gpt-4-turbo': { model: 'gpt-4o-mini', savingsPercent: 98, carbonReduction: '93%' },
    'gpt-5-pro': { model: 'gpt-5-mini', savingsPercent: 98, carbonReduction: '90%' },
    'gpt-5': { model: 'gpt-5-mini', savingsPercent: 80, carbonReduction: '75%' },
    'gpt-4o': { model: 'gpt-4o-mini', savingsPercent: 94, carbonReduction: '92%' },
    'gpt-4.1': { model: 'gpt-4o-mini', savingsPercent: 93, carbonReduction: '92%' },
    'o1': { model: 'o3-mini', savingsPercent: 93, carbonReduction: '87%' },
    'claude-3-opus': { model: 'claude-3-5-haiku-latest', savingsPercent: 95, carbonReduction: '93%' },
    'claude-3-5-sonnet': { model: 'claude-3-5-haiku-latest', savingsPercent: 73, carbonReduction: '84%' },
    'claude-sonnet': { model: 'claude-3-5-haiku-latest', savingsPercent: 73, carbonReduction: '84%' },
    'gemini-3-pro': { model: 'gemini-2.5-flash', savingsPercent: 93, carbonReduction: '90%' },
    'gemini-2.5-pro': { model: 'gemini-2.5-flash', savingsPercent: 88, carbonReduction: '89%' },
    'gemini-1.5-pro': { model: 'gemini-1.5-flash', savingsPercent: 90, carbonReduction: '88%' },
    'mistral-large': { model: 'mistral-small-latest', savingsPercent: 95, carbonReduction: '90%' },
    'command-r-plus': { model: 'command-r', savingsPercent: 94, carbonReduction: '88%' },
};

export class ComplexityDetector implements OptimizationDetector {
    id = 'complexity-detector';
    targetFileTypes = ['typescript', 'javascript', 'python', '.ts', '.js', '.py', '.tsx', '.jsx'];

    async analyze(context: FileContext, codeUnits?: CodeUnit[]): Promise<OptimizationSuggestion[]> {
        const suggestions: OptimizationSuggestion[] = [];
        const content = context.content;
        const lines = content.split('\n');

        // Find all LLM call sites with model strings
        const modelCallPattern = /["']([a-zA-Z0-9._-]+-(?:turbo|32k|pro|opus|sonnet|haiku|large|medium|small|mini|flash|lite|latest|instruct|[0-9]+b)[a-zA-Z0-9._-]*)["']/g;
        // Also match simple model names
        const simpleModelPattern = /["'](gpt-[45][a-z0-9.-]*|o[13]-?[a-z]*|claude-[a-z0-9.-]+|gemini-[a-z0-9.-]+|mistral-[a-z-]+|command-r[a-z-]*)["']/g;

        const allMatches: { model: string; index: number; fullMatch: string }[] = [];

        for (const pattern of [modelCallPattern, simpleModelPattern]) {
            pattern.lastIndex = 0;
            let match;
            while ((match = pattern.exec(content)) !== null) {
                allMatches.push({
                    model: match[1],
                    index: match.index,
                    fullMatch: match[0]
                });
            }
        }

        // Deduplicate by index
        const seen = new Set<number>();
        const uniqueMatches = allMatches.filter(m => {
            if (seen.has(m.index)) return false;
            seen.add(m.index);
            return true;
        });

        for (const matchInfo of uniqueMatches) {
            const modelName = matchInfo.model.toLowerCase();
            const tier = this.getModelTier(modelName);

            // Only suggest for heavy and medium models
            if (tier === 'light') continue;

            // Extract prompt context around this model usage
            const pos = this.getLineCol(content, matchInfo.index);
            const promptContext = this.extractPromptContext(content, matchInfo.index, 500);
            const complexityScore = this.scoreComplexity(promptContext);

            // Decision logic:
            // Heavy model + simple task = CRITICAL suggestion
            // Heavy model + medium task = WARNING suggestion  
            // Medium model + simple task = INFO suggestion
            if (tier === 'heavy' && complexityScore <= 3) {
                const alt = this.findGreenAlternative(modelName);
                if (alt) {
                    const endPos = this.getLineCol(content, matchInfo.index + matchInfo.fullMatch.length);
                    suggestions.push({
                        id: `complexity-heavy-simple-${pos.line}`,
                        title: `🧠 Overkill: "${matchInfo.model}" for simple task`,
                        description: `This prompt scores ${complexityScore}/10 complexity, but uses a heavy model. ` +
                            `Switch to "${alt.model}" to reduce carbon by ${alt.carbonReduction} and cost by ${alt.savingsPercent}%.`,
                        severity: 'critical',
                        costImpact: 'Critical',
                        location: {
                            fileUri: context.uri.toString(),
                            startLine: pos.line,
                            startColumn: pos.col,
                            endLine: endPos.line,
                            endColumn: endPos.col
                        },
                        quickFix: {
                            targetFile: context.uri.fsPath,
                            replacementRange: {
                                startLine: pos.line - 1,
                                startColumn: pos.col,
                                endLine: endPos.line - 1,
                                endColumn: endPos.col
                            },
                            replacementText: `"${alt.model}"`
                        }
                    });
                }
            } else if (tier === 'heavy' && complexityScore <= 6) {
                const alt = this.findGreenAlternative(modelName);
                if (alt) {
                    suggestions.push({
                        id: `complexity-heavy-medium-${pos.line}`,
                        title: `🧠 Consider lighter model for "${matchInfo.model}"`,
                        description: `This prompt scores ${complexityScore}/10 complexity. A medium-tier model like "${alt.model}" ` +
                            `could handle this while reducing carbon by ${alt.carbonReduction}.`,
                        severity: 'warning',
                        costImpact: 'High',
                        location: {
                            fileUri: context.uri.toString(),
                            startLine: pos.line,
                            startColumn: pos.col,
                            endLine: pos.line,
                            endColumn: pos.col + matchInfo.fullMatch.length
                        }
                    });
                }
            } else if (tier === 'medium' && complexityScore <= 2) {
                const alt = this.findGreenAlternative(modelName);
                if (alt) {
                    suggestions.push({
                        id: `complexity-medium-simple-${pos.line}`,
                        title: `🧠 Lighter model possible for "${matchInfo.model}"`,
                        description: `This prompt scores ${complexityScore}/10 complexity. Consider "${alt.model}" for ~${alt.carbonReduction} less carbon.`,
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
            }
        }

        return suggestions;
    }

    /**
     * Score the complexity of a prompt context (0-10).
     * 0 = trivial, 10 = extremely complex.
     */
    private scoreComplexity(promptText: string): number {
        if (!promptText || promptText.length < 5) return 1;

        let score = 0;
        const lower = promptText.toLowerCase();

        // 1. Length factor (0-3 points)
        const charCount = promptText.length;
        if (charCount > 2000) score += 3;
        else if (charCount > 500) score += 2;
        else if (charCount > 100) score += 1;
        // else 0 (very short)

        // 2. Complex keyword presence (0-3 points)
        let complexHits = 0;
        for (const kw of COMPLEX_KEYWORDS) {
            if (lower.includes(kw)) complexHits++;
        }
        score += Math.min(3, complexHits);

        // 3. Simple keyword presence (subtract 0-2 points)
        let simpleHits = 0;
        for (const kw of SIMPLE_KEYWORDS) {
            if (lower.includes(kw)) simpleHits++;
        }
        score -= Math.min(2, simpleHits);

        // 4. Multi-turn conversation (0-2 points)
        const messageCount = (promptText.match(/["']role["']\s*:\s*["'](user|assistant|system)["']/g) || []).length;
        if (messageCount > 4) score += 2;
        else if (messageCount > 2) score += 1;

        // 5. Code blocks in prompt (0-1 point)
        if (lower.includes('```') || lower.includes('def ') || lower.includes('function ')) score += 1;

        // 6. High max_tokens (0-1 point)
        const maxTokensMatch = promptText.match(/max_tokens\s*[:=]\s*(\d+)/);
        if (maxTokensMatch && parseInt(maxTokensMatch[1]) > 2000) score += 1;

        // Clamp 0-10
        return Math.max(0, Math.min(10, score));
    }

    /**
     * Extract text around a model usage to determine prompt context.
     */
    private extractPromptContext(content: string, modelIndex: number, radius: number): string {
        const start = Math.max(0, modelIndex - radius);
        const end = Math.min(content.length, modelIndex + radius);
        return content.substring(start, end);
    }

    /**
     * Determine the tier of a model.
     */
    private getModelTier(model: string): 'heavy' | 'medium' | 'light' | 'unknown' {
        const lower = model.toLowerCase();
        for (const tier of MODEL_TIERS) {
            if (tier.names.some(n => lower.includes(n))) {
                return tier.tier;
            }
        }
        return 'unknown';
    }

    /**
     * Find a green alternative for a given model name.
     */
    private findGreenAlternative(model: string): { model: string; savingsPercent: number; carbonReduction: string } | undefined {
        const lower = model.toLowerCase();
        for (const [key, alt] of Object.entries(GREEN_ALTERNATIVES)) {
            if (lower.includes(key)) return alt;
        }
        return undefined;
    }

    private getLineCol(content: string, index: number): { line: number; col: number } {
        const prefix = content.substring(0, index);
        const line = (prefix.match(/\n/g) || []).length + 1;
        const lastNewLine = prefix.lastIndexOf('\n');
        const col = index - (lastNewLine === -1 ? 0 : lastNewLine + 1);
        return { line, col };
    }
}
