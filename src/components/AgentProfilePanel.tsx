import React, { useState } from 'react';
import {
  ChevronLeft,
  MoreHorizontal,
  Monitor,
  Mail,
  Smartphone,
  CreditCard,
  Box,
  FileText,
  Cpu,
  MessageCircle,
  ChevronRight,
  Code2,
  FileSpreadsheet,
  Plus,
  Send,
  Check,
  MousePointerClick,
} from 'lucide-react';
import { Agent, AgentFile } from '../types/agent';
import { MascotAvatar } from './MascotAvatar';

interface AgentProfilePanelProps {
  agent: Agent;
  onClose: () => void;
  onEnterDesktop: (initialFile?: AgentFile) => void;
  onUpdateAgent: (updated: Agent) => void;
  onCustomizeMascot?: () => void;
}

type ActiveIdentitySubModal =
  | null
  | 'mail'
  | 'phone'
  | 'payment'
  | 'apps'
  | 'instructions'
  | 'memory'
  | 'messengers';

export const AgentProfilePanel: React.FC<AgentProfilePanelProps> = ({
  agent,
  onClose,
  onEnterDesktop,
  onUpdateAgent,
  onCustomizeMascot,
}) => {
  const [subModal, setSubModal] = useState<ActiveIdentitySubModal>(null);
  const [instructionDraft, setInstructionDraft] = useState(agent.instructions);
  const [newMemoryItem, setNewMemoryItem] = useState('');
  const [budgetDraft, setBudgetDraft] = useState(agent.identity.walletLimitUsd.toString());
  const [showAllFiles, setShowAllFiles] = useState(false);

  const visibleFiles = showAllFiles ? agent.files : agent.files.slice(0, 3);

  const handleSaveInstructions = () => {
    onUpdateAgent({
      ...agent,
      instructions: instructionDraft.trim() || agent.instructions,
    });
    setSubModal(null);
  };

  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemoryItem.trim()) return;
    onUpdateAgent({
      ...agent,
      memoryItems: [...agent.memoryItems, newMemoryItem.trim()],
    });
    setNewMemoryItem('');
  };

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(budgetDraft);
    if (isNaN(parsed) || parsed < 0) return;
    onUpdateAgent({
      ...agent,
      identity: {
        ...agent.identity,
        walletLimitUsd: parsed,
      },
    });
    setSubModal(null);
  };

  return (
    <aside
      aria-label={`${agent.name} Profile and Sandbox Environment`}
      className="flex flex-col h-full w-full bg-[#1E1E1E] text-zinc-100 select-none overflow-y-auto"
    >
      {/* Top Bar matching Screenshot 6 */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2 shrink-0">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close agent profile"
          className="w-11 h-11 rounded-full bg-[#2C2C2E] hover:bg-[#3A3A3C] flex items-center justify-center text-zinc-200 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
        </button>

        <button
          type="button"
          onClick={() => (onCustomizeMascot ? onCustomizeMascot() : setSubModal('instructions'))}
          aria-label="Customize Mascot in Studio"
          className="w-11 h-11 rounded-full bg-[#2C2C2E] hover:bg-[#3A3A3C] flex items-center justify-center text-zinc-200 transition-colors"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Centered Large Animated Mascot + Name matching Screenshot 6 */}
      <div className="flex flex-col items-center pt-1 pb-5 px-4">
        <div
          onClick={onCustomizeMascot}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && onCustomizeMascot) onCustomizeMascot();
          }}
          aria-label={`Customize ${agent.name} mascot`}
          className="cursor-pointer"
        >
          <MascotAvatar
            config={agent.mascot}
            status={agent.status}
            size={84}
            interactive={true}
          />
        </div>
        <h2 className="mt-2.5 text-[24px] font-semibold tracking-tight text-white">
          {agent.name}
        </h2>
      </div>

      <div className="px-4 pb-10 space-y-5">
        {/* Computer Header Row matching Screenshot 6 ("Nori's comp... Free ...") */}
        <div>
          <div className="flex items-center justify-between mb-2.5 px-1">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-[16px] text-zinc-400 truncate">
                {agent.identity.computerName}
              </span>
              <span className="text-xs font-medium text-[#47A3FF] bg-[#1E2F42] px-2.5 py-0.5 rounded-md shrink-0">
                {agent.identity.computerTier}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onEnterDesktop()}
              aria-label="Inspect computer options"
              className="text-zinc-400 hover:text-zinc-200 p-1"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          {/* Interactive Live Cloud Desktop Thumbnail Card matching Screenshot 6 */}
          <div className="relative rounded-[24px] overflow-hidden border border-zinc-700/70 bg-white text-zinc-900 shadow-lg">
            {/* Simulated Browser / Workspace Header */}
            <div className="bg-[#EEF2F6] px-3 py-1.5 border-b border-zinc-200 flex items-center justify-between text-[10px] text-zinc-600 font-mono">
              <span className="truncate">
                {agent.identity.computerActiveApp}
              </span>
              <span className="shrink-0 text-emerald-700 font-semibold">
                Cloud VM
              </span>
            </div>

            {/* Split IDE Preview inside the card */}
            <div className="grid grid-cols-12 h-44 text-[9.5px] font-mono leading-tight bg-white">
              <div className="col-span-4 border-r border-zinc-200 p-2 space-y-1 text-zinc-600 bg-zinc-50/60 overflow-hidden">
                <div className="font-semibold text-zinc-800 mb-1">Files</div>
                <div className="truncate">▸ workspace</div>
                {agent.files.slice(0, 4).map((f) => (
                  <div key={f.id} className="truncate text-blue-700">
                    {f.name}
                  </div>
                ))}
              </div>
              <div className="col-span-8 p-2.5 overflow-hidden bg-white text-zinc-800">
                <pre className="text-[8.5px] leading-[1.35] whitespace-pre-wrap text-emerald-900">
                  {agent.identity.computerCodePreview}
                </pre>
              </div>
            </div>

            {/* Top-left translucent pill: "Nori is using" */}
            <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-zinc-900/65 backdrop-blur-md text-white text-xs font-medium flex items-center gap-1.5">
              <MousePointerClick className="w-3.5 h-3.5 text-zinc-200" />
              <span>{agent.name} is using</span>
            </div>

            {/* Bottom-center glassmorphic pill button: "Enter desktop >" */}
            <div className="absolute inset-x-0 bottom-3 flex justify-center">
              <button
                type="button"
                onClick={() => onEnterDesktop()}
                className="px-5 py-2 rounded-full bg-zinc-800/75 hover:bg-zinc-900/90 backdrop-blur-md text-white text-[14.5px] font-medium flex items-center gap-1.5 shadow-md transition-all"
              >
                <span>Enter desktop</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* "View cloud and local computer" Button matching Screenshot 6 & 7 */}
          <button
            type="button"
            onClick={() => onEnterDesktop()}
            className="mt-3 w-full py-3.5 px-4 rounded-full bg-[#2B2B2E] hover:bg-[#343438] text-zinc-100 text-[15px] font-medium flex items-center justify-center gap-2.5 transition-colors"
          >
            <Monitor className="w-4 h-4 text-zinc-300" />
            <span>View cloud and local computer</span>
          </button>
        </div>

        {/* 3-Column Identity Cards: Mail, Phone, Payment matching Screenshot 6 & 7 */}
        <div className="grid grid-cols-3 gap-2.5">
          <button
            type="button"
            onClick={() => setSubModal('mail')}
            className="flex flex-col items-center justify-center py-4 px-2 rounded-[22px] bg-[#2B2B2E] hover:bg-[#343438] transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center mb-2">
              <Mail className="w-5 h-5" />
            </div>
            <span className="text-[14px] font-medium text-zinc-100">Mail</span>
          </button>

          <button
            type="button"
            onClick={() => setSubModal('phone')}
            className="flex flex-col items-center justify-center py-4 px-2 rounded-[22px] border border-dashed border-zinc-700 hover:bg-[#2B2B2E]/60 transition-colors"
          >
            <div className="relative w-9 h-9 rounded-xl bg-zinc-800 text-zinc-300 flex items-center justify-center mb-2">
              <Smartphone className="w-5 h-5" />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#2B8EFF] text-white flex items-center justify-center">
                <Plus className="w-3 h-3 stroke-[3]" />
              </span>
            </div>
            <span className="text-[14px] font-medium text-zinc-100">Phone</span>
          </button>

          <button
            type="button"
            onClick={() => setSubModal('payment')}
            className="flex flex-col items-center justify-center py-4 px-2 rounded-[22px] border border-dashed border-zinc-700 hover:bg-[#2B2B2E]/60 transition-colors"
          >
            <div className="relative w-9 h-9 rounded-xl bg-zinc-800 text-zinc-300 flex items-center justify-center mb-2">
              <CreditCard className="w-5 h-5" />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#2B8EFF] text-white flex items-center justify-center">
                <Plus className="w-3 h-3 stroke-[3]" />
              </span>
            </div>
            <span className="text-[14px] font-medium text-zinc-100">Payment</span>
          </button>
        </div>

        {/* Inline Identity Sub-Drawer when Mail, Phone, Payment, Instructions, etc. is selected */}
        {subModal && (
          <div className="rounded-2xl bg-[#2B2B2E] border border-zinc-700/80 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-zinc-200">
                {subModal === 'mail' && `${agent.name} Email Inbox`}
                {subModal === 'phone' && `${agent.name} Phone & Call Logs`}
                {subModal === 'payment' && `${agent.name} Wallet & Budget`}
                {subModal === 'apps' && 'Connected Apps'}
                {subModal === 'instructions' && 'Agent Instructions'}
                {subModal === 'memory' && 'Saved Memory'}
                {subModal === 'messengers' && 'Messengers'}
              </h4>
              <button
                type="button"
                onClick={() => setSubModal(null)}
                className="text-xs text-zinc-400 hover:text-white"
              >
                Close
              </button>
            </div>

            {subModal === 'mail' && (
              <div className="space-y-2 text-xs">
                <div className="font-mono text-sky-400">{agent.identity.email}</div>
                {agent.identity.mailInbox.length === 0 ? (
                  <p className="text-zinc-400">No emails yet. Ask {agent.name} to send an email in chat.</p>
                ) : (
                  agent.identity.mailInbox.map((m) => (
                    <div key={m.id} className="p-2.5 rounded-xl bg-zinc-900/80 space-y-1">
                      <div className="flex justify-between text-zinc-200 font-medium">
                        <span>{m.subject}</span>
                        <span className="font-mono text-[11px] text-zinc-500">{m.timestamp}</span>
                      </div>
                      <p className="text-zinc-400">{m.snippet}</p>
                    </div>
                  ))
                )}
              </div>
            )}

            {subModal === 'phone' && (
              <div className="space-y-2 text-xs">
                <div className="font-mono text-emerald-400">
                  {agent.identity.phone || '+1 (415) 602-9000'}
                </div>
                {agent.identity.phoneLogs.length === 0 ? (
                  <p className="text-zinc-400">
                    No calls logged yet. Ask {agent.name} to schedule or make a call.
                  </p>
                ) : (
                  agent.identity.phoneLogs.map((c) => (
                    <div key={c.id} className="p-2.5 rounded-xl bg-zinc-900/80 space-y-1">
                      <div className="flex justify-between font-medium text-zinc-200">
                        <span>{c.contact}</span>
                        <span className="font-mono text-zinc-400">{c.duration}</span>
                      </div>
                      <p className="text-zinc-400">{c.summary}</p>
                    </div>
                  ))
                )}
              </div>
            )}

            {subModal === 'payment' && (
              <div className="space-y-2.5 text-xs">
                <form onSubmit={handleSaveBudget} className="space-y-2">
                  <div className="flex justify-between text-zinc-300">
                    <span>Spent / Limit:</span>
                    <span className="font-mono">
                      ${agent.identity.walletSpentUsd.toFixed(2)} / $
                      {agent.identity.walletLimitUsd.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <label htmlFor="agent-budget-input" className="text-zinc-400 shrink-0">
                      Limit ($):
                    </label>
                    <input
                      id="agent-budget-input"
                      type="number"
                      value={budgetDraft}
                      onChange={(e) => setBudgetDraft(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-white font-mono"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-lg bg-[#2B8EFF] text-white font-medium shrink-0"
                    >
                      Save
                    </button>
                  </div>
                </form>
                {agent.identity.transactions.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-zinc-800">
                    {agent.identity.transactions.map((tx) => (
                      <div key={tx.id} className="p-2 rounded-lg bg-zinc-900/80 flex justify-between">
                        <span className="truncate">{tx.purpose}</span>
                        <span className="font-mono text-emerald-400 shrink-0">
                          ${tx.amountUsd.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {subModal === 'instructions' && (
              <div className="space-y-2.5">
                <textarea
                  rows={3}
                  value={instructionDraft}
                  onChange={(e) => setInstructionDraft(e.target.value)}
                  aria-label="System instructions"
                  className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-zinc-100 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleSaveInstructions}
                  className="w-full py-2 rounded-xl bg-[#2B8EFF] text-white text-xs font-medium flex items-center justify-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Instructions</span>
                </button>
              </div>
            )}

            {subModal === 'memory' && (
              <div className="space-y-2.5 text-xs">
                <ul className="space-y-1.5">
                  {agent.memoryItems.map((item, i) => (
                    <li key={i} className="p-2 rounded-lg bg-zinc-900/80 text-zinc-300">
                      {item}
                    </li>
                  ))}
                </ul>
                <form onSubmit={handleAddMemory} className="flex gap-1.5">
                  <input
                    type="text"
                    value={newMemoryItem}
                    onChange={(e) => setNewMemoryItem(e.target.value)}
                    placeholder="Add memory note..."
                    aria-label="New memory note"
                    className="flex-1 px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-white"
                  />
                  <button
                    type="submit"
                    aria-label="Save memory note"
                    className="px-3 py-1.5 rounded-lg bg-[#2B8EFF] text-white font-medium"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            )}

            {subModal === 'apps' && (
              <div className="flex flex-wrap gap-1.5">
                {agent.connectedApps.map((app) => (
                  <span
                    key={app}
                    className="px-2.5 py-1 rounded-lg bg-zinc-900 text-xs text-zinc-200"
                  >
                    {app}
                  </span>
                ))}
              </div>
            )}

            {subModal === 'messengers' && (
              <div className="space-y-2 text-xs text-zinc-300">
                <div className="flex flex-wrap gap-2">
                  {['None', 'Telegram', 'Slack', 'WhatsApp Bridge'].map((ch) => (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => {
                        onUpdateAgent({ ...agent, messengerChannel: ch });
                        setSubModal(null);
                      }}
                      className={`px-2.5 py-1 rounded-lg border ${
                        agent.messengerChannel === ch
                          ? 'bg-[#2B8EFF] border-[#2B8EFF] text-white'
                          : 'border-zinc-700 text-zinc-400'
                      }`}
                    >
                      {ch}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Configuration Section matching Screenshot 6 & 7 */}
        <div>
          <h3 className="text-[14px] text-zinc-400 font-normal px-1 mb-1.5">
            Configuration
          </h3>
          <div className="divide-y divide-zinc-800/90">
            <button
              type="button"
              onClick={() => setSubModal('apps')}
              className="w-full flex items-center justify-between py-3.5 px-1 text-left hover:opacity-80 transition-opacity"
            >
              <div className="flex items-center gap-3.5">
                <Box className="w-5 h-5 text-zinc-300" />
                <span className="text-[16px] text-zinc-100">Apps</span>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-500" />
            </button>

            <button
              type="button"
              onClick={() => setSubModal('instructions')}
              className="w-full flex items-center justify-between py-3.5 px-1 text-left hover:opacity-80 transition-opacity"
            >
              <div className="flex items-center gap-3.5">
                <FileText className="w-5 h-5 text-zinc-300" />
                <span className="text-[16px] text-zinc-100">Instructions</span>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-500" />
            </button>

            <button
              type="button"
              onClick={() => setSubModal('memory')}
              className="w-full flex items-center justify-between py-3.5 px-1 text-left hover:opacity-80 transition-opacity"
            >
              <div className="flex items-center gap-3.5">
                <Cpu className="w-5 h-5 text-zinc-300" />
                <span className="text-[16px] text-zinc-100">Memory</span>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-500" />
            </button>

            <button
              type="button"
              onClick={() => setSubModal('messengers')}
              className="w-full flex items-center justify-between py-3.5 px-1 text-left hover:opacity-80 transition-opacity"
            >
              <div className="flex items-center gap-3.5">
                <MessageCircle className="w-5 h-5 text-zinc-300" />
                <span className="text-[16px] text-zinc-100">Messengers</span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-400 text-[15px]">
                <span>{agent.messengerChannel}</span>
                <ChevronRight className="w-4 h-4 text-zinc-500" />
              </div>
            </button>
          </div>
        </div>

        {/* Files Section matching Screenshot 7 */}
        <div>
          <h3 className="text-[14px] text-zinc-400 font-normal px-1 mb-1.5">
            Files
          </h3>
          <div className="divide-y divide-zinc-800/90">
            {visibleFiles.map((file) => (
              <button
                key={file.id}
                type="button"
                onClick={() => onEnterDesktop(file)}
                className="w-full flex items-center justify-between py-3.5 px-1 text-left hover:opacity-80 transition-opacity"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {file.type === 'json' || file.type === 'code' ? (
                    <div className="w-5 h-5 rounded bg-[#2B8EFF] text-white flex items-center justify-center shrink-0">
                      <Code2 className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded bg-zinc-600 text-zinc-100 flex items-center justify-center shrink-0">
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <span className="text-[16px] text-zinc-100 truncate">
                    {file.name}
                  </span>
                </div>
                <span className="text-xs font-mono text-zinc-500 shrink-0">
                  {file.size}
                </span>
              </button>
            ))}

            <button
              type="button"
              onClick={() => setShowAllFiles((prev) => !prev)}
              className="w-full flex items-center gap-3.5 py-3.5 px-1 text-left text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              <MoreHorizontal className="w-5 h-5" />
              <span className="text-[16px]">
                {showAllFiles ? 'Show fewer files' : 'View all files'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
