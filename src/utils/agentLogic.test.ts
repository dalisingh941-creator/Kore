import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateCreateAgentInput,
  buildNewAgent,
  filterConversations,
  selectGroupResponders,
  validateMcpServerInput,
  createMcpServerEntry,
} from './agentLogic';

test('validateCreateAgentInput rejects empty name or role and accepts valid config', () => {
  const invalidName = validateCreateAgentInput({
    name: ' ',
    role: 'Security Auditor',
    mascot: { shape: 'droplet', color: '#2B8EFF', expression: 'cheerful' },
  });
  assert.equal(invalidName.valid, false);

  const invalidRole = validateCreateAgentInput({
    name: 'Kairo',
    role: '',
    mascot: { shape: 'star5', color: '#FFC700', expression: 'wink' },
  });
  assert.equal(invalidRole.valid, false);

  const valid = validateCreateAgentInput({
    name: 'Kairo',
    role: 'Distributed Systems Auditor',
    mascot: { shape: 'hexagon', color: '#10B981', expression: 'focused' },
  });
  assert.equal(valid.valid, true);
});

test('buildNewAgent constructs a complete autonomous agent with sandbox and files', () => {
  const agent = buildNewAgent(
    {
      name: 'Zephyr',
      role: 'Kernel Profiler',
      mascot: {
        shape: 'ghost',
        color: '#8B5CF6',
        expression: 'calm',
        accessory: 'glasses',
      },
      walletLimitUsd: 120,
    },
    'test01'
  );

  assert.equal(agent.id, 'agent-zephyr-test01');
  assert.equal(agent.name, 'Zephyr');
  assert.equal(agent.mascot.accessory, 'glasses');
  assert.equal(agent.identity.email, 'zephyr@kore.workspace');
  assert.equal(agent.identity.walletLimitUsd, 120);
  assert.equal(agent.files.length, 2);
  assert.equal(agent.messages.length, 1);
});

test('filterConversations filters agents and group chats by name, role, or message text', () => {
  const a1 = buildNewAgent(
    {
      name: 'Nori',
      role: 'Checkpoint Recovery Engineer',
      mascot: { shape: 'droplet', color: '#2B8EFF', expression: 'cheerful' },
    },
    '1'
  );
  const a2 = buildNewAgent(
    {
      name: 'Milo',
      role: 'Frontend Verification Specialist',
      mascot: { shape: 'squircle', color: '#9A6B43', expression: 'skeptical' },
    },
    '2'
  );

  const res = filterConversations([a1, a2], [], 'checkpoint');
  assert.equal(res.agents.length, 1);
  assert.equal(res.agents[0].name, 'Nori');
});

test('selectGroupResponders prioritizes explicitly mentioned or role-matched agents', () => {
  const a1 = buildNewAgent(
    {
      name: 'Nori',
      role: 'PyTorch Gradient & Checkpoint Auditor',
      mascot: { shape: 'droplet', color: '#2B8EFF', expression: 'cheerful' },
    },
    '1'
  );
  const a2 = buildNewAgent(
    {
      name: 'Zane',
      role: 'GitHub Repository & Security Pipeline Engineer',
      mascot: { shape: 'star5', color: '#FA4B4B', expression: 'determined' },
    },
    '2'
  );
  const a3 = buildNewAgent(
    {
      name: 'Vela',
      role: 'Voice Interface Architect',
      mascot: { shape: 'burst8', color: '#3097FF', expression: 'focused' },
    },
    '3'
  );

  const picked = selectGroupResponders(
    [a1, a2, a3],
    [a1.id, a2.id, a3.id],
    'Zane please check the GitHub security pipeline and voice interface',
    2
  );
  assert.equal(picked.length, 2);
  assert.equal(picked[0].name, 'Zane');
  assert.equal(picked[1].name, 'Vela');
});

test('validateMcpServerInput and createMcpServerEntry handle custom MCP tool servers', () => {
  assert.equal(validateMcpServerInput('', 'npx @modelcontextprotocol/server-memory').valid, false);
  assert.equal(validateMcpServerInput('Memory MCP', 'npx @modelcontextprotocol/server-memory').valid, true);

  const server = createMcpServerEntry(
    'Postgres Inspector',
    'sse',
    'https://mcp.internal/postgres/sse',
    'query_table, explain_plan'
  );
  assert.equal(server.name, 'Postgres Inspector');
  assert.equal(server.toolsCount, 2);
  assert.deepEqual(server.tools, ['query_table', 'explain_plan']);
});
