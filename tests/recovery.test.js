import { test } from 'node:test';
import assert from 'node:assert/strict';
import { recoverSession } from '../src/lib/recovery.js';
const phases = [{ name: 'Work', duration: 90, round: 1, set: 1 }, { name: 'Rest', duration: 150, round: 1, set: 1 }, { name: 'Work', duration: 90, round: 2, set: 1 }];
const snapshot = { version: 1, config: {}, phases, phaseIndex: 0, deadline: 90000, remaining: 31, paused: false };
test('reload at a cue preserves elapsed time instead of restarting', () => {
  const result = recoverSession(snapshot, 61000);
  assert.equal(result.phaseIndex, 0);
  assert.equal(result.remaining, 29);
});
test('time elapsed across multiple intervals is reconciled', () => {
  const result = recoverSession(snapshot, 250000);
  assert.equal(result.phaseIndex, 2);
  assert.equal(result.remaining, 80);
});
test('paused workout does not advance while away', () => {
  assert.equal(recoverSession({ ...snapshot, paused: true, remaining: 29.5 }, 250000).remaining, 29.5);
});
test('finished workouts are not restarted', () => assert.deepEqual(recoverSession(snapshot, 330000), { complete: true }));
test('invalid snapshots are rejected', () => {
  for (const input of [null, {}, { ...snapshot, phaseIndex: -1 }, { ...snapshot, deadline: null }, { ...snapshot, phases: [{ ...phases[0], duration: 0 }] }]) assert.equal(recoverSession(input), null);
});
