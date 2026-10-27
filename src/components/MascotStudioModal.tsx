import React, { useState } from 'react';
import {
  X,
  Check,
  ScanLine,
  Hash,
  Bot,
  Cpu,
  Shuffle,
} from 'lucide-react';
import {
  Agent,
  GroupChat,
  MascotAccessory,
  MascotExpression,
  MascotShape,
  MascotStatus,
  MCPServer,
  ProviderProfile,
} from '../types/agent';
import {
  MASCOT_ACCESSORIES,
  MASCOT_COLORS,
  MASCOT_EXPRESSIONS,
  MASCOT_SHAPES,
  buildNewAgent,
  validateCreateAgentInput,
} from '../utils/agentLogic';
import { MascotAvatar } from './MascotAvatar';

interface MascotStudioModalProps {
  mode: 'agent' | 'scan' | 'group';
  editingAgent?: Agent;
  onClose: () => void;
  onCreatedAgent: (agent: Agent) => void;
  onUpdatedAgent?: (agent: Agent) => void;
  onCreatedGroup: (group: GroupChat) => void;
  existingAgents: Agent[];
  providers: ProviderProfile[];
  mcpServers: MCPServer[];
  darkMode: boolean;
}

const SCAN_PRESETS = [
  {
    id: 'scan-k8s',
    title: 'Kubernetes Ingress & TLS Manifest QR',
    codePayload: 'kore://spawn?spec=k8s-ingress-auditor&env=prod-cluster',
    agentName: 'Aegis',
    role: 'Kubernetes Ingress & Certificate Auditor',
    shape: 'hexagon' as MascotShape,
    color: '#10B981',
    expression: 'determined' as MascotExpression,
    accessory: 'visor' as MascotAccessory,
    instructions:
      'Audit ingress annotations, cert-manager renewal loops, and zero-downtime rollout health.',
  },
  {
    id: 'scan-sql',
    title: 'Postgres Query Plan & Index Bottleneck Spec',
    codePayload: 'kore://spawn?spec=pg-index-profiler&db=analytics-replica',
    agentName: 'Koda',
    role: 'PostgreSQL Query Plan & Index Optimizer',
    shape: 'diamond' as MascotShape,
    color: '#8B5CF6',
    expression: 'analytical' as MascotExpression,
    accessory: 'glasses' as MascotAccessory,
    instructions:
      'Analyze EXPLAIN (ANALYZE, BUFFERS) trees and eliminate sequential scan regressions.',
  },
  {
    id: 'scan-sec',
    title: 'OAuth & Webhook Signature Verification Card',
    codePayload: 'kore://spawn?spec=webhook-hmac-verifier&repo=core-api',
    agentName: 'Riven',
    role: 'Cryptographic Webhook & Token Verifier',
    shape: 'cloud' as MascotShape,
    color: '#F43F5E',
    expression: 'focused' as MascotExpression,
    accessory: 'antenna' as MascotAccessory,
    instructions:
      'Verify HMAC-SHA256 payload signatures, replay timestamps, and scoped token claims.',
  },
];

