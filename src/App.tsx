/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  INITIAL_AGENTS,
  INITIAL_APPS,
  INITIAL_GROUP_CHATS,
  INITIAL_MCP_SERVERS,
  INITIAL_PROVIDERS,
  INITIAL_SKILLS,
} from './data/initialAgents';
import {
  Agent,
  AgentFile,
  AppIntegration,
  GroupChat,
  MCPServer,
  ProviderProfile,
} from './types/agent';
import {
  filterConversations,
  selectGroupResponders,
} from './utils/agentLogic';
import { AgentListSidebar } from './components/AgentListSidebar';
import { ChatWorkspace } from './components/ChatWorkspace';
import { AgentProfilePanel } from './components/AgentProfilePanel';
import { MascotStudioModal } from './components/MascotStudioModal';
import { CloudComputerModal } from './components/CloudComputerModal';
import { SettingsView } from './components/SettingsView';

type ActiveScreen = 'list' | 'chat' | 'profile' | 'settings';

export default function App() {
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [groupChats, setGroupChats] = useState<GroupChat[]>(INITIAL_GROUP_CHATS);
  const [providers] = useState<ProviderProfile[]>(INITIAL_PROVIDERS);
  const [activeProviderId, setActiveProviderId] = useState<string>('builtin-gemini');
  const [mcpServers, setMcpServers] = useState<MCPServer[]>(INITIAL_MCP_SERVERS);
  const [apps, setApps] = useState<AppIntegration[]>(INITIAL_APPS);

  const [selectedType, setSelectedType] = useState<'agent' | 'group'>('agent');
  const [selectedId, setSelectedId] = useState<string>(INITIAL_AGENTS[0].id);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Clean Mobile-First Screen Navigation ('list' -> 'chat' -> 'profile' -> 'settings')
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('list');

  // Modals
  const [studioMode, setStudioMode] = useState<'agent' | 'scan' | 'group' | null>(null);
  const [editingMascotAgent, setEditingMascotAgent] = useState<Agent | undefined>(undefined);
  const [desktopModalState, setDesktopModalState] = useState<{
    open: boolean;
    initialFile?: AgentFile;
  }>({ open: false });

  const [isSending, setIsSending] = useState<boolean>(false);
  const [liveStepText, setLiveStepText] = useState<string>('Working');

  const activeAgent =
    selectedType === 'agent'
      ? agents.find((a) => a.id === selectedId) || agents[0]
      : agents.find(
          (a) =>
            a.id ===
            (groupChats.find((g) => g.id === selectedId)?.memberAgentIds[0] || '')
        ) || agents[0];

  const activeGroup =
    selectedType === 'group'
      ? groupChats.find((g) => g.id === selectedId) || groupChats[0]
      : undefined;

  const filtered = filterConversations(agents, groupChats, searchQuery);

  const handleSelectAgent = (agentId: string) => {
    setSelectedType('agent');
    setSelectedId(agentId);
    setActiveScreen('chat');
  };

  const handleSelectGroup = (groupId: string) => {
    setSelectedType('group');
    setSelectedId(groupId);
    setActiveScreen('chat');
  };

  const handleUpdateAgent = (updated: Agent) => {
    setAgents((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
  };

  const handleSendMessage = async (promptText: string) => {
    const timestamp = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    if (selectedType === 'agent' && activeAgent) {
      const userMsg = {
        id: `msg-u-${Date.now()}`,
        senderId: 'user' as const,
        senderName: 'You',
        text: promptText,
        timestamp,
      };

      const targetAgentId = activeAgent.id;
      const updatedHistory = [...activeAgent.messages, userMsg];

      setAgents((prev) =>
        prev.map((a) =>
          a.id === targetAgentId
            ? {
                ...a,
                status: 'thinking',
                lastMessageTime: 'Now',
                messages: updatedHistory,
              }
            : a
        )
      );

      setIsSending(true);
      setLiveStepText('Thinking...');

      const stepTimer = setTimeout(() => {
        setLiveStepText(`Using ${activeAgent.name}'s computer...`);
        setAgents((prev) =>
          prev.map((a) => (a.id === targetAgentId ? { ...a, status: 'working' } : a))
        );
      }, 650);

      try {
        const activeProvider =
          providers.find((p) => p.id === activeProviderId) || providers[0];

        const response = await fetch('/api/agent/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            agentName: activeAgent.name,
            agentRole: activeAgent.role,
            instructions: activeAgent.instructions,
            memoryItems: activeAgent.memoryItems,
            enabledSkills: activeAgent.enabledSkills,
            enabledMcpIds: activeAgent.enabledMcpIds,
            activeFile: activeAgent.identity.computerActiveFile,
            history: updatedHistory,
            prompt: promptText,
            modelId: activeProvider.modelId,
          }),
        });

        const data = await response.json();
        const replyText =
          data.reply ||
          `Maine "${promptText}" ka kaam pura karke file save kar di hai.`;

        const agentMsg = {
          id: `msg-a-${Date.now()}`,
          senderId: targetAgentId,
          senderName: activeAgent.name,
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        };

        setAgents((prev) =>
          prev.map((a) => {
            if (a.id !== targetAgentId) return a;

            const updatedFiles = data.newFile
              ? [
                  {
                    id: `file-${Date.now()}`,
                    name: data.newFile.name,
                    type: data.newFile.type || 'markdown',
                    size: data.newFile.size || '2.1 KB',
                    updatedAt: 'Just now',
                    content: data.newFile.content,
                  },
                  ...a.files.filter((f) => f.name !== data.newFile.name),
                ]
              : a.files;

            const updatedMail = data.newMail
              ? [
                  {
                    id: `mail-${Date.now()}`,
                    from: data.newMail.from || a.identity.email,
                    subject: data.newMail.subject,
                    snippet: data.newMail.snippet,
                    timestamp: 'Just now',
                    unread: true,
                  },
                  ...a.identity.mailInbox,
                ]
              : a.identity.mailInbox;

            const updatedCalls = data.newCall
              ? [
                  {
                    id: `call-${Date.now()}`,
                    contact: data.newCall.contact,
                    number: a.identity.phone || '+1 (415) 602-9000',
                    duration: data.newCall.duration || '1m 12s',
                    summary: data.newCall.summary,
                    timestamp: 'Just now',
                    direction: 'outbound' as const,
                  },
                  ...a.identity.phoneLogs,
                ]
              : a.identity.phoneLogs;

            const updatedTx = data.newTransaction
              ? [
                  {
                    id: `tx-${Date.now()}`,
                    merchant: data.newTransaction.merchant,
                    amountUsd: Number(data.newTransaction.amountUsd) || 10,
                    status: 'approved' as const,
                    timestamp: 'Just now',
                    purpose: data.newTransaction.purpose,
                  },
                  ...a.identity.transactions,
                ]
              : a.identity.transactions;

            const addedSpend = data.newTransaction
              ? Number(data.newTransaction.amountUsd) || 0
              : 0;

            return {
              ...a,
              status: 'working',
              messages: [...a.messages, agentMsg],
              files: updatedFiles,
              identity: {
                ...a.identity,
                mailInbox: updatedMail,
                phoneLogs: updatedCalls,
                transactions: updatedTx,
                walletSpentUsd: a.identity.walletSpentUsd + addedSpend,
                computerActiveApp:
                  data.desktopAppTitle || a.identity.computerActiveApp,
                computerActiveFile:
                  data.newFile?.name || a.identity.computerActiveFile,
                computerCodePreview:
                  data.desktopCode || a.identity.computerCodePreview,
                computerTerminalLogs: data.terminalLine
                  ? [...a.identity.computerTerminalLogs, data.terminalLine]
                  : a.identity.computerTerminalLogs,
              },
            };
          })
        );
      } catch {
        const fallbackMsg = {
          id: `msg-a-${Date.now()}`,
          senderId: targetAgentId,
          senderName: activeAgent.name,
          text: `Maine "${promptText}" ka kaam complete karke apni computer files mein update kar diya hai.`,
          timestamp,
        };
        setAgents((prev) =>
          prev.map((a) =>
            a.id === targetAgentId
              ? { ...a, status: 'working', messages: [...a.messages, fallbackMsg] }
              : a
          )
        );
      } finally {
        clearTimeout(stepTimer);
        setIsSending(false);
        setLiveStepText('Working');
      }
    } else if (selectedType === 'group' && activeGroup) {
      const userMsg = {
        id: `gmsg-u-${Date.now()}`,
        senderId: 'user' as const,
        senderName: 'You',
        text: promptText,
        timestamp,
      };

      const targetGroupId = activeGroup.id;
      const updatedMessages = [...activeGroup.messages, userMsg];

      setGroupChats((prev) =>
        prev.map((g) =>
          g.id === targetGroupId
            ? { ...g, lastMessageTime: 'Now', messages: updatedMessages }
            : g
        )
      );

      const responders = selectGroupResponders(
        agents,
        activeGroup.memberAgentIds,
        promptText,
        2
      );

      setIsSending(true);
      setLiveStepText('Agents coordinating...');
      try {
        const response = await fetch('/api/agent/group-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            groupName: activeGroup.name,
            objective: activeGroup.objective,
            responders: responders.map((r) => ({
              id: r.id,
              name: r.name,
              role: r.role,
              instructions: r.instructions,
            })),
            history: updatedMessages,
            prompt: promptText,
          }),
        });

        const data = await response.json();
        const replies: { agentId: string; senderName: string; text: string }[] =
          Array.isArray(data.replies) ? data.replies : [];

        const newGroupMsgs = replies.map((rep, idx) => ({
          id: `gmsg-a-${Date.now()}-${idx}`,
          senderId: rep.agentId,
          senderName: rep.senderName,
          text: rep.text,
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        }));

        setGroupChats((prev) =>
          prev.map((g) =>
            g.id === targetGroupId
              ? { ...g, messages: [...g.messages, ...newGroupMsgs] }
              : g
          )
        );
      } finally {
        setIsSending(false);
        setLiveStepText('Working');
      }
    }
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <main
        className={`h-dvh w-screen overflow-hidden flex justify-center transition-colors ${
          darkMode ? 'bg-[#0C0C0E]' : 'bg-[#ECEAE5]'
        }`}
      >
        {/* Clean Mobile App Shell — 100% full width on mobile, sleek centered mobile frame on desktop */}
        <div
          className={`w-full max-w-[440px] h-full overflow-hidden flex flex-col sm:shadow-2xl sm:border-x ${
            darkMode
              ? 'bg-[#141416] sm:border-zinc-800/80'
              : 'bg-[#FAF9F6] sm:border-zinc-200/80'
          }`}
        >
          {activeScreen === 'list' && (
            <AgentListSidebar
              agents={filtered.agents}
              groupChats={filtered.groupChats}
              allAgentsForCluster={agents}
              selectedType={selectedType}
              selectedId={selectedId}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSelectAgent={handleSelectAgent}
              onSelectGroup={handleSelectGroup}
              onOpenSettings={() => setActiveScreen('settings')}
              onOpenCreateAgent={() => {
                setEditingMascotAgent(undefined);
                setStudioMode('agent');
              }}
              onOpenScanCreate={() => {
                setEditingMascotAgent(undefined);
                setStudioMode('scan');
              }}
              onOpenCreateGroup={() => {
                setEditingMascotAgent(undefined);
                setStudioMode('group');
              }}
              darkMode={darkMode}
            />
          )}

          {activeScreen === 'chat' && (
            <ChatWorkspace
              mode={selectedType}
              agent={activeAgent}
              group={activeGroup}
              allAgents={agents}
              isSending={isSending}
              liveStepText={liveStepText}
              onSendMessage={handleSendMessage}
              onOpenProfile={() => setActiveScreen('profile')}
              onOpenDesktop={() => setDesktopModalState({ open: true })}
              onBackToList={() => setActiveScreen('list')}
              darkMode={darkMode}
            />
          )}

          {activeScreen === 'profile' && activeAgent && (
            <AgentProfilePanel
              agent={activeAgent}
              onClose={() => setActiveScreen('chat')}
              onEnterDesktop={(initialFile) =>
                setDesktopModalState({ open: true, initialFile })
              }
              onUpdateAgent={handleUpdateAgent}
              onCustomizeMascot={() => {
                setEditingMascotAgent(activeAgent);
                setStudioMode('agent');
              }}
            />
          )}

          {activeScreen === 'settings' && (
            <SettingsView
              onBack={() => setActiveScreen('list')}
              darkMode={darkMode}
              onToggleDarkMode={() => setDarkMode((prev) => !prev)}
              providers={providers}
              activeProviderId={activeProviderId}
              onSelectProvider={setActiveProviderId}
              mcpServers={mcpServers}
              onToggleMcpServer={(id) =>
                setMcpServers((prev) =>
                  prev.map((m) => (m.id === id ? { ...m, enabled: !m.enabled } : m))
                )
              }
              onAddMcpServer={(srv) => setMcpServers((prev) => [srv, ...prev])}
              skills={INITIAL_SKILLS}
              apps={apps}
              onToggleApp={(id) =>
                setApps((prev) =>
                  prev.map((ap) =>
                    ap.id === id ? { ...ap, connected: !ap.connected } : ap
                  )
                )
              }
              agents={agents}
            />
          )}
        </div>

        {/* Mascot Creation Studio / Scan & Create / Group Chat Modal */}
        {studioMode && (
          <MascotStudioModal
            mode={studioMode}
            editingAgent={editingMascotAgent}
            onClose={() => {
              setStudioMode(null);
              setEditingMascotAgent(undefined);
            }}
            onCreatedAgent={(newAgent) => {
              setAgents((prev) => [newAgent, ...prev]);
              setSelectedType('agent');
              setSelectedId(newAgent.id);
              setActiveScreen('chat');
            }}
            onUpdatedAgent={(updated) => {
              handleUpdateAgent(updated);
            }}
            onCreatedGroup={(newGroup) => {
              setGroupChats((prev) => [newGroup, ...prev]);
              setSelectedType('group');
              setSelectedId(newGroup.id);
              setActiveScreen('chat');
            }}
            existingAgents={agents}
            providers={providers}
            mcpServers={mcpServers}
            darkMode={darkMode}
          />
        )}

        {/* Cloud & Local Computer Sandbox Modal */}
        {desktopModalState.open && activeAgent && (
          <CloudComputerModal
            agent={activeAgent}
            initialFile={desktopModalState.initialFile}
            onClose={() => setDesktopModalState({ open: false })}
            onUpdateAgent={handleUpdateAgent}
          />
        )}
      </main>
    </div>
  );
}
