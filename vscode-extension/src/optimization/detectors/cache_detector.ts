/**
 * cache_detector.ts - Feature 4: Intelligent Caching Injection
 * 
 * Detects API calls (especially LLM and external services) that could benefit
 * from caching. Provides quick-fix code scaffolding for cache wrappers.
 * 
 * Detects:
 *  - Identical API calls made multiple times in the same file
 *  - API calls with static/hardcoded parameters (cacheable)
 *  - API calls without any surrounding cache logic
 *  - High-frequency patterns (called in event handlers, request handlers)
 */

import { OptimizationDetector, OptimizationSuggestion, FileContext } from '../types';
import { CodeUnit } from '../../types';
import * as path from 'path';

// API call patterns that are typically cacheable
const CACHEABLE_API_PATTERNS: { regex: RegExp; provider: string; description: string }[] = [
    // LLM Completions (expensive, often identical prompts)
    { regex: /(\w+)\.(chat\.completions\.create|messages\.create|generateContent|complete)\s*\(/g, provider: 'LLM', description: 'LLM completion call' },
    // Embedding calls (highly cacheable - same text = same embedding)
    { regex: /(\w+)\.(embeddings?\.create|embed)\s*\(/g, provider: 'Embedding', description: 'Embedding generation' },
    // Database lookups (often repeated)
    { regex: /(\w+)\.(findOne|findById|findUnique|get)\s*\(/g, provider: 'Database', description: 'Database lookup' },
    // External API calls
    { regex: /fetch\s*\(\s*["'`]([^"'`]+)["'`]/g, provider: 'HTTP', description: 'HTTP fetch call' },
    { regex: /axios\.(get|post)\s*\(\s*["'`]([^"'`]+)["'`]/g, provider: 'HTTP', description: 'Axios HTTP call' },
    // Python requests
    { regex: /requests\.(get|post)\s*\(\s*["']([^"']+)["']/g, provider: 'HTTP', description: 'Python HTTP request' },
    // Geocoding / Maps (very cacheable)
    { regex: /geocode|reverse_geocode|directions|places/gi, provider: 'Maps', description: 'Geocoding/Maps API call' },
];

// Patterns indicating cache is already present
const CACHE_PRESENCE_PATTERNS = [
    'cache', 'Cache', 'redis', 'Redis', 'memcached', 'Memcached',
    'memoize', 'lru_cache', '@cache', 'NodeCache', 'keyv',
    'cached', 'fromCache', 'cacheKey', 'cache_key',
    'Map()', 'new Map', 'WeakMap',
];

// Patterns indicating high-frequency context
const HIGH_FREQUENCY_PATTERNS = [
    /app\.(get|post|put|delete|patch)\s*\(/g,           // Express routes
    /router\.(get|post|put|delete|patch)\s*\(/g,        // Router
    /addEventListener\s*\(/g,                            // Event handlers
    /setInterval\s*\(/g,                                 // Intervals
    /\.on\s*\(\s*["']/g,                                 // Event emitters
    /@(Get|Post|Put|Delete|Patch)\s*\(/g,               // NestJS decorators
    /def\s+\w+\s*\(.*request/g,                          // Django/Flask views
    /@app\.route/g,                                      // Flask routes
];

// ─── Cache Scaffold Templates ───────────────────────────────────

const TS_CACHE_SCAFFOLD = `
// 🌿 Astra Green Cache - Reduces redundant API calls
const _astraCache = new Map<string, { data: any; expiry: number }>();

function withCache<T>(key: string, ttlMs: number, fn: () => Promise<T>): Promise<T> {
    const cached = _astraCache.get(key);
    if (cached && cached.expiry > Date.now()) {
        return Promise.resolve(cached.data as T);
    }
    return fn().then(result => {
        _astraCache.set(key, { data: result, expiry: Date.now() + ttlMs });
        return result;
    });
}`;

const PY_CACHE_SCAFFOLD = `
# 🌿 Astra Green Cache - Reduces redundant API calls
import time
from functools import lru_cache

_astra_cache: dict[str, tuple[any, float]] = {}

def with_cache(key: str, ttl_seconds: int = 300):
    """Cache decorator for expensive API calls."""
    def decorator(fn):
        def wrapper(*args, **kwargs):
            cached = _astra_cache.get(key)
            if cached and cached[1] > time.time():
                return cached[0]
            result = fn(*args, **kwargs)
            _astra_cache[key] = (result, time.time() + ttl_seconds)
            return result
        return wrapper
    return decorator`;

export class CacheDetector implements OptimizationDetector {
    id = 'cache-detector';
    targetFileTypes = ['typescript', 'javascript', 'python', '.ts', '.js', '.py', '.tsx', '.jsx'];

    async analyze(context: FileContext, codeUnits?: CodeUnit[]): Promise<OptimizationSuggestion[]> {
        const suggestions: OptimizationSuggestion[] = [];
        const content = context.content;
        const isPython = context.languageId === 'python' || context.uri.fsPath.endsWith('.py');

        // 1. Check if file already has caching infrastructure
        const hasCacheInfra = this.detectCachePresence(content);

        // 2. Check if file is in a high-frequency context (request handler, etc)
        const isHighFrequency = this.detectHighFrequency(content);

        // 3. Find cacheable API calls
        const cacheableCalls = this.findCacheableCalls(content, context.uri.toString());

        // 4. Find duplicate calls (same function called multiple times)
        const duplicates = this.findDuplicateCalls(content, context.uri.toString());

        // Generate suggestions

        // Duplicate calls - highest priority
        for (const dup of duplicates) {
            suggestions.push({
                id: `cache-duplicate-${dup.line}`,
                title: `♻️ Duplicate API call: ${dup.callName}`,
                description:
                    `"${dup.callName}" is called ${dup.count} times in this file. ` +
                    `Each call costs energy and money. Cache the result to avoid ${dup.count - 1} redundant calls.`,
                severity: 'warning',
                costImpact: 'High',
                location: {
                    fileUri: context.uri.toString(),
                    startLine: dup.line,
                    startColumn: dup.col,
                    endLine: dup.line,
                    endColumn: dup.col + dup.callName.length
                }
            });
        }

        // Cacheable calls without cache infrastructure
        if (!hasCacheInfra && cacheableCalls.length > 0) {
            // Suggest adding cache infrastructure (only once per file)
            const firstCall = cacheableCalls[0];
            const scaffold = isPython ? PY_CACHE_SCAFFOLD : TS_CACHE_SCAFFOLD;

            suggestions.push({
                id: `cache-scaffold-${firstCall.line}`,
                title: `🌿 Add Green Cache to reduce ${cacheableCalls.length} API call(s)`,
                description:
                    `This file has ${cacheableCalls.length} cacheable API call(s) but no caching logic. ` +
                    `Adding a cache layer can reduce redundant calls by 60-90%, saving energy and cost.\n\n` +
                    `Detected calls: ${cacheableCalls.map(c => c.provider + ': ' + c.callName).join(', ')}` +
                    (isHighFrequency ? `\n\n⚡ HIGH FREQUENCY: This file handles requests/events, making caching even more impactful.` : ''),
                severity: isHighFrequency ? 'warning' : 'info',
                costImpact: isHighFrequency ? 'High' : 'Medium',
                location: {
                    fileUri: context.uri.toString(),
                    startLine: firstCall.line,
                    startColumn: firstCall.col,
                    endLine: firstCall.line,
                    endColumn: firstCall.col + firstCall.callName.length
                },
                quickFix: {
                    targetFile: context.uri.fsPath,
                    replacementRange: {
                        startLine: 0,
                        startColumn: 0,
                        endLine: 0,
                        endColumn: 0
                    },
                    replacementText: scaffold + '\n\n' + content.split('\n')[0]
                }
            });
        }

        // Individual cacheable calls in high-frequency context
        if (isHighFrequency && hasCacheInfra) {
            for (const call of cacheableCalls) {
                // Check if this specific call is wrapped in cache
                const surroundingCode = this.getSurroundingCode(content, call.line, 3);
                const isWrapped = CACHE_PRESENCE_PATTERNS.some(p =>
                    surroundingCode.toLowerCase().includes(p.toLowerCase())
                );

                if (!isWrapped) {
                    suggestions.push({
                        id: `cache-unwrapped-${call.line}`,
                        title: `♻️ Uncached API call: ${call.callName}`,
                        description:
                            `This ${call.provider} call in a request handler is not using the cache. ` +
                            `Wrap it with the cache utility to avoid redundant network calls.`,
                        severity: 'info',
                        costImpact: 'Medium',
                        location: {
                            fileUri: context.uri.toString(),
                            startLine: call.line,
                            startColumn: call.col,
                            endLine: call.line,
                            endColumn: call.col + call.callName.length
                        }
                    });
                }
            }
        }

        return suggestions;
    }

    /**
     * Check if file already has caching logic.
     */
    private detectCachePresence(content: string): boolean {
        return CACHE_PRESENCE_PATTERNS.some(pattern =>
            content.includes(pattern)
        );
    }

    /**
     * Check if file is a high-frequency handler.
     */
    private detectHighFrequency(content: string): boolean {
        return HIGH_FREQUENCY_PATTERNS.some(pattern => {
            pattern.lastIndex = 0;
            return pattern.test(content);
        });
    }

    /**
     * Find API calls that could benefit from caching.
     */
    private findCacheableCalls(content: string, fileUri: string): {
        callName: string; provider: string; line: number; col: number; description: string;
    }[] {
        const calls: { callName: string; provider: string; line: number; col: number; description: string }[] = [];

        for (const pattern of CACHEABLE_API_PATTERNS) {
            pattern.regex.lastIndex = 0;
            let match;
            while ((match = pattern.regex.exec(content)) !== null) {
                const pos = this.getLineCol(content, match.index);
                calls.push({
                    callName: match[0].replace(/\s*\($/, ''),
                    provider: pattern.provider,
                    line: pos.line,
                    col: pos.col,
                    description: pattern.description
                });
            }
        }

        return calls;
    }

    /**
     * Find the same API call made multiple times in the file.
     */
    private findDuplicateCalls(content: string, fileUri: string): {
        callName: string; count: number; line: number; col: number;
    }[] {
        const callCounts = new Map<string, { count: number; firstLine: number; firstCol: number }>();

        for (const pattern of CACHEABLE_API_PATTERNS) {
            pattern.regex.lastIndex = 0;
            let match;
            while ((match = pattern.regex.exec(content)) !== null) {
                const callName = match[0].replace(/\s*\($/, '').trim();
                const pos = this.getLineCol(content, match.index);

                const existing = callCounts.get(callName);
                if (existing) {
                    existing.count++;
                } else {
                    callCounts.set(callName, { count: 1, firstLine: pos.line, firstCol: pos.col });
                }
            }
        }

        // Only return calls that appear 2+ times
        return Array.from(callCounts.entries())
            .filter(([_, info]) => info.count >= 2)
            .map(([callName, info]) => ({
                callName,
                count: info.count,
                line: info.firstLine,
                col: info.firstCol
            }));
    }

    /**
     * Get code surrounding a given line (N lines before and after).
     */
    private getSurroundingCode(content: string, line: number, radius: number): string {
        const lines = content.split('\n');
        const start = Math.max(0, line - 1 - radius);
        const end = Math.min(lines.length, line + radius);
        return lines.slice(start, end).join('\n');
    }

    private getLineCol(content: string, index: number): { line: number; col: number } {
        const prefix = content.substring(0, index);
        const line = (prefix.match(/\n/g) || []).length + 1;
        const lastNewLine = prefix.lastIndexOf('\n');
        const col = index - (lastNewLine === -1 ? 0 : lastNewLine + 1);
        return { line, col };
    }
}