export const MascotStudioModal: React.FC<MascotStudioModalProps> = ({
  mode: initialMode,
  editingAgent,
  onClose,
  onCreatedAgent,
  onUpdatedAgent,
  onCreatedGroup,
  existingAgents,
  providers,
  mcpServers,
  darkMode,
}) => {
  const [activeTab, setActiveTab] = useState<'agent' | 'scan' | 'group'>(initialMode);

  // Mascot & Agent Studio state (pre-populated if editing an existing agent's mascot)
  const [name, setName] = useState(editingAgent?.name || '');
  const [role, setRole] = useState(editingAgent?.role || '');
  const [instructions, setInstructions] = useState(editingAgent?.instructions || '');
  const [shape, setShape] = useState<MascotShape>(editingAgent?.mascot.shape || 'droplet');
  const [color, setColor] = useState<string>(editingAgent?.mascot.color || '#2B8EFF');
  const [expression, setExpression] = useState<MascotExpression>(
    editingAgent?.mascot.expression || 'cheerful'
  );
  const [accessory, setAccessory] = useState<MascotAccessory>(
    editingAgent?.mascot.accessory || 'none'
  );
  const [previewStatus, setPreviewStatus] = useState<MascotStatus>('working');
  const [providerId, setProviderId] = useState<string>(
    editingAgent?.providerId || providers[0]?.id || 'builtin-gemini'
  );
  const [walletLimit, setWalletLimit] = useState<string>(
    editingAgent ? editingAgent.identity.walletLimitUsd.toString() : '50'
  );
  const [selectedMcpIds, setSelectedMcpIds] = useState<string[]>(
    editingAgent?.enabledMcpIds || ['mcp-fs', 'mcp-github']
  );
  const [formError, setFormError] = useState<string | null>(null);

  // Group Chat state
  const [groupName, setGroupName] = useState('');
  const [groupObjective, setGroupObjective] = useState('');
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>(
    existingAgents.slice(0, 3).map((a) => a.id)
  );
  const [groupError, setGroupError] = useState<string | null>(null);

  const handleRandomizeMascot = () => {
    const rShape = MASCOT_SHAPES[Math.floor(Math.random() * MASCOT_SHAPES.length)].id;
    const rColor = MASCOT_COLORS[Math.floor(Math.random() * MASCOT_COLORS.length)].hex;
    const rExp = MASCOT_EXPRESSIONS[Math.floor(Math.random() * MASCOT_EXPRESSIONS.length)].id;
    const rAcc = MASCOT_ACCESSORIES[Math.floor(Math.random() * MASCOT_ACCESSORIES.length)].id;
    setShape(rShape);
    setColor(rColor);
    setExpression(rExp);
    setAccessory(rAcc);
  };

  const toggleMcp = (id: string) => {
    setSelectedMcpIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleMember = (id: string) => {
    setSelectedMemberIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCreateOrSaveAgent = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateCreateAgentInput({
      name,
      role,
      mascot: { shape, color, expression, accessory },
    });
    if (!validation.valid) {
      setFormError(validation.error || 'Invalid agent configuration.');
      return;
    }

    const selectedProvider = providers.find((p) => p.id === providerId);
    if (editingAgent && onUpdatedAgent) {
      onUpdatedAgent({
        ...editingAgent,
        name: name.trim(),
        role: role.trim(),
        instructions: instructions.trim() || editingAgent.instructions,
        providerId,
        modelId: selectedProvider?.modelId || editingAgent.modelId,
        enabledMcpIds: selectedMcpIds,
        mascot: { shape, color, expression, accessory },
        identity: {
          ...editingAgent.identity,
          walletLimitUsd: parseFloat(walletLimit) || editingAgent.identity.walletLimitUsd,
        },
      });
      onClose();
      return;
    }

    const created = buildNewAgent({
      name,
      role,
      instructions,
      mascot: { shape, color, expression, accessory },
      providerId,
      modelId: selectedProvider?.modelId || 'gemini-3.8-flash',
      walletLimitUsd: parseFloat(walletLimit) || 50,
      enabledMcpIds: selectedMcpIds,
    });
    onCreatedAgent(created);
    onClose();
  };

  const handleSpawnFromScan = (preset: (typeof SCAN_PRESETS)[number]) => {
    const created = buildNewAgent({
      name: preset.agentName,
      role: preset.role,
      instructions: preset.instructions,
      mascot: {
        shape: preset.shape,
        color: preset.color,
        expression: preset.expression,
        accessory: preset.accessory,
      },
      providerId: 'builtin-gemini',
      modelId: 'gemini-3.8-flash',
      walletLimitUsd: 60,
      enabledMcpIds: ['mcp-fs', 'mcp-github', 'mcp-browser'],
    });
    onCreatedAgent(created);
    onClose();
  };

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) {
      setGroupError('Group chat name is required.');
      return;
    }
    if (selectedMemberIds.length < 2) {
      setGroupError('Select at least 2 autonomous agents for group collaboration.');
      return;
    }
    const newGroup: GroupChat = {
      id: `group-${Date.now().toString(36)}`,
      name: groupName.trim(),
      pinned: true,
      memberAgentIds: selectedMemberIds,
      lastMessageTime: 'Just now',
      objective:
        groupObjective.trim() ||
        'Multi-agent collaborative task execution and cross-verification.',
      messages: [
        {
          id: `gmsg-init-${Date.now()}`,
          senderId: selectedMemberIds[0],
          senderName:
            existingAgents.find((a) => a.id === selectedMemberIds[0])?.name || 'Agent',
          text: `Group channel "${groupName.trim()}" initialized with ${selectedMemberIds.length} autonomous specialists. Share your objective to begin coordinated execution.`,
          timestamp: 'Just now',
        },
      ],
    };
    onCreatedGroup(newGroup);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mascot Creation Studio"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm"
    >
      <div
        className={`w-full max-w-2xl max-h-[90vh] flex flex-col rounded-[28px] overflow-hidden shadow-2xl border ${
          darkMode
            ? 'bg-[#1C1C1E] border-zinc-800 text-zinc-100'
            : 'bg-[#FAF9F6] border-zinc-200 text-zinc-900'
        }`}
      >
        {/* Modal Header & Mode Switcher */}
        <div
          className={`flex items-center justify-between px-5 py-4 border-b shrink-0 ${
            darkMode ? 'border-zinc-800' : 'border-zinc-200/80'
          }`}
        >
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-zinc-200/60 dark:bg-zinc-800/80">
            <button
              type="button"
              onClick={() => setActiveTab('agent')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'agent'
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Mascot Creation Studio</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('scan')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'scan'
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400'
              }`}
            >
              <ScanLine className="w-3.5 h-3.5" />
              <span>Scan &amp; Create</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('group')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'group'
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400'
              }`}
            >
              <Hash className="w-3.5 h-3.5" />
              <span>Group Chat</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close studio modal"
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {activeTab === 'agent' && (
            <form id="create-agent-form" onSubmit={handleCreateOrSaveAgent} className="space-y-5">
              {/* Interactive Mascot Stage */}
              <div
                className={`rounded-3xl p-5 border flex flex-col sm:flex-row items-center gap-6 ${
                  darkMode
                    ? 'bg-zinc-900/90 border-zinc-800'
                    : 'bg-white border-zinc-200/80 shadow-xs'
                }`}
              >
                <div className="flex flex-col items-center shrink-0">
                  <MascotAvatar
                    config={{ shape, color, expression, accessory }}
                    status={previewStatus}
                    size={108}
                    interactive={true}
                  />
                  <button
                    type="button"
                    onClick={handleRandomizeMascot}
                    className="mt-2.5 px-3 py-1 rounded-full text-xs font-medium border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-1.5 transition-colors"
                  >
                    <Shuffle className="w-3 h-3" />
                    <span>Randomize Mascot</span>
                  </button>
                </div>

                <div className="flex-1 space-y-3 w-full">
                  <div>
                    <div className="text-xs font-medium text-zinc-400 mb-1.5">
                      Preview Animation State
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {(['working', 'thinking', 'speaking', 'idle'] as MascotStatus[]).map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setPreviewStatus(st)}
                          className={`px-3 py-1 rounded-full text-xs font-medium capitalize border transition-colors ${
                            previewStatus === st
                              ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-blue-600 dark:border-blue-600'
                              : 'border-zinc-300 dark:border-zinc-700 text-zinc-500'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color Palette Picker */}
                  <div>
                    <div className="text-xs font-medium text-zinc-400 mb-1.5">
                      Mascot Color Palette (12 Curated Tones)
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {MASCOT_COLORS.map((c) => (
                        <button
                          key={c.hex}
                          type="button"
                          onClick={() => setColor(c.hex)}
                          aria-label={`Select color ${c.name}`}
                          style={{ backgroundColor: c.hex }}
                          className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform ${
                            color === c.hex
                              ? 'scale-115 ring-2 ring-offset-2 ring-zinc-900'
                              : 'hover:scale-105'
                          }`}
                        >
                          {color === c.hex && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Mascot Geometry & Face Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 mb-2">
                    Mascot Silhouette Shape (10 Styles)
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {MASCOT_SHAPES.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setShape(s.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border text-left transition-colors ${
                          shape === s.id
                            ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-blue-600 dark:border-blue-600'
                            : darkMode
                            ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                            : 'bg-white border-zinc-200/80 text-zinc-700 hover:bg-zinc-100'
                        }`}
                      >
                        <MascotAvatar
                          config={{ shape: s.id, color, expression, accessory }}
                          size={22}
                          interactive={false}
                        />
                        <span className="truncate">{s.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-500 mb-2">
                    Facial Features &amp; Gaze (8 Styles)
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {MASCOT_EXPRESSIONS.map((exp) => (
                      <button
                        key={exp.id}
                        type="button"
                        onClick={() => setExpression(exp.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border text-left transition-colors ${
                          expression === exp.id
                            ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-blue-600 dark:border-blue-600'
                            : darkMode
                            ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                            : 'bg-white border-zinc-200/80 text-zinc-700 hover:bg-zinc-100'
                        }`}
                      >
                        <MascotAvatar
                          config={{ shape, color, expression: exp.id, accessory }}
                          size={22}
                          interactive={false}
                        />
                        <span className="truncate">{exp.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Minimalist Accessories Selector */}
              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-2">
                  Minimalist Vector Accessories (8 Options)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {MASCOT_ACCESSORIES.map((acc) => (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => setAccessory(acc.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border text-left transition-colors ${
                        accessory === acc.id
                          ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-blue-600 dark:border-blue-600'
                          : darkMode
                          ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                          : 'bg-white border-zinc-200/80 text-zinc-700 hover:bg-zinc-100'
                      }`}
                    >
                      <MascotAvatar
                        config={{ shape, color, expression, accessory: acc.id }}
                        size={22}
                        interactive={false}
                      />
                      <span className="truncate">{acc.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Agent Name, Role, Provider & Instructions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="studio-agent-name" className="block text-xs font-semibold text-zinc-500 mb-1.5">
                    Agent Name
                  </label>
                  <input
                    id="studio-agent-name"
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setFormError(null);
                    }}
                    placeholder="e.g. Kairo, Nova, Zenith"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none ${
                      darkMode
                        ? 'bg-zinc-900 border-zinc-800 text-white'
                        : 'bg-white border-zinc-200 text-zinc-900'
                    }`}
                  />
                </div>

                <div>
                  <label htmlFor="studio-agent-role" className="block text-xs font-semibold text-zinc-500 mb-1.5">
                    Autonomous Role &amp; Specialty
                  </label>
                  <input
                    id="studio-agent-role"
                    type="text"
                    value={role}
                    onChange={(e) => {
                      setRole(e.target.value);
                      setFormError(null);
                    }}
                    placeholder="e.g. Distributed Tracing & Rust Profiler"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none ${
                      darkMode
                        ? 'bg-zinc-900 border-zinc-800 text-white'
                        : 'bg-white border-zinc-200 text-zinc-900'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="studio-agent-provider" className="block text-xs font-semibold text-zinc-500 mb-1.5">
                    AI Gateway Route
                  </label>
                  <select
                    id="studio-agent-provider"
                    value={providerId}
                    onChange={(e) => setProviderId(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none ${
                      darkMode
                        ? 'bg-zinc-900 border-zinc-800 text-white'
                        : 'bg-white border-zinc-200 text-zinc-900'
                    }`}
                  >
                    {providers.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.modelId})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="studio-wallet-cap" className="block text-xs font-semibold text-zinc-500 mb-1.5">
                    Scoped Wallet Cap (USD)
                  </label>
                  <input
                    id="studio-wallet-cap"
                    type="number"
                    value={walletLimit}
                    onChange={(e) => setWalletLimit(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-mono focus:outline-none ${
                      darkMode
                        ? 'bg-zinc-900 border-zinc-800 text-white'
                        : 'bg-white border-zinc-200 text-zinc-900'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="studio-instructions" className="block text-xs font-semibold text-zinc-500 mb-1.5">
                  System Identity &amp; Verification Instructions
                </label>
                <textarea
                  id="studio-instructions"
                  rows={2}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Specify operational boundaries, preferred tools, and reporting format..."
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none ${
                    darkMode
                      ? 'bg-zinc-900 border-zinc-800 text-white'
                      : 'bg-white border-zinc-200 text-zinc-900'
                  }`}
                />
              </div>

              {/* MCP Servers Assignment */}
              <div>
                <div className="text-xs font-semibold text-zinc-500 mb-2">
                  Attach MCP Tool Servers
                </div>
                <div className="flex flex-wrap gap-2">
                  {mcpServers.map((mcp) => {
                    const active = selectedMcpIds.includes(mcp.id);
                    return (
                      <button
                        key={mcp.id}
                        type="button"
                        onClick={() => toggleMcp(mcp.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-colors ${
                          active
                            ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-blue-600 dark:border-blue-600'
                            : darkMode
                            ? 'bg-zinc-900 border-zinc-800 text-zinc-400'
                            : 'bg-white border-zinc-200 text-zinc-600'
                        }`}
                      >
                        <Cpu className="w-3.5 h-3.5" />
                        <span>{mcp.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {formError && (
                <p role="alert" className="text-xs font-medium text-red-500">
                  {formError}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-zinc-900 dark:bg-blue-600 text-white font-semibold text-sm hover:opacity-95 transition-opacity"
              >
                {editingAgent ? `Save ${name || editingAgent.name} Mascot & Identity` : 'Provision Autonomous Agent'}
              </button>
            </form>
          )}

          {activeTab === 'scan' && (
            <div className="space-y-4">
              <div
                className={`rounded-2xl p-4 border flex items-center gap-4 ${
                  darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200/80'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                  <ScanLine className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">
                    Instant Spec &amp; QR Agent Spawner
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Select a detected manifest payload below to immediately provision a pre-configured specialist agent with its own sandbox and mascot.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {SCAN_PRESETS.map((preset) => (
                  <div
                    key={preset.id}
                    className={`rounded-2xl p-4 border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      darkMode ? 'bg-zinc-900/70 border-zinc-800' : 'bg-white border-zinc-200/80'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <MascotAvatar
                        config={{
                          shape: preset.shape,
                          color: preset.color,
                          expression: preset.expression,
                          accessory: preset.accessory,
                        }}
                        status="working"
                        size={52}
                        interactive={false}
                      />
                      <div>
                        <div className="text-sm font-semibold">
                          {preset.agentName} · {preset.title}
                        </div>
                        <div className="text-xs font-mono text-zinc-400 mt-0.5">
                          {preset.codePayload}
                        </div>
                        <p className="text-xs text-zinc-500 mt-1">{preset.instructions}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSpawnFromScan(preset)}
                      className="px-4 py-2.5 rounded-xl bg-zinc-900 dark:bg-blue-600 text-white text-xs font-semibold whitespace-nowrap shrink-0 hover:opacity-90"
                    >
                      Spawn {preset.agentName}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'group' && (
            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div>
                <label htmlFor="group-chat-name" className="block text-xs font-semibold text-zinc-500 mb-1.5">
                  Group Chat Title
                </label>
                <input
                  id="group-chat-name"
                  type="text"
                  value={groupName}
                  onChange={(e) => {
                    setGroupName(e.target.value);
                    setGroupError(null);
                  }}
                  placeholder="e.g. Release Verification Squad"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none ${
                    darkMode
                      ? 'bg-zinc-900 border-zinc-800 text-white'
                      : 'bg-white border-zinc-200 text-zinc-900'
                  }`}
                />
              </div>

              <div>
                <label htmlFor="group-chat-objective" className="block text-xs font-semibold text-zinc-500 mb-1.5">
                  Shared Mission Objective
                </label>
                <input
                  id="group-chat-objective"
                  type="text"
                  value={groupObjective}
                  onChange={(e) => setGroupObjective(e.target.value)}
                  placeholder="Coordinate checkpoint audit, security check, and edge claim link..."
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none ${
                    darkMode
                      ? 'bg-zinc-900 border-zinc-800 text-white'
                      : 'bg-white border-zinc-200 text-zinc-900'
                  }`}
                />
              </div>

              <div>
                <div className="text-xs font-semibold text-zinc-500 mb-2">
                  Select Participating Agents ({selectedMemberIds.length} selected)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {existingAgents.map((ag) => {
                    const checked = selectedMemberIds.includes(ag.id);
                    return (
                      <button
                        key={ag.id}
                        type="button"
                        onClick={() => toggleMember(ag.id)}
                        className={`flex items-center justify-between p-2.5 rounded-2xl border text-left transition-colors ${
                          checked
                            ? darkMode
                              ? 'bg-blue-950/50 border-blue-500'
                              : 'bg-zinc-900 text-white border-zinc-900'
                            : darkMode
                            ? 'bg-zinc-900 border-zinc-800 text-zinc-300'
                            : 'bg-white border-zinc-200 text-zinc-800'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <MascotAvatar
                            config={ag.mascot}
                            size={34}
                            interactive={false}
                          />
                          <div className="min-w-0">
                            <div className="text-sm font-semibold truncate">{ag.name}</div>
                            <div className="text-[11px] opacity-75 truncate">{ag.role}</div>
                          </div>
                        </div>
                        {checked && <Check className="w-4 h-4 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {groupError && (
                <p role="alert" className="text-xs font-medium text-red-500">
                  {groupError}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-zinc-900 dark:bg-blue-600 text-white font-semibold text-sm hover:opacity-95"
              >
                Launch Multi-Agent Group Chat
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
