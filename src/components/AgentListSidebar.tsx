import React, { useState, useRef, useEffect } from 'react';
import {
  User,
  Search,
  Plus,
  Pin,
  Bot,
  ScanLine,
  Hash,
  X,
} from 'lucide-react';
import { Agent, GroupChat } from '../types/agent';
import { MascotAvatar, GroupMascotCluster } from './MascotAvatar';

interface AgentListSidebarProps {
  agents: Agent[];
  groupChats: GroupChat[];
  allAgentsForCluster: Agent[];
  selectedType: 'agent' | 'group';
  selectedId: string;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectAgent: (agentId: string) => void;
  onSelectGroup: (groupId: string) => void;
  onOpenSettings: () => void;
  onOpenCreateAgent: () => void;
  onOpenScanCreate: () => void;
  onOpenCreateGroup: () => void;
  darkMode: boolean;
}

export const AgentListSidebar: React.FC<AgentListSidebarProps> = ({
  agents,
  groupChats,
  allAgentsForCluster,
  selectedType,
  selectedId,
  searchQuery,
  onSearchChange,
  onSelectAgent,
  onSelectGroup,
  onOpenSettings,
  onOpenCreateAgent,
  onOpenScanCreate,
  onOpenCreateGroup,
  darkMode,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  return (
    <aside
      aria-label="Agents and Conversations"
      className={`flex flex-col h-full w-full select-none transition-colors ${
        darkMode
          ? 'bg-[#141416] text-zinc-100 border-r border-zinc-800/80'
          : 'bg-[#FAF9F6] text-zinc-900 border-r border-zinc-200/70'
      }`}
    >
      {/* Top Action Bar matching Screenshot 1 & 4 */}
      <div className="relative flex items-center justify-between px-4 pt-4 pb-3 shrink-0">
        <button
          type="button"
          onClick={onOpenSettings}
          aria-label="Open Settings"
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-sm ${
            darkMode
              ? 'bg-zinc-800/90 text-zinc-100 hover:bg-zinc-700'
              : 'bg-white text-zinc-800 hover:bg-zinc-50 border border-zinc-200/60'
          }`}
        >
          <User className="w-5 h-5 stroke-[2]" />
        </button>

        <div className="flex items-center gap-2.5" ref={menuRef}>
          <button
            type="button"
            onClick={() => setSearchOpen((prev) => !prev)}
            aria-label="Search conversations"
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-sm ${
              darkMode
                ? 'bg-zinc-800/90 text-zinc-100 hover:bg-zinc-700'
                : 'bg-white text-zinc-800 hover:bg-zinc-50 border border-zinc-200/60'
            }`}
          >
            <Search className="w-5 h-5 stroke-[2]" />
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Create Agent or Group"
            aria-expanded={menuOpen}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-sm ${
              darkMode
                ? 'bg-zinc-800/90 text-zinc-100 hover:bg-zinc-700'
                : 'bg-white text-zinc-800 hover:bg-zinc-50 border border-zinc-200/60'
            }`}
          >
            <Plus className="w-5 h-5 stroke-[2.2]" />
          </button>

          {/* Popover Menu matching Screenshot 4 ("Agent", "Scan & create", "Group Chat") */}
          {menuOpen && (
            <div
              role="menu"
              className={`absolute right-4 top-18 z-50 w-64 rounded-[28px] p-2.5 shadow-xl border transition-all ${
                darkMode
                  ? 'bg-zinc-900 border-zinc-800 text-zinc-100 shadow-black/60'
                  : 'bg-white border-zinc-100 text-zinc-900 shadow-zinc-900/10'
              }`}
            >
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  onOpenCreateAgent();
                }}
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-left text-[16px] font-medium transition-colors ${
                  darkMode ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100/80'
                }`}
              >
                <Bot className="w-5 h-5 stroke-[1.9] shrink-0" />
                <span>Agent</span>
              </button>

              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  onOpenScanCreate();
                }}
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-left text-[16px] font-medium transition-colors ${
                  darkMode ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100/80'
                }`}
              >
                <ScanLine className="w-5 h-5 stroke-[1.9] shrink-0" />
                <span>Scan &amp; create</span>
              </button>

              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  onOpenCreateGroup();
                }}
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-left text-[16px] font-medium transition-colors ${
                  darkMode ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100/80'
                }`}
              >
                <Hash className="w-5 h-5 stroke-[1.9] shrink-0" />
                <span>Group Chat</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Collapsible Search Bar */}
      {searchOpen && (
        <div className="px-4 pb-3 shrink-0">
          <div
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl border ${
              darkMode
                ? 'bg-zinc-900 border-zinc-800 text-zinc-100'
                : 'bg-white border-zinc-200 text-zinc-900'
            }`}
          >
            <Search className="w-4 h-4 text-zinc-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Filter agents, roles, or messages..."
              aria-label="Filter agents, roles, or messages"
              className="w-full bg-transparent text-sm focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                aria-label="Clear search"
                className="p-1 text-zinc-400 hover:text-zinc-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto divide-y divide-transparent">
        {/* Group Chats (Pinned on top like Screenshot 1) */}
        {groupChats.map((group) => {
          const isSelected = selectedType === 'group' && selectedId === group.id;
          const memberMascots = group.memberAgentIds
            .map((id) => allAgentsForCluster.find((a) => a.id === id)?.mascot)
            .filter(Boolean) as Agent['mascot'][];
          const lastMsg = group.messages[group.messages.length - 1];

          return (
            <button
              key={group.id}
              type="button"
              onClick={() => onSelectGroup(group.id)}
              className={`w-full flex items-center gap-3.5 px-4 py-3.5 text-left transition-colors ${
                isSelected
                  ? darkMode
                    ? 'bg-zinc-800/90'
                    : 'bg-[#EFECE6]'
                  : group.pinned
                  ? darkMode
                    ? 'bg-zinc-900/70 hover:bg-zinc-800/60'
                    : 'bg-[#F3F2EE] hover:bg-[#ECEAE4]'
                  : darkMode
                  ? 'hover:bg-zinc-900/50'
                  : 'hover:bg-zinc-100/70'
              }`}
            >
              <GroupMascotCluster mascots={memberMascots} size={54} />

              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-[17px] font-medium tracking-tight truncate">
                    {group.name}
                  </span>
                  <span
                    className={`text-xs font-mono tabular-nums shrink-0 ${
                      darkMode ? 'text-zinc-500' : 'text-zinc-400'
                    }`}
                  >
                    {group.lastMessageTime}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 mt-0.5">
                  <p
                    className={`text-[14.5px] truncate ${
                      darkMode ? 'text-zinc-400' : 'text-zinc-500'
                    }`}
                  >
                    {lastMsg ? lastMsg.text : group.objective}
                  </p>
                  {group.pinned && (
                    <Pin
                      className={`w-4 h-4 shrink-0 rotate-45 ${
                        darkMode ? 'text-zinc-500 fill-zinc-500' : 'text-zinc-400 fill-zinc-400'
                      }`}
                    />
                  )}
                </div>
              </div>
            </button>
          );
        })}

        {/* Individual Agents */}
        {agents.map((agent, idx) => {
          const isSelected = selectedType === 'agent' && selectedId === agent.id;
          const lastMsg = agent.messages[agent.messages.length - 1];

          return (
            <button
              key={agent.id}
              type="button"
              onClick={() => onSelectAgent(agent.id)}
              className={`w-full flex items-center gap-3.5 px-4 py-3.5 text-left transition-colors ${
                isSelected
                  ? darkMode
                    ? 'bg-zinc-800/90'
                    : 'bg-[#EFECE6]'
                  : darkMode
                  ? 'hover:bg-zinc-900/40'
                  : 'hover:bg-zinc-100/60'
              }`}
            >
              <MascotAvatar
                config={agent.mascot}
                status={agent.status}
                size={54}
                interactive={false}
                seedOffset={idx}
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-[17px] font-medium tracking-tight truncate">
                    {agent.name}
                  </span>
                  <span
                    className={`text-xs font-mono tabular-nums shrink-0 ${
                      darkMode ? 'text-zinc-500' : 'text-zinc-400'
                    }`}
                  >
                    {agent.lastMessageTime}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 mt-0.5">
                  <p
                    className={`text-[14.5px] truncate ${
                      darkMode ? 'text-zinc-400' : 'text-zinc-500'
                    }`}
                  >
                    {lastMsg ? lastMsg.text : agent.role}
                  </p>
                </div>
              </div>
            </button>
          );
        })}

        {agents.length === 0 && groupChats.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-zinc-500">No agents or chats match your filter.</p>
          </div>
        )}
      </div>
    </aside>
  );
};
