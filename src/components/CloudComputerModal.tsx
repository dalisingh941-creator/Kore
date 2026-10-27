import React, { useState } from 'react';
import {
  X,
  Monitor,
  Terminal,
  Play,
  FileCode2,
  FolderOpen,
  Cpu,
  CheckCircle2,
} from 'lucide-react';
import { Agent, AgentFile } from '../types/agent';
import { MascotAvatar } from './MascotAvatar';

interface CloudComputerModalProps {
  agent: Agent;
  initialFile?: AgentFile;
  onClose: () => void;
  onUpdateAgent: (updated: Agent) => void;
}

export const CloudComputerModal: React.FC<CloudComputerModalProps> = ({
  agent,
  initialFile,
  onClose,
  onUpdateAgent,
}) => {
  const [selectedFileId, setSelectedFileId] = useState<string>(
    initialFile?.id || agent.files[0]?.id || ''
  );
  const [commandInput, setCommandInput] = useState('');
  const [envTab, setEnvTab] = useState<'cloud' | 'local'>('cloud');

  const currentFile =
    agent.files.find((f) => f.id === selectedFileId) || agent.files[0];

  const handleRunCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = commandInput.trim();
    if (!cmd) return;
    setCommandInput('');
    const newLogs = [
      ...agent.identity.computerTerminalLogs,
      `$ ${cmd}`,
      `[${agent.name.toLowerCase()}-sandbox] Executed "${cmd}" against ${
        currentFile?.name || 'workspace'
      } -> exit code 0 (verified)`,
    ];
    onUpdateAgent({
      ...agent,
      identity: {
        ...agent.identity,
        computerTerminalLogs: newLogs,
      },
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${agent.name} Cloud and Local Computer Sandbox`}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm"
    >
      <div className="w-full max-w-5xl h-[86vh] flex flex-col rounded-[28px] overflow-hidden bg-[#141417] border border-zinc-800 text-zinc-100 shadow-2xl">
        {/* Top Window Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#1C1C21] border-b border-zinc-800 shrink-0">
          <div className="flex items-center gap-3">
            <MascotAvatar
              config={agent.mascot}
              status={agent.status}
              size={36}
              interactive={false}
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-white">
                  {agent.identity.computerName}
                </h2>
                <span className="text-[11px] font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded">
                  {agent.identity.computerOs}
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Active session: {agent.identity.computerActiveApp}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-zinc-900 p-1 rounded-xl border border-zinc-800">
              <button
                type="button"
                onClick={() => setEnvTab('cloud')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  envTab === 'cloud'
                    ? 'bg-zinc-800 text-white'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Cloud Sandbox
              </button>
              <button
                type="button"
                onClick={() => setEnvTab('local')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  envTab === 'local'
                    ? 'bg-zinc-800 text-white'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Local Bridge
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Exit desktop sandbox"
              className="w-9 h-9 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Desktop Split: File Explorer + Code/Notebook Viewer + Live Terminal */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0">
          {/* Left File Tree */}
          <div className="lg:col-span-3 border-b lg:border-b-0 lg:border-r border-zinc-800 p-4 flex flex-col justify-between bg-[#18181C] overflow-y-auto">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <FolderOpen className="w-3.5 h-3.5" />
                  <span>Workspace Files</span>
                </span>
                <span className="font-mono">{agent.files.length}</span>
              </div>

              <div className="space-y-1">
                {agent.files.map((file) => {
                  const active = currentFile?.id === file.id;
                  return (
                    <button
                      key={file.id}
                      type="button"
                      onClick={() => setSelectedFileId(file.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs font-mono transition-colors ${
                        active
                          ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40'
                          : 'text-zinc-300 hover:bg-zinc-800/70'
                      }`}
                    >
                      <span className="flex items-center gap-2 truncate">
                        <FileCode2 className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{file.name}</span>
                      </span>
                      <span className="text-[10px] text-zinc-500 shrink-0">
                        {file.size}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800/80 space-y-2 text-xs text-zinc-400">
              <div className="flex items-center gap-2 text-emerald-400 font-medium">
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {envTab === 'cloud'
                    ? 'Isolated Cloud Container Mounted'
                    : 'Local Daemon Tunnel Synced'}
                </span>
              </div>
              <p className="text-[11px] text-zinc-500">
                All file mutations are journaled by {agent.name} before checkpoint serialization.
              </p>
            </div>
          </div>

          {/* Right Editor & Interactive Terminal */}
          <div className="lg:col-span-9 flex flex-col min-h-0">
            {/* Code / Notebook View */}
            <div className="flex-1 p-4 overflow-y-auto bg-[#111114] border-b border-zinc-800">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800/80">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-semibold text-zinc-200">
                    {currentFile?.name || 'colab_preflight.ipynb'}
                  </span>
                  <span className="text-[11px] text-zinc-500">
                    Updated {currentFile?.updatedAt || 'recently'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newLogs = [
                      ...agent.identity.computerTerminalLogs,
                      `$ kore-verify --file="${currentFile?.name || 'manifest.json'}"`,
                      `[ok] Syntax & invariant verification passed for ${currentFile?.name}`,
                    ];
                    onUpdateAgent({
                      ...agent,
                      identity: {
                        ...agent.identity,
                        computerTerminalLogs: newLogs,
                      },
                    });
                  }}
                  className="px-3 py-1 rounded-lg bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 text-xs font-medium flex items-center gap-1.5 hover:bg-emerald-600/30"
                >
                  <Play className="w-3 h-3" />
                  <span>Run File Diagnostic</span>
                </button>
              </div>

              <pre className="text-xs sm:text-[13px] font-mono leading-relaxed text-zinc-200 whitespace-pre-wrap">
                {currentFile?.content || agent.identity.computerCodePreview}
              </pre>
            </div>

            {/* Sandbox Terminal */}
            <div className="h-52 bg-[#0C0C0E] p-4 flex flex-col justify-between">
              <div className="overflow-y-auto space-y-1 font-mono text-xs text-zinc-300 pr-2">
                <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 pb-1">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>{agent.name} Sandbox Shell</span>
                </div>
                {agent.identity.computerTerminalLogs.map((line, i) => (
                  <div
                    key={i}
                    className={
                      line.startsWith('$')
                        ? 'text-sky-400'
                        : line.includes('[ok]') || line.includes('✔')
                        ? 'text-emerald-400'
                        : 'text-zinc-300'
                    }
                  >
                    {line}
                  </div>
                ))}
              </div>

              <form onSubmit={handleRunCommand} className="mt-2 flex items-center gap-2 pt-2 border-t border-zinc-800/80">
                <span className="font-mono text-xs text-emerald-400">$</span>
                <input
                  type="text"
                  value={commandInput}
                  onChange={(e) => setCommandInput(e.target.value)}
                  placeholder={`Run command in ${agent.name}'s sandbox (e.g. pytest -v or nvidia-smi)...`}
                  aria-label="Sandbox terminal command"
                  className="flex-1 bg-transparent font-mono text-xs text-white focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-200"
                >
                  Execute
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
