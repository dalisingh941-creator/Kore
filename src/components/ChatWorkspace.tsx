import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Mic,
  ArrowUp,
  SquareTerminal,
  Globe,
  Mail,
  FileText,
  Smartphone,
  CreditCard,
  X,
} from 'lucide-react';
import { Agent, ChatMessage, GroupChat, MascotStatus } from '../types/agent';
import { AGENT_WORKFLOW_TEMPLATES } from '../data/initialAgents';
import { MascotAvatar, GroupMascotCluster } from './MascotAvatar';

interface ChatWorkspaceProps {
  mode: 'agent' | 'group';
  agent?: Agent;
  group?: GroupChat;
  allAgents: Agent[];
  isSending: boolean;
  liveStepText?: string;
  onSendMessage: (prompt: string) => void;
  onOpenProfile: () => void;
  onOpenDesktop: () => void;
  onBackToList: () => void;
  darkMode: boolean;
}

export const ChatWorkspace: React.FC<ChatWorkspaceProps> = ({
  mode,
  agent,
  group,
  allAgents,
  isSending,
  liveStepText,
  onSendMessage,
  onOpenProfile,
  onOpenDesktop,
  onBackToList,
  darkMode,
}) => {
  const [inputText, setInputText] = useState('');
  const [workflowsOpen, setWorkflowsOpen] = useState(false);
  const [voiceRecording, setVoiceRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messages: ChatMessage[] =
    mode === 'agent' ? agent?.messages || [] : group?.messages || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, isSending, liveStepText]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed || isSending) return;
    setInputText('');
    setWorkflowsOpen(false);
    onSendMessage(trimmed);
  };

  const handleVoiceSimulate = () => {
    if (voiceRecording) {
      setVoiceRecording(false);
      const targetName = mode === 'agent' ? agent?.name || 'Agent' : 'team';
      setInputText(
        `${targetName}, mere project ka ek clean summary note bana kar Files mein save kar do.`
      );
    } else {
      setVoiceRecording(true);
    }
  };

  const activeStatus: MascotStatus = isSending
    ? 'working'
    : agent?.status || 'working';

  const groupMemberMascots =
    mode === 'group' && group
      ? (group.memberAgentIds
          .map((id) => allAgents.find((a) => a.id === id)?.mascot)
          .filter(Boolean) as Agent['mascot'][])
      : [];

  const getWorkflowIcon = (id: string) => {
    switch (id) {
      case 'wf-website':
        return <Globe className="w-4 h-4 text-blue-500" />;
      case 'wf-email':
        return <Mail className="w-4 h-4 text-emerald-500" />;
      case 'wf-call':
        return <Smartphone className="w-4 h-4 text-purple-500" />;
      case 'wf-budget':
        return <CreditCard className="w-4 h-4 text-amber-500" />;
      default:
        return <FileText className="w-4 h-4 text-rose-500" />;
    }
  };

  return (
    <section
      aria-label="Conversation Workspace"
      className={`relative flex flex-col h-full w-full transition-colors ${
        darkMode ? 'bg-[#141416] text-zinc-100' : 'bg-[#FAF9F7] text-zinc-900'
      }`}
    >
      {/* Top Floating Header Bar matching Screenshot 3 */}
      <header className="sticky top-0 z-20 flex items-start justify-between px-4 pt-3 pb-2">
        <button
          type="button"
          onClick={onBackToList}
          aria-label="Back to agent list"
          className={`w-11 h-11 rounded-full flex items-center justify-center shadow-xs transition-colors ${
            darkMode
              ? 'bg-zinc-800/90 text-zinc-100 hover:bg-zinc-700'
              : 'bg-white text-zinc-800 hover:bg-zinc-50 border border-zinc-200/60'
          }`}
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
        </button>

        {/* Center Mascot + Name Pill matching Screenshot 3 ("Nori >") */}
        {mode === 'agent' && agent && (
          <div className="flex flex-col items-center -mt-0.5">
            <MascotAvatar
              config={agent.mascot}
              status={activeStatus}
              size={52}
              interactive={true}
            />
            <button
              type="button"
              onClick={onOpenProfile}
              aria-label={`Open ${agent.name} profile and computer`}
              className={`-mt-2 px-3.5 py-1 rounded-full flex items-center gap-1 shadow-xs border text-[15px] font-medium transition-all ${
                darkMode
                  ? 'bg-zinc-800/95 border-zinc-700 text-zinc-100 hover:bg-zinc-700'
                  : 'bg-white border-zinc-200/80 text-zinc-900 hover:bg-zinc-50'
              }`}
            >
              <span>{agent.name}</span>
              <ChevronRight className="w-4 h-4 text-zinc-400 stroke-[2.2]" />
            </button>
          </div>
        )}

        {mode === 'group' && group && (
          <div className="flex flex-col items-center -mt-0.5">
            <GroupMascotCluster mascots={groupMemberMascots} size={48} />
            <div
              className={`-mt-1.5 px-3.5 py-1 rounded-full flex items-center gap-1.5 shadow-xs border text-[14px] font-medium ${
                darkMode
                  ? 'bg-zinc-800/95 border-zinc-700 text-zinc-100'
                  : 'bg-white border-zinc-200/80 text-zinc-900'
              }`}
            >
              <span>{group.name}</span>
            </div>
          </div>
        )}

        {/* Top-right Computer Window Icon Button matching Screenshot 3 */}
        <button
          type="button"
          onClick={onOpenDesktop}
          aria-label="Open Cloud Sandbox Computer"
          className={`w-11 h-11 rounded-full flex items-center justify-center shadow-xs transition-colors ${
            darkMode
              ? 'bg-zinc-800/90 text-zinc-100 hover:bg-zinc-700'
              : 'bg-white text-zinc-800 hover:bg-zinc-50 border border-zinc-200/60'
          }`}
        >
          <SquareTerminal className="w-5 h-5 stroke-[2]" />
        </button>
      </header>

      {/* Scrollable Message Cards Area matching Screenshot 3 */}
      <div className="flex-1 overflow-y-auto px-4 pt-2 pb-4 space-y-3">
        {messages.map((msg) => {
          const isUser = msg.senderId === 'user';
          const msgAgent = !isUser
            ? allAgents.find((a) => a.id === msg.senderId) || agent
            : undefined;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              {mode === 'group' && !isUser && msgAgent && (
                <div className="flex items-center gap-2 mb-1 pl-1">
                  <MascotAvatar
                    config={msgAgent.mascot}
                    status="idle"
                    size={22}
                    interactive={false}
                  />
                  <span className="text-xs font-medium text-zinc-500">
                    {msgAgent.name}
                  </span>
                </div>
              )}

              <div
                className={`rounded-[26px] px-5 py-4 max-w-[92%] transition-colors ${
                  isUser
                    ? darkMode
                      ? 'bg-blue-600 text-white'
                      : 'bg-zinc-900 text-white'
                    : darkMode
                    ? 'bg-[#222226] text-zinc-100'
                    : 'bg-[#F2F2F0] text-[#1C1C1E]'
                }`}
              >
                <p className="text-[17px] leading-[1.46] tracking-[-0.01em] whitespace-pre-wrap">
                  {msg.text}
                </p>
              </div>
            </div>
          );
        })}

        {/* Minimalist Animated Mascot + Working Status matching Screenshot 3 */}
        {mode === 'agent' && agent && (
          <div className="pt-2 pl-1 flex items-center gap-2.5">
            <MascotAvatar
              config={agent.mascot}
              status={isSending ? 'working' : 'working'}
              size={34}
              interactive={true}
            />
            <span className="text-[16px] font-medium working-shimmer-text">
              {isSending ? liveStepText || 'Working' : 'Working'}
            </span>
          </div>
        )}

        {mode === 'group' && isSending && (
          <div className="pt-2 pl-1 flex items-center gap-2.5">
            <GroupMascotCluster mascots={groupMemberMascots} size={30} />
            <span className="text-[15px] font-medium working-shimmer-text">
              {liveStepText || 'Working'}
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Clean Bottom Sheet for 1-Tap Agent Workflows when '+' is pressed */}
      {workflowsOpen && (
        <div className="px-4 pb-2">
          <div
            className={`rounded-[24px] p-3.5 border shadow-lg space-y-2 ${
              darkMode
                ? 'bg-[#202024] border-zinc-800 text-zinc-100'
                : 'bg-white border-zinc-200/80 text-zinc-900'
            }`}
          >
            <div className="flex items-center justify-between px-1 pb-1">
              <span className="text-xs font-semibold text-zinc-400">
                Run Real Agent Workflow
              </span>
              <button
                type="button"
                onClick={() => setWorkflowsOpen(false)}
                aria-label="Close workflows"
                className="text-zinc-400 hover:text-zinc-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-1.5">
              {AGENT_WORKFLOW_TEMPLATES.map((wf) => (
                <button
                  key={wf.id}
                  type="button"
                  onClick={() => {
                    setWorkflowsOpen(false);
                    onSendMessage(wf.prompt);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-left transition-colors ${
                    darkMode ? 'hover:bg-zinc-800/80' : 'hover:bg-zinc-100/80'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                    {getWorkflowIcon(wf.id)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium truncate">{wf.title}</div>
                    <div className="text-xs text-zinc-400 truncate">{wf.subtitle}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Pill Composer matching Screenshot 3 ("+ Hold to speak to Dora, or type [Mic]") */}
      <div className="px-4 pb-4 pt-1 shrink-0">
        <form
          onSubmit={handleSubmit}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-full shadow-xs border transition-all ${
            darkMode
              ? 'bg-[#222226] border-zinc-800 text-zinc-100'
              : 'bg-white border-zinc-200/70 text-zinc-900'
          }`}
        >
          <button
            type="button"
            onClick={() => setWorkflowsOpen((prev) => !prev)}
            aria-label="Open agent workflows"
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors shrink-0 ${
              darkMode ? 'hover:bg-zinc-800 text-zinc-300' : 'hover:bg-zinc-100 text-zinc-700'
            }`}
          >
            <Plus className="w-5 h-5 stroke-[2.2]" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              voiceRecording
                ? 'Listening... tap mic to insert'
                : `Hold to speak to ${mode === 'agent' ? agent?.name || 'Agent' : group?.name || 'Group'}, or type`
            }
            aria-label={`Message ${mode === 'agent' ? agent?.name || 'Agent' : group?.name || 'Group'}`}
            className="flex-1 bg-transparent text-[15.5px] focus:outline-none placeholder:text-zinc-400"
          />

          {inputText.trim() ? (
            <button
              type="submit"
              disabled={isSending}
              aria-label="Send message"
              className="w-9 h-9 rounded-full bg-zinc-900 dark:bg-blue-600 text-white flex items-center justify-center hover:opacity-90 transition-opacity shrink-0"
            >
              <ArrowUp className="w-4 h-4 stroke-[2.5]" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleVoiceSimulate}
              aria-label={voiceRecording ? 'Finish voice dictation' : 'Start voice dictation'}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors shrink-0 ${
                voiceRecording
                  ? 'bg-red-500 text-white'
                  : darkMode
                  ? 'hover:bg-zinc-800 text-zinc-300'
                  : 'hover:bg-zinc-100 text-zinc-800'
              }`}
            >
              <Mic className="w-5 h-5 stroke-[2]" />
            </button>
          )}
        </form>
      </div>
    </section>
  );
};
