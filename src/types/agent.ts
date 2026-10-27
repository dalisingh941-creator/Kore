export type MascotShape =
  | 'droplet'     // Rounded top, flat bottom-left (like Dora)
  | 'squircle'    // Rounded square (like coco)
  | 'star5'       // 5-point rounded star (like glimmi, argon, spark)
  | 'triangle'    // Soft rounded triangle (like vivi)
  | 'ghost'       // Bell / octopus ghost silhouette (like Otto)
  | 'burst8'      // 8-point scalloped badge/flower (like anu)
  | 'hexagon'     // Soft rounded hexagon
  | 'cloud'       // Puffy cloud silhouette
  | 'diamond'     // Soft rotated rhombus
  | 'capsule';    // Wide rounded pill creature

export type MascotExpression =
  | 'cheerful'    // Big round eyes + happy open mouth
  | 'skeptical'   // One big eye, one flat wink/line (like coco)
  | 'wink'        // One round eye, one '>' wink (like glimmi)
  | 'curious'     // Tall oval eyes close together (like vivi)
  | 'determined'  // Strong horizontal eyebrows + focused eyes (like argon)
  | 'calm'        // Wide gentle eyes + small curved smile (like Otto)
  | 'focused'     // Centered alert eyes + neutral mouth (like spark/anu)
  | 'analytical'; // Asymmetric scanning pupils + subtle smirk

export type MascotAccessory =
  | 'none'
  | 'glasses'   // Minimalist round frames
  | 'headset'   // Studio mic headset arc
  | 'antenna'   // Signal node antenna on top
  | 'halo'      // Floating geometric ring above head
  | 'crown'     // Minimalist 3-peak vector badge
  | 'visor'     // Sleek technical visor bar
  | 'bowtie';   // Clean geometric collar bow

export type MascotStatus = 'idle' | 'working' | 'thinking' | 'speaking';

export interface MascotConfig {
  shape: MascotShape;
  color: string;
  expression: MascotExpression;
  accessory?: MascotAccessory;
  eyeColor?: string;
}

export interface AgentFile {
  id: string;
  name: string;
  type: 'code' | 'notebook' | 'json' | 'markdown';
  size: string;
  updatedAt: string;
  content: string;
}

export interface AgentMailItem {
  id: string;
  from: string;
  subject: string;
  snippet: string;
  timestamp: string;
  unread: boolean;
}

export interface AgentCallLog {
  id: string;
  contact: string;
  number: string;
  duration: string;
  summary: string;
  timestamp: string;
  direction: 'inbound' | 'outbound';
}

export interface AgentTransaction {
  id: string;
  merchant: string;
  amountUsd: number;
  status: 'approved' | 'blocked' | 'pending';
  timestamp: string;
  purpose: string;
}

export interface AgentIdentity {
  email: string;
  mailInbox: AgentMailItem[];
  phone: string | null;
  phoneLogs: AgentCallLog[];
  walletCardLast4: string | null;
  walletLimitUsd: number;
  walletSpentUsd: number;
  transactions: AgentTransaction[];
  computerName: string;
  computerTier: 'Free' | 'Pro' | 'Dedicated GPU';
  computerOs: string;
  computerActiveApp: string;
  computerActiveFile: string;
  computerCodePreview: string;
  computerTerminalLogs: string[];
}

export interface ChatMessage {
  id: string;
  senderId: 'user' | string; // 'user' or agent.id
  senderName: string;
  text: string;
  timestamp: string;
  statusStep?: string;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  mascot: MascotConfig;
  status: MascotStatus;
  statusText?: string;
  lastMessageTime: string;
  providerId: string;
  modelId: string;
  instructions: string;
  memoryItems: string[];
  connectedApps: string[];
  enabledSkills: string[];
  enabledMcpIds: string[];
  messengerChannel: string;
  identity: AgentIdentity;
  files: AgentFile[];
  messages: ChatMessage[];
}

export interface GroupChat {
  id: string;
  name: string;
  pinned: boolean;
  memberAgentIds: string[];
  lastMessageTime: string;
  objective: string;
  messages: ChatMessage[];
}

export interface ProviderProfile {
  id: string;
  name: string;
  vendor: string;
  modelId: string;
  endpointType: 'builtin-gemini' | 'openai-compatible' | 'anthropic-bridge' | 'openrouter';
  baseUrl: string;
  authMode: string;
  status: 'connected' | 'standby';
  latencyMs: number;
  description: string;
}

export interface MCPServer {
  id: string;
  name: string;
  transport: 'stdio' | 'sse' | 'http';
  endpoint: string;
  enabled: boolean;
  toolsCount: number;
  tools: string[];
  description: string;
}

export interface SkillDefinition {
  id: string;
  name: string;
  category: string;
  description: string;
  enabledByDefault: boolean;
}

export interface AppIntegration {
  id: string;
  name: string;
  category: string;
  connected: boolean;
  accountLabel: string;
  description: string;
}
