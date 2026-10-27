import {
  Agent,
  GroupChat,
  MascotAccessory,
  MascotConfig,
  MascotExpression,
  MascotShape,
  MCPServer,
} from '../types/agent';

export const MASCOT_COLORS: { name: string; hex: string }[] = [
  { name: 'Cobalt Blue', hex: '#2B8EFF' },
  { name: 'Warm Cocoa', hex: '#9A6B43' },
  { name: 'Solar Gold', hex: '#FFC700' },
  { name: 'Coral Red', hex: '#FF5A5F' },
  { name: 'Crimson Star', hex: '#FA4B4B' },
  { name: 'Slate Mist', hex: '#8C8C8C' },
  { name: 'Amber Bronze', hex: '#A6733E' },
  { name: 'Sky Azure', hex: '#3097FF' },
  { name: 'Emerald Mint', hex: '#10B981' },
  { name: 'Iris Violet', hex: '#8B5CF6' },
  { name: 'Rose Quartz', hex: '#F43F5E' },
  { name: 'Deep Indigo', hex: '#4F46E5' },
];

export const MASCOT_SHAPES: { id: MascotShape; label: string }[] = [
  { id: 'droplet', label: 'Droplet' },
  { id: 'squircle', label: 'Squircle' },
  { id: 'star5', label: 'Five Star' },
  { id: 'triangle', label: 'Delta' },
  { id: 'ghost', label: 'Phantom' },
  { id: 'burst8', label: 'Octa Burst' },
  { id: 'hexagon', label: 'Hexa Core' },
  { id: 'cloud', label: 'Nimbus' },
  { id: 'diamond', label: 'Prism' },
  { id: 'capsule', label: 'Bean' },
];

export const MASCOT_EXPRESSIONS: { id: MascotExpression; label: string }[] = [
  { id: 'cheerful', label: 'Cheerful' },
  { id: 'skeptical', label: 'Skeptical' },
  { id: 'wink', label: 'Wink' },
  { id: 'curious', label: 'Curious' },
  { id: 'determined', label: 'Determined' },
  { id: 'calm', label: 'Calm' },
  { id: 'focused', label: 'Focused' },
  { id: 'analytical', label: 'Analytical' },
];

export const MASCOT_ACCESSORIES: { id: MascotAccessory; label: string }[] = [
  { id: 'none', label: 'None' },
  { id: 'glasses', label: 'Optic Frames' },
  { id: 'headset', label: 'Comms Headset' },
  { id: 'antenna', label: 'Signal Node' },
  { id: 'halo', label: 'Orbit Ring' },
  { id: 'crown', label: 'Vector Crest' },
  { id: 'visor', label: 'Tech Visor' },
  { id: 'bowtie', label: 'Collar Bow' },
];

export interface CreateAgentInput {
  name: string;
  role: string;
  instructions?: string;
  mascot: MascotConfig;
  providerId?: string;
  modelId?: string;
  walletLimitUsd?: number;
  enabledSkills?: string[];
  enabledMcpIds?: string[];
}

export function validateCreateAgentInput(input: CreateAgentInput): {
  valid: boolean;
  error?: string;
} {
  const trimmedName = input.name.trim();
  if (!trimmedName) {
    return { valid: false, error: 'Agent name is required.' };
  }
  if (trimmedName.length < 2 || trimmedName.length > 24) {
    return { valid: false, error: 'Agent name must be between 2 and 24 characters.' };
  }
  const trimmedRole = input.role.trim();
  if (!trimmedRole) {
    return { valid: false, error: 'Agent specialty or role is required.' };
  }
  if (!input.mascot || !input.mascot.shape || !input.mascot.color || !input.mascot.expression) {
    return { valid: false, error: 'Mascot shape, color, and expression must be selected.' };
  }
  return { valid: true };
}

