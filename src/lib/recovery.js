export const SESSION_KEY = 'tempo-session-v1';

// Reconcile wall-clock time without replaying cues that occurred while suspended.
export function recoverSession(saved, now = Date.now()) {
  if (!saved || saved.version !== 1 || !Array.isArray(saved.phases) || !saved.phases.length ||
      !Number.isInteger(saved.phaseIndex) || saved.phaseIndex < 0 || saved.phaseIndex >= saved.phases.length ||
      !Number.isFinite(saved.deadline) || !Number.isFinite(saved.remaining) || saved.remaining < 0 ||
      typeof saved.paused !== 'boolean' || !saved.config ||
      saved.phases.some(p => !['Work', 'Rest', 'Set rest'].includes(p.name) || !Number.isFinite(p.duration) || p.duration <= 0 || !Number.isInteger(p.round) || !Number.isInteger(p.set))) return null;
  let { phaseIndex, deadline } = saved;
  if (!saved.paused) {
    while (now >= deadline) {
      if (phaseIndex === saved.phases.length - 1) return { complete: true };
      deadline += saved.phases[++phaseIndex].duration * 1000;
    }
  }
  return { ...saved, phaseIndex, deadline, remaining: saved.paused ? Math.min(saved.remaining, saved.phases[phaseIndex].duration) : Math.min(saved.phases[phaseIndex].duration, (deadline - now) / 1000) };
}
