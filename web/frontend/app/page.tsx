import Link from 'next/link'
import { ArrowRightIcon, BoltIcon, SparklesIcon, ChartBarIcon } from '@heroicons/react/24/outline'

export default function Home() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900">
            {/* Navigation */}
            <nav className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                                <BoltIcon className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                                    ASTRA
                                </span>
                                <p className="text-[9px] text-gray-400 -mt-0.5 leading-tight">Advanced Sustainable Technology & Resource Analytics</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-6">
                            <Link href="/builder" className="text-gray-300 hover:text-white transition font-medium">
                                Analyzer
                            </Link>
                            <Link href="/sandboxes" className="text-gray-300 hover:text-white transition font-medium">
                                Projects
                            </Link>
                            <Link
                                href="/builder"
                                className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition flex items-center space-x-2 font-semibold shadow-lg shadow-green-500/30"
                            >
                                <span>Start Analyzing</span>
                                <ArrowRightIcon className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center animate-fade-in">
                    <div className="inline-block px-4 py-2 bg-green-500/10 border border-green-500/30 text-green-400 rounded-full text-sm font-semibold mb-6">
                        🌱 Guiding sustainable computing decisions before production
                    </div>
                    <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
                        Build Software That's
                        <br />
                        <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-blue-400 bg-clip-text text-transparent">
                            Carbon-Aware by Design
                        </span>
                    </h1>
                    <p className="text-xl text-gray-300 mb-10 max-w-4xl mx-auto leading-relaxed">
                        ASTRA embeds <strong className="text-green-400">energy and carbon intelligence</strong> directly into your development workflow.
                        Measure, predict, and optimize your code's environmental impact <em className="text-blue-400">before deployment</em>.
                    </p>

                    {/* Animated Analytics Visualization */}
                    <div className="flex justify-center mb-10">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 blur-2xl rounded-full"></div>
                            <div className="relative bg-gray-800/50 backdrop-blur-sm border-2 border-green-500/30 rounded-2xl p-8 px-12">
                                <p className="text-xs text-gray-400 mb-3 font-semibold uppercase tracking-wider">Real-Time Analytics</p>
                                <div className="loader">
                                    <div className="loader__bar"></div>
                                    <div className="loader__bar"></div>
                                    <div className="loader__bar"></div>
                                    <div className="loader__bar"></div>
                                    <div className="loader__bar"></div>
                                    <div className="loader__ball"></div>
                                </div>
                                <p className="text-xs text-gray-500 mt-3">Monitoring compute patterns</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center space-x-4 mb-6">
                        <Link
                            href="/builder"
                            className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition text-lg font-bold flex items-center space-x-2 shadow-lg shadow-green-500/30 hover:shadow-green-500/50"
                        >
                            <span>Analyze Your Code</span>
                            <ArrowRightIcon className="h-5 w-5" />
                        </Link>
                        <Link
                            href="/sandboxes"
                            className="px-8 py-4 bg-gray-800/50 border-2 border-green-500/50 text-green-400 rounded-xl hover:bg-gray-800 hover:border-green-400 transition text-lg font-bold shadow-lg"
                        >
                            View Examples
                        </Link>
                    </div>
                    <p className="text-sm text-gray-500 italic">
                        "Make carbon and energy awareness a first-class engineering constraint"
                    </p>
                </div>

                {/* Problem Statement - 3D Carousel */}
                <div className="mt-20 relative">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-white mb-3">⚠️ The Problem We Solve</h2>
                        <p className="text-gray-400 text-lg mb-2">Traditional development workflows lack sustainability visibility</p>
                        <p className="text-sm text-gray-500">Rotate in 3D - Issues discovered too late</p>
                    </div>

                    <div className="carousel-wrapper">
                        <div className="carousel-inner">
                            {/* Card 1 */}
                            <div className="carousel-card">
                                <div className="flex items-center mb-4">
                                    <div className="h-10 w-10 bg-red-500/30 rounded-lg flex items-center justify-center mr-3">
                                        <span className="text-2xl">🔴</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-red-300">API Overload</h3>
                                </div>
                                <p className="text-gray-200 font-medium mb-2">Excessive API calls go undetected</p>
                                <p className="text-gray-400 text-sm">No visibility into redundant requests until production</p>
                                <div className="mt-4 pt-4 border-t border-red-500/30">
                                    <span className="text-xs text-orange-400">💸 Discovered: After bills arrive</span>
                                </div>
                            </div>

                            {/* Card 2 */}
                            <div className="carousel-card">
                                <div className="flex items-center mb-4">
                                    <div className="h-10 w-10 bg-red-500/30 rounded-lg flex items-center justify-center mr-3">
                                        <span className="text-2xl">⚡</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-red-300">Wasted Energy</h3>
                                </div>
                                <p className="text-gray-200 font-medium mb-2">Redundant computation wastes energy</p>
                                <p className="text-gray-400 text-sm">Inefficient loops and algorithms burn resources</p>
                                <div className="mt-4 pt-4 border-t border-red-500/30">
                                    <span className="text-xs text-orange-400">🌍 Discovered: After emissions generated</span>
                                </div>
                            </div>

                            {/* Card 3 */}
                            <div className="carousel-card">
                                <div className="flex items-center mb-4">
                                    <div className="h-10 w-10 bg-red-500/30 rounded-lg flex items-center justify-center mr-3">
                                        <span className="text-2xl">🤖</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-red-300">ML Inefficiency</h3>
                                </div>
                                <p className="text-gray-200 font-medium mb-2">Training inefficiencies hidden</p>
                                <p className="text-gray-400 text-sm">GPU costs spiral until deployment reveals issues</p>
                                <div className="mt-4 pt-4 border-t border-red-500/30">
                                    <span className="text-xs text-orange-400">🚀 Discovered: After deployment</span>
                                </div>
                            </div>

                            {/* Card 4 */}
                            <div className="carousel-card">
                                <div className="flex items-center mb-4">
                                    <div className="h-10 w-10 bg-red-500/30 rounded-lg flex items-center justify-center mr-3">
                                        <span className="text-2xl">☁️</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-red-300">Over-Provisioning</h3>
                                </div>
                                <p className="text-gray-200 font-medium mb-2">Infrastructure waste</p>
                                <p className="text-gray-400 text-sm">Resources allocated without carbon consideration</p>
                                <div className="mt-4 pt-4 border-t border-red-500/30">
                                    <span className="text-xs text-orange-400">📊 Discovered: No actionable insights</span>
                                </div>
                            </div>

                            {/* Card 5 */}
                            <div className="carousel-card">
                                <div className="flex items-center mb-4">
                                    <div className="h-10 w-10 bg-red-500/30 rounded-lg flex items-center justify-center mr-3">
                                        <span className="text-2xl">🌫️</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-red-300">Zero Visibility</h3>
                                </div>
                                <p className="text-gray-200 font-medium mb-2">No carbon tracking</p>
                                <p className="text-gray-400 text-sm">Environmental impact completely invisible to developers</p>
                                <div className="mt-4 pt-4 border-t border-red-500/30">
                                    <span className="text-xs text-orange-400">🔥 Discovered: Too late to prevent</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Solution Teaser Below Carousel */}
                    <div className="mt-16 text-center">
                        <div className="inline-block bg-gradient-to-r from-green-950/80 to-blue-950/80 border-2 border-green-500/40 rounded-2xl p-8 backdrop-blur-sm max-w-2xl">
                            <div className="flex items-center justify-center mb-4">
                                <div className="h-12 w-12 bg-green-500/20 rounded-lg flex items-center justify-center mr-3">
                                    <span className="text-3xl">✅</span>
                                </div>
                                <h3 className="text-2xl font-bold text-green-400">ASTRA Changes Everything</h3>
                            </div>
                            <p className="text-gray-300 mb-4">
                                Detect issues <strong className="text-green-400">in your IDE</strong>, optimize <strong className="text-blue-400">before deployment</strong>, and enforce carbon budgets <strong className="text-purple-400">in CI/CD</strong>
                            </p>
                            <div className="flex flex-wrap justify-center gap-2">
                                <span className="px-3 py-1 bg-green-900/40 border border-green-500/30 rounded-full text-xs text-gray-300">💻 Real-time</span>
                                <span className="px-3 py-1 bg-green-900/40 border border-green-500/30 rounded-full text-xs text-gray-300">🔍 Proactive</span>
                                <span className="px-3 py-1 bg-green-900/40 border border-green-500/30 rounded-full text-xs text-gray-300">🛡️ Preventive</span>
                                <span className="px-3 py-1 bg-green-900/40 border border-green-500/30 rounded-full text-xs text-gray-300">✨ Before production</span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Core Features */}
                <div className="mt-24">
                    <h2 className="text-4xl font-bold text-center text-white mb-4">
                        🌟 Carbon Intelligence at Every Stage
                    </h2>
                    <p className="text-center text-gray-400 mb-12 text-lg max-w-3xl mx-auto">
                        From code to deployment, ASTRA provides real-time sustainability insights that prevent waste before it happens
                    </p>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-xl hover:shadow-2xl transition border border-green-500/20 hover:border-green-500/40">
                            <div className="h-14 w-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-5 shadow-lg shadow-green-500/30">
                                <SparklesIcon className="h-7 w-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Real-Time IDE Intelligence</h3>
                            <p className="text-gray-300 mb-4 leading-relaxed">
                                Get instant carbon and energy estimates as you code. Detect API overuse,
                                compute hotspots, and ML inefficiencies before they reach production.
                            </p>
                            <ul className="text-sm text-gray-400 space-y-2 bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                                <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> API call detection</li>
                                <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Loop & recursion analysis</li>
                                <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Energy usage estimates</li>
                                <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Carbon emission predictions</li>
                            </ul>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-xl hover:shadow-2xl transition border border-blue-500/20 hover:border-blue-500/40">
                            <div className="h-14 w-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-5 shadow-lg shadow-blue-500/30">
                                <ChartBarIcon className="h-7 w-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">ML Workload Estimation</h3>
                            <p className="text-gray-300 mb-4 leading-relaxed">
                                Calculate energy consumption and carbon footprint of ML training
                                and inference workloads before running them.
                            </p>
                            <ul className="text-sm text-gray-400 space-y-2 bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                                <li className="flex items-center"><span className="text-blue-400 mr-2">✓</span> GPU power modeling</li>
                                <li className="flex items-center"><span className="text-blue-400 mr-2">✓</span> Regional carbon intensity</li>
                                <li className="flex items-center"><span className="text-blue-400 mr-2">✓</span> Training vs inference comparison</li>
                                <li className="flex items-center"><span className="text-blue-400 mr-2">✓</span> Model optimization suggestions</li>
                            </ul>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-xl hover:shadow-2xl transition border border-purple-500/20 hover:border-purple-500/40">
                            <div className="h-14 w-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-5 shadow-lg shadow-purple-500/30">
                                <BoltIcon className="h-7 w-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">CI/CD Carbon Guardrails</h3>
                            <p className="text-gray-300 mb-4 leading-relaxed">
                                Enforce carbon budgets and cost thresholds in your pipeline.
                                Block inefficient code before it merges.
                            </p>
                            <ul className="text-sm text-gray-400 space-y-2 bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                                <li className="flex items-center"><span className="text-purple-400 mr-2">✓</span> Automated carbon checks</li>
                                <li className="flex items-center"><span className="text-purple-400 mr-2">✓</span> Policy-as-code enforcement</li>
                                <li className="flex items-center"><span className="text-purple-400 mr-2">✓</span> PR blocking on thresholds</li>
                                <li className="flex items-center"><span className="text-purple-400 mr-2">✓</span> Sustainability reports</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* How It Works */}
                <div className="mt-24 bg-gradient-to-r from-green-600 via-emerald-600 to-blue-600 rounded-3xl p-12 text-white shadow-2xl">
                    <h2 className="text-4xl font-bold mb-8 text-center">⚡ How ASTRA Works</h2>
                    <div className="grid md:grid-cols-4 gap-6 mt-12">
                        <div className="text-center">
                            <div className="h-20 w-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold border-2 border-white/30 shadow-lg">
                                1
                            </div>
                            <h3 className="font-bold mb-2 text-lg">Analyze Code</h3>
                            <p className="text-sm text-green-50">Parse AST, detect patterns, identify compute hotspots</p>
                        </div>
                        <div className="text-center">
                            <div className="h-20 w-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold border-2 border-white/30 shadow-lg">
                                2
                            </div>
                            <h3 className="font-bold mb-2 text-lg">Estimate Impact</h3>
                            <p className="text-sm text-green-50">Calculate energy & carbon using validated power models</p>
                        </div>
                        <div className="text-center">
                            <div className="h-20 w-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold border-2 border-white/30 shadow-lg">
                                3
                            </div>
                            <h3 className="font-bold mb-2 text-lg">Recommend</h3>
                            <p className="text-sm text-green-50">AI-powered optimization strategies</p>
                        </div>
                        <div className="text-center">
                            <div className="h-20 w-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold border-2 border-white/30 shadow-lg">
                                4
                            </div>
                            <h3 className="font-bold mb-2 text-lg">Enforce</h3>
                            <p className="text-sm text-green-50">Automated guardrails in CI/CD</p>
                        </div>
                    </div>
                </div>

                {/* Target Workloads */}
                <div className="mt-24 text-center">
                    <h2 className="text-4xl font-bold text-white mb-6">
                        🎯 Analyze Any Digital Workload
                    </h2>
                    <p className="text-gray-400 mb-10 text-lg">
                        From API-heavy backends to ML pipelines, ASTRA covers your entire stack
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        {['API Systems', 'ML Training', 'Data Pipelines', 'Batch Jobs', 'Microservices', 'Cloud Infrastructure', 'Inference Workloads', 'Serverless Functions'].map((tech) => (
                            <span
                                key={tech}
                                className="px-6 py-3 bg-gray-800/50 border-2 border-green-500/30 rounded-xl text-gray-200 font-semibold shadow-md hover:shadow-lg hover:border-green-400/50 hover:bg-gray-800 hover:scale-105 transition backdrop-blur-sm"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Impact Stats */}
                <div className="mt-24 grid md:grid-cols-3 gap-8">
                    <div className="bg-gradient-to-br from-green-900/40 to-green-800/40 p-10 rounded-2xl shadow-xl border-2 border-green-500/30 backdrop-blur-sm">
                        <div className="text-5xl font-black bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent mb-3">60%</div>
                        <p className="text-gray-300 font-semibold text-lg">Reduction in unnecessary compute</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/40 p-10 rounded-2xl shadow-xl border-2 border-blue-500/30 backdrop-blur-sm">
                        <div className="text-5xl font-black bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent mb-3">40%</div>
                        <p className="text-gray-300 font-semibold text-lg">Lower cloud infrastructure costs</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/40 p-10 rounded-2xl shadow-xl border-2 border-purple-500/30 backdrop-blur-sm">
                        <div className="text-5xl font-black bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent mb-3">75%</div>
                        <p className="text-gray-300 font-semibold text-lg">Fewer redundant API calls</p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="border-t-2 border-gray-800 bg-gray-900/80 backdrop-blur-sm mt-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="text-center">
                        <p className="font-bold text-gray-200 mb-3 text-lg">
                            "Make carbon and energy awareness a first-class engineering constraint"
                        </p>
                        <p className="text-gray-400">© 2026 ASTRA - Advanced Sustainable Technology & Resource Analytics</p>
                        <p className="text-sm text-gray-500 mt-2">Built with Next.js, FastAPI, and AI-powered sustainability intelligence</p>
                    </div>
                </div>
            </footer>
        </main>
    )
}
