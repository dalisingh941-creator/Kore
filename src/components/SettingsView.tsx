import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Ticket,
  Box,
  Puzzle,
  Mail,
  Smartphone,
  Monitor,
  CreditCard,
  Globe,
  Moon,
  Square,
  Brush,
  Heart,
  HelpCircle,
  Asterisk,
  ArrowUpRight,
  Cpu,
  Server,
  Check,
  Plus,
} from 'lucide-react';
import {
  Agent,
  AppIntegration,
  MCPServer,
  ProviderProfile,
  SkillDefinition,
} from '../types/agent';
import { createMcpServerEntry, validateMcpServerInput } from '../utils/agentLogic';

interface SettingsViewProps {
  onBack: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  providers: ProviderProfile[];
  activeProviderId: string;
  onSelectProvider: (id: string) => void;
  mcpServers: MCPServer[];
  onToggleMcpServer: (id: string) => void;
  onAddMcpServer: (server: MCPServer) => void;
  skills: SkillDefinition[];
  apps: AppIntegration[];
  onToggleApp: (id: string) => void;
  agents: Agent[];
}

type SettingsDetailSection =
  | null
  | 'providers'
  | 'mcp'
  | 'apps'
  | 'skills'
  | 'email'
  | 'phone'
  | 'computer'
  | 'wallet'
  | 'invite'
  | 'language';