export function buildNewAgent(input: CreateAgentInput, idSuffix?: string): Agent {
  const cleanName = input.name.trim();
  const slug = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'agent';
  const id = `agent-${slug}-${idSuffix || Date.now().toString(36)}`;

  return {
    id,
    name: cleanName,
    role: input.role.trim(),
    mascot: {
      shape: input.mascot.shape,
      color: input.mascot.color,
      expression: input.mascot.expression,
      accessory: input.mascot.accessory || 'none',
    },
    status: 'idle',
    lastMessageTime: 'Just now',
    providerId: input.providerId || 'builtin-gemini',
    modelId: input.modelId || 'gemini-3.8-flash',
    instructions:
      input.instructions?.trim() ||
      `You are ${cleanName}, an autonomous specialist focused on ${input.role.trim()}. Provide concise, rigorous technical updates and execute tasks deterministically.`,
    memoryItems: [
      `Primary domain: ${input.role.trim()}`,
      'Prefers direct verification before marking checkpoints complete',
    ],
    connectedApps: ['GitHub', 'Notion', 'Jupyter Cloud'],
    enabledSkills: input.enabledSkills?.length
      ? input.enabledSkills
      : ['Code Execution', 'Browser Sandbox', 'Artifact Inspection'],
    enabledMcpIds: input.enabledMcpIds?.length ? input.enabledMcpIds : ['mcp-fs', 'mcp-github'],
    messengerChannel: 'None',
    identity: {
      email: `${slug}@kore.workspace`,
      mailInbox: [
        {
          id: `mail-${id}-1`,
          from: 'orchestrator@kore.workspace',
          subject: `Sandbox provisioned for ${cleanName}`,
          snippet: `Dedicated Linux container and identity keys initialized for ${cleanName}.`,
          timestamp: 'Just now',
          unread: true,
        },
      ],
      phone: '+1 (415) 890-4412',
      phoneLogs: [],
      walletCardLast4: '8842',
      walletLimitUsd: typeof input.walletLimitUsd === 'number' ? input.walletLimitUsd : 50,
      walletSpentUsd: 0,
      transactions: [],
      computerName: `${cleanName}'s computer`,
      computerTier: 'Free',
      computerOs: 'Ubuntu 24.04 LTS (Cloud Sandbox)',
      computerActiveApp: 'Workspace Terminal & Code',
      computerActiveFile: 'agent_config.json',
      computerCodePreview: `{\n  "agent": "${cleanName}",\n  "role": "${input.role.trim()}",\n  "sandbox": "isolated-vm-v2",\n  "status": "ready"\n}`,
      computerTerminalLogs: [
        `$ kore-sandbox init --agent="${slug}"`,
        `[ok] Mounted workspace volume /home/${slug}/workspace`,
        `[ok] MCP bridge connected (${(input.enabledMcpIds || ['mcp-fs', 'mcp-github']).length} active servers)`,
      ],
    },
    files: [
      {
        id: `file-${id}-1`,
        name: 'agent_config.json',
        type: 'json',
        size: '1.2 KB',
        updatedAt: 'Just now',
        content: `{\n  "name": "${cleanName}",\n  "role": "${input.role.trim()}",\n  "model": "${input.modelId || 'gemini-3.8-flash'}",\n  "autonomous": true\n}`,
      },
      {
        id: `file-${id}-2`,
        name: 'runbook.md',
        type: 'markdown',
        size: '2.4 KB',
        updatedAt: 'Just now',
        content: `# ${cleanName} Operational Runbook\n\nRole: ${input.role.trim()}\n\n## Verification Protocol\n1. Inspect inputs and environment invariants.\n2. Execute isolated diagnostic checks.\n3. Record structured audit logs before committing state.`,
      },
    ],
    messages: [
      {
        id: `msg-${id}-init`,
        senderId: id,
        senderName: cleanName,
        text: `Sandbox environment initialized for ${input.role.trim()}. Ready to inspect tasks, run diagnostics, or coordinate in group chat.`,
        timestamp: 'Just now',
      },
    ],
  };
}

export function filterConversations(
  agents: Agent[],
  groupChats: GroupChat[],
  query: string
): { agents: Agent[]; groupChats: GroupChat[] } {
  const q = query.trim().toLowerCase();
  if (!q) {
    return { agents, groupChats };
  }
  const filteredAgents = agents.filter((a) => {
    const lastMsg = a.messages[a.messages.length - 1]?.text || '';
    return (
      a.name.toLowerCase().includes(q) ||
      a.role.toLowerCase().includes(q) ||
      lastMsg.toLowerCase().includes(q)
    );
  });
  const filteredGroups = groupChats.filter((g) => {
    const lastMsg = g.messages[g.messages.length - 1]?.text || '';
    return (
      g.name.toLowerCase().includes(q) ||
      g.objective.toLowerCase().includes(q) ||
      lastMsg.toLowerCase().includes(q)
    );
  });
  return { agents: filteredAgents, groupChats: filteredGroups };
}

export function selectGroupResponders(
  allAgents: Agent[],
  memberIds: string[],
  prompt: string,
  maxResponders = 2
): Agent[] {
  const members = allAgents.filter((a) => memberIds.includes(a.id));
  if (members.length === 0) return [];

  const lowerPrompt = prompt.toLowerCase();
  const scored = members.map((agent, idx) => {
    let score = 0;
    if (lowerPrompt.includes(agent.name.toLowerCase())) {
      score += 10;
    }
    const roleWords = agent.role
      .toLowerCase()
      .split(/\W+/)
      .filter((w) => w.length > 3);
    for (const word of roleWords) {
      if (lowerPrompt.includes(word)) {
        score += 3;
      }
    }
    // Deterministic tie-breaker preserving roster order
    return { agent, score, idx };
  });

  scored.sort((a, b) => (b.score !== a.score ? b.score - a.score : a.idx - b.idx));
  return scored.slice(0, Math.max(1, Math.min(maxResponders, members.length))).map((s) => s.agent);
}

export function validateMcpServerInput(
  name: string,
  endpoint: string
): { valid: boolean; error?: string } {
  if (!name.trim()) {
    return { valid: false, error: 'MCP server name is required.' };
  }
  if (!endpoint.trim()) {
    return { valid: false, error: 'MCP command or endpoint URI is required.' };
  }
  return { valid: true };
}

export function createMcpServerEntry(
  name: string,
  transport: 'stdio' | 'sse' | 'http',
  endpoint: string,
  toolsRaw: string
): MCPServer {
  const tools = toolsRaw
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
  return {
    id: `mcp-${Date.now().toString(36)}`,
    name: name.trim(),
    transport,
    endpoint: endpoint.trim(),
    enabled: true,
    toolsCount: tools.length || 3,
    tools: tools.length ? tools : ['read_resource', 'execute_tool', 'list_schemas'],
    description: `Custom ${transport.toUpperCase()} MCP server connected to ${endpoint.trim()}`,
  };
}