export const SettingsView: React.FC<SettingsViewProps> = ({
  onBack,
  darkMode,
  onToggleDarkMode,
  providers,
  activeProviderId,
  onSelectProvider,
  mcpServers,
  onToggleMcpServer,
  onAddMcpServer,
  skills,
  apps,
  onToggleApp,
  agents,
}) => {
  const [activeDetail, setActiveDetail] = useState<SettingsDetailSection>(null);
  const [cacheBytes, setCacheBytes] = useState('534 KB');
  const [language, setLanguage] = useState('English');
  const [inviteCode, setInviteCode] = useState('KORE-AGENT-2026');
  const [planUpgraded, setPlanUpgraded] = useState(false);

  // Custom MCP Server form state
  const [mcpName, setMcpName] = useState('');
  const [mcpTransport, setMcpTransport] = useState<'stdio' | 'sse' | 'http'>('sse');
  const [mcpEndpoint, setMcpEndpoint] = useState('');
  const [mcpTools, setMcpTools] = useState('read_schema, execute_query');
  const [mcpError, setMcpError] = useState<string | null>(null);

  const handleRegisterMcp = (e: React.FormEvent) => {
    e.preventDefault();
    const check = validateMcpServerInput(mcpName, mcpEndpoint);
    if (!check.valid) {
      setMcpError(check.error || 'Invalid MCP configuration.');
      return;
    }
    const created = createMcpServerEntry(mcpName, mcpTransport, mcpEndpoint, mcpTools);
    onAddMcpServer(created);
    setMcpName('');
    setMcpEndpoint('');
    setMcpError(null);
  };

  const cardClass = `rounded-[26px] overflow-hidden transition-colors ${
    darkMode ? 'bg-[#1E1E22] text-zinc-100' : 'bg-white text-zinc-900'
  }`;

  const dividerClass = darkMode ? 'divide-y divide-zinc-800/80' : 'divide-y divide-zinc-100';

  return (
    <div
      className={`h-full w-full overflow-y-auto select-none transition-colors ${
        darkMode ? 'bg-[#121214] text-zinc-100' : 'bg-[#F5F5F3] text-zinc-900'
      }`}
    >
      <div className="max-w-2xl mx-auto px-4 pt-4 pb-12 space-y-4">
        {/* Top Bar matching Screenshot 2 & 5 */}
        <div className="relative flex items-center justify-center py-2">
          <button
            type="button"
            onClick={() => (activeDetail ? setActiveDetail(null) : onBack())}
            aria-label="Back from Settings"
            className={`absolute left-0 w-11 h-11 rounded-full flex items-center justify-center shadow-xs transition-colors ${
              darkMode
                ? 'bg-[#1E1E22] text-zinc-100 hover:bg-zinc-800'
                : 'bg-white text-zinc-800 hover:bg-zinc-100'
            }`}
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
          </button>
          <h1 className="text-[19px] font-semibold tracking-tight">
            {activeDetail ? 'Workspace Configuration' : 'Settings'}
          </h1>
        </div>

        {/* Sub-screen Detail Drawer when a Settings row is clicked */}
        {activeDetail && (
          <div className={`${cardClass} p-5 space-y-4`}>
            <div className="flex items-center justify-between border-b pb-3 border-zinc-200/60 dark:border-zinc-800">
              <h2 className="text-base font-semibold capitalize">
                {activeDetail === 'providers' && 'AI Providers & Built-in Server Gateway'}
                {activeDetail === 'mcp' && 'Model Context Protocol (MCP) Servers'}
                {activeDetail === 'apps' && 'Connected Workspace Apps'}
                {activeDetail === 'skills' && 'Autonomous Agent Skills'}
                {activeDetail === 'email' && 'Agent Dedicated Email Routing'}
                {activeDetail === 'phone' && 'Agent Virtual Phone Numbers'}
                {activeDetail === 'computer' && 'Cloud & Local Computer Sandboxes'}
                {activeDetail === 'wallet' && 'Agent Scoped Wallets & Spending Limits'}
                {activeDetail === 'invite' && 'Workspace Invite Code'}
                {activeDetail === 'language' && 'Interface Language'}
              </h2>
              <button
                type="button"
                onClick={() => setActiveDetail(null)}
                className="text-xs font-medium text-blue-600 dark:text-blue-400"
              >
                Back to all settings
              </button>
            </div>

            {activeDetail === 'providers' && (
              <div className="space-y-3">
                <p className="text-xs text-zinc-500">
                  The Built-in AI Gateway is pre-connected on the server with zero client key exposure. Switch active routing profiles below:
                </p>
                {providers.map((p) => {
                  const selected = p.id === activeProviderId;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => onSelectProvider(p.id)}
                      className={`w-full p-4 rounded-2xl border text-left transition-all flex items-start justify-between gap-3 ${
                        selected
                          ? 'border-blue-500 bg-blue-500/5'
                          : darkMode
                          ? 'border-zinc-800 hover:bg-zinc-800/50'
                          : 'border-zinc-200 hover:bg-zinc-50'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">{p.name}</span>
                          <span className="text-xs font-mono text-zinc-400">
                            · {p.modelId}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-500">{p.description}</p>
                        <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                          {p.authMode} · {p.latencyMs}ms avg
                        </div>
                      </div>
                      {selected && <Check className="w-5 h-5 text-blue-500 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}

            {activeDetail === 'mcp' && (
              <div className="space-y-4">
                <div className="space-y-2.5">
                  {mcpServers.map((mcp) => (
                    <div
                      key={mcp.id}
                      className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                        darkMode ? 'border-zinc-800' : 'border-zinc-200/80'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">{mcp.name}</span>
                          <span className="text-[11px] font-mono uppercase text-zinc-400">
                            {mcp.transport} · {mcp.toolsCount} tools
                          </span>
                        </div>
                        <div className="text-xs font-mono text-zinc-400 truncate mt-0.5">
                          {mcp.endpoint}
                        </div>
                        <p className="text-xs text-zinc-500 mt-1">{mcp.description}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onToggleMcpServer(mcp.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors ${
                          mcp.enabled
                            ? 'bg-emerald-600 text-white'
                            : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'
                        }`}
                      >
                        {mcp.enabled ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleRegisterMcp} className="pt-3 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Register Custom MCP Server
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={mcpName}
                      onChange={(e) => setMcpName(e.target.value)}
                      placeholder="Server Name (e.g. Postgres MCP)"
                      aria-label="MCP Server Name"
                      className={`px-3 py-2 rounded-xl border text-xs ${
                        darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
                      }`}
                    />
                    <select
                      value={mcpTransport}
                      onChange={(e) => setMcpTransport(e.target.value as 'stdio' | 'sse' | 'http')}
                      aria-label="MCP Transport"
                      className={`px-3 py-2 rounded-xl border text-xs ${
                        darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
                      }`}
                    >
                      <option value="sse">SSE Endpoint</option>
                      <option value="stdio">Stdio Command</option>
                      <option value="http">HTTP Stream</option>
                    </select>
                    <input
                      type="text"
                      value={mcpEndpoint}
                      onChange={(e) => setMcpEndpoint(e.target.value)}
                      placeholder="https://mcp.example/sse or command"
                      aria-label="MCP Endpoint or Command"
                      className={`px-3 py-2 rounded-xl border text-xs font-mono ${
                        darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
                      }`}
                    />
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={mcpTools}
                      onChange={(e) => setMcpTools(e.target.value)}
                      placeholder="Exposed tools (comma separated)"
                      aria-label="Exposed MCP tools"
                      className={`flex-1 px-3 py-2 rounded-xl border text-xs font-mono ${
                        darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
                      }`}
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-zinc-900 dark:bg-blue-600 text-white text-xs font-semibold flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add MCP</span>
                    </button>
                  </div>
                  {mcpError && <p className="text-xs text-red-500">{mcpError}</p>}
                </form>
              </div>
            )}

            {activeDetail === 'apps' && (
              <div className="space-y-2.5">
                {apps.map((app) => (
                  <div
                    key={app.id}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                      darkMode ? 'border-zinc-800' : 'border-zinc-200/80'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-semibold">{app.name}</div>
                      <div className="text-xs text-zinc-400">{app.accountLabel}</div>
                      <p className="text-xs text-zinc-500 mt-0.5">{app.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onToggleApp(app.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                        app.connected
                          ? 'bg-zinc-900 dark:bg-blue-600 text-white'
                          : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'
                      }`}
                    >
                      {app.connected ? 'Connected' : 'Connect'}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {activeDetail === 'skills' && (
              <div className="space-y-2.5">
                {skills.map((sk) => (
                  <div
                    key={sk.id}
                    className={`p-3.5 rounded-2xl border ${
                      darkMode ? 'border-zinc-800' : 'border-zinc-200/80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">{sk.name}</span>
                      <span className="text-xs text-zinc-400">{sk.category}</span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-1">{sk.description}</p>
                  </div>
                ))}
              </div>
            )}

            {activeDetail === 'email' && (
              <div className="space-y-2 text-xs">
                {agents.map((ag) => (
                  <div
                    key={ag.id}
                    className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-800"
                  >
                    <span className="font-medium">{ag.name}</span>
                    <span className="font-mono text-blue-500">{ag.identity.email}</span>
                  </div>
                ))}
              </div>
            )}

            {activeDetail === 'phone' && (
              <div className="space-y-2 text-xs">
                {agents.map((ag) => (
                  <div
                    key={ag.id}
                    className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-800"
                  >
                    <span className="font-medium">{ag.name}</span>
                    <span className="font-mono text-zinc-400">
                      {ag.identity.phone || 'Standby VoIP Pool'}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {activeDetail === 'computer' && (
              <div className="space-y-2 text-xs">
                {agents.map((ag) => (
                  <div
                    key={ag.id}
                    className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-800"
                  >
                    <div>
                      <span className="font-medium">{ag.identity.computerName}</span>
                      <span className="text-zinc-400 ml-2">{ag.identity.computerOs}</span>
                    </div>
                    <span className="font-mono text-emerald-500">{ag.identity.computerTier}</span>
                  </div>
                ))}
              </div>
            )}

            {activeDetail === 'wallet' && (
              <div className="space-y-2 text-xs">
                {agents.map((ag) => (
                  <div
                    key={ag.id}
                    className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-800"
                  >
                    <span className="font-medium">{ag.name}</span>
                    <span className="font-mono">
                      ${ag.identity.walletSpentUsd.toFixed(2)} / $
                      {ag.identity.walletLimitUsd.toFixed(2)} USD
                    </span>
                  </div>
                ))}
              </div>
            )}

            {activeDetail === 'invite' && (
              <div className="space-y-2 text-xs">
                <p className="text-zinc-500">
                  Share this invite code to grant teammates access to your autonomous agent fleet:
                </p>
                <div className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-900 font-mono text-sm font-semibold flex justify-between items-center">
                  <span>{inviteCode}</span>
                  <button
                    type="button"
                    onClick={() => setInviteCode('KORE-PRO-9941')}
                    className="text-xs text-blue-500"
                  >
                    Rotate Code
                  </button>
                </div>
              </div>
            )}

            {activeDetail === 'language' && (
              <div className="flex gap-2">
                {['English', 'Hinglish / Hindi', ' Español', '日本語'].map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => {
                      setLanguage(lang.trim());
                      setActiveDetail(null);
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-medium border ${
                      language === lang.trim()
                        ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-blue-600'
                        : 'border-zinc-200 dark:border-zinc-700'
                    }`}
                  >
                    {lang.trim()}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* User Profile Card matching Screenshot 5 ("A" teal circle) */}
        <div className={`${cardClass} p-4 flex items-center justify-between`}>
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-full bg-[#007A8C] text-white text-2xl font-medium flex items-center justify-center shrink-0">
              A
            </div>
            <div>
              <div className="text-[17px] font-semibold">Arjun Singh</div>
              <div className="text-xs text-zinc-400 font-mono">
                arjun@kore.workspace · {agents.length} Active Agents
              </div>
            </div>
          </div>
          <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400">
            Verified
          </span>
        </div>

        {/* Plan & Weekly Usage Card matching Screenshot 5 ("Plus", "Upgrade", "Weekly Usage 31%") */}
        <div className={`${cardClass} p-5 space-y-4`}>
          <div className="flex items-center justify-between border-b pb-3.5 border-zinc-100 dark:border-zinc-800/80">
            <span className="text-[20px] font-semibold">
              {planUpgraded ? 'Ultra Fleet' : 'Plus'}
            </span>
            <button
              type="button"
              onClick={() => setPlanUpgraded((prev) => !prev)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                darkMode
                  ? 'bg-zinc-800 text-zinc-100 hover:bg-zinc-700'
                  : 'bg-[#F3F3F1] text-zinc-800 hover:bg-zinc-200/80'
              }`}
            >
              {planUpgraded ? 'Active Plan' : 'Upgrade'}
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-[15.5px]">
              <span>Weekly Usage</span>
              <span className="text-zinc-500 font-mono tabular-nums">31 %</span>
            </div>
            <div className="w-full h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
              <div className="h-full w-[31%] rounded-full bg-zinc-900 dark:bg-blue-500" />
            </div>
            <div className="text-xs text-zinc-400">Reset in 4 days</div>
          </div>
        </div>

        {/* Invite Code Card matching Screenshot 5 */}
        <div className={cardClass}>
          <button
            type="button"
            onClick={() => setActiveDetail('invite')}
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:opacity-80 transition-opacity"
          >
            <div className="flex items-center gap-3.5">
              <Ticket className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
              <span className="text-[16px]">Invite code</span>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-400" />
          </button>
        </div>

        {/* AI Providers & MCP Registry Card (Requested by user!) */}
        <div className={`${cardClass} ${dividerClass}`}>
          <button
            type="button"
            onClick={() => setActiveDetail('providers')}
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:opacity-80 transition-opacity"
          >
            <div className="flex items-center gap-3.5">
              <Cpu className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
              <div>
                <div className="text-[16px]">AI Providers &amp; Built-in Gateway</div>
                <div className="text-xs text-zinc-400">
                  {providers.find((p) => p.id === activeProviderId)?.name}
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-400" />
          </button>

          <button
            type="button"
            onClick={() => setActiveDetail('mcp')}
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:opacity-80 transition-opacity"
          >
            <div className="flex items-center gap-3.5">
              <Server className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
              <div>
                <div className="text-[16px]">MCP Servers</div>
                <div className="text-xs text-zinc-400 font-mono">
                  {mcpServers.filter((m) => m.enabled).length} active protocol bridges
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-400" />
          </button>
        </div>

        {/* Apps, Skills, Email, Phone, Computer, Wallet Group matching Screenshot 2 & 5 */}
        <div className={`${cardClass} ${dividerClass}`}>
          <button
            type="button"
            onClick={() => setActiveDetail('apps')}
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:opacity-80 transition-opacity"
          >
            <div className="flex items-center gap-3.5">
              <Box className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
              <span className="text-[16px]">Apps</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center -space-x-1.5">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-zinc-900">
                  C
                </span>
                <span className="w-6 h-6 rounded-full bg-zinc-900 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-zinc-900">
                  N
                </span>
                <span className="w-6 h-6 rounded-full bg-lime-400 text-zinc-900 text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-zinc-900">
                  G
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-400" />
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveDetail('skills')}
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:opacity-80 transition-opacity"
          >
            <div className="flex items-center gap-3.5">
              <Puzzle className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
              <span className="text-[16px]">Skills</span>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-400" />
          </button>

          <button
            type="button"
            onClick={() => setActiveDetail('email')}
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:opacity-80 transition-opacity"
          >
            <div className="flex items-center gap-3.5">
              <Mail className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
              <span className="text-[16px]">Email</span>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-400" />
          </button>

          <button
            type="button"
            onClick={() => setActiveDetail('phone')}
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:opacity-80 transition-opacity"
          >
            <div className="flex items-center gap-3.5">
              <Smartphone className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
              <span className="text-[16px]">Phone</span>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-400" />
          </button>

          <button
            type="button"
            onClick={() => setActiveDetail('computer')}
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:opacity-80 transition-opacity"
          >
            <div className="flex items-center gap-3.5">
              <Monitor className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
              <span className="text-[16px]">Computer</span>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-400" />
          </button>

          <button
            type="button"
            onClick={() => setActiveDetail('wallet')}
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:opacity-80 transition-opacity"
          >
            <div className="flex items-center gap-3.5">
              <CreditCard className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
              <span className="text-[16px]">Wallet</span>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-400" />
          </button>
        </div>

        {/* Language, Appearance, App Icon, Clear Cache Group matching Screenshot 2 */}
        <div className={`${cardClass} ${dividerClass}`}>
          <button
            type="button"
            onClick={() => setActiveDetail('language')}
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:opacity-80 transition-opacity"
          >
            <div className="flex items-center gap-3.5">
              <Globe className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
              <span className="text-[16px]">Language</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-400 text-[15.5px]">
              <span>{language}</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>

          <button
            type="button"
            onClick={onToggleDarkMode}
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:opacity-80 transition-opacity"
          >
            <div className="flex items-center gap-3.5">
              <Moon className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
              <span className="text-[16px]">Appearance</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-400 text-[15.5px]">
              <span>{darkMode ? 'Dark mode' : 'Light mode'}</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveDetail('providers')}
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:opacity-80 transition-opacity"
          >
            <div className="flex items-center gap-3.5">
              <Square className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
              <span className="text-[16px]">App icon</span>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-400" />
          </button>

          <button
            type="button"
            onClick={() => setCacheBytes('0 KB')}
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:opacity-80 transition-opacity"
          >
            <div className="flex items-center gap-3.5">
              <Brush className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
              <span className="text-[16px]">Clear cache</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-400 text-[15.5px] font-mono tabular-nums">
              <span>{cacheBytes}</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>
        </div>

        {/* Rate, Help, Version Group matching Screenshot 2 */}
        <div className={`${cardClass} ${dividerClass}`}>
          <button
            type="button"
            onClick={() => setActiveDetail('invite')}
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:opacity-80 transition-opacity"
          >
            <div className="flex items-center gap-3.5">
              <Heart className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
              <span className="text-[16px]">Rate this app</span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-zinc-400" />
          </button>

          <button
            type="button"
            onClick={() => setActiveDetail('skills')}
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:opacity-80 transition-opacity"
          >
            <div className="flex items-center gap-3.5">
              <HelpCircle className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
              <span className="text-[16px]">Get help</span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-zinc-400" />
          </button>

          <div className="w-full flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3.5">
              <Asterisk className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
              <span className="text-[16px]">Version</span>
            </div>
            <span className="text-zinc-400 text-[15.5px] font-mono tabular-nums">
              v26.18.5
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
