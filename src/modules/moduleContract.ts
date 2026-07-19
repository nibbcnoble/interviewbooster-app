// A "command module" is a self-contained set of terminal commands plus
// whatever state it needs (its own useState/useEffect, its own API calls).
// This file has no runtime exports — it's the contract every module hook
// should satisfy so App.jsx can stay generic.
//
// To add a new module (e.g. a different learning tool hitting a different
// backend, with its own command set):
//
//   1. Create src/modules/<name>/ for its data, API calls, and a
//      use<Name>Module.ts hook (see modules/interview/useInterviewModule.js
//      for a full working example).
//
//   2. Have that hook return an object shaped like ModuleContract below.
//
//   3. In App.jsx, call your hook alongside useInterviewModule() and add
//      the result to the `modules` array. That's it — help text, command
//      dispatch, capture-mode routing, and the title-bar badge all pick it
//      up automatically.
//
// Keeping modules to one "capturing" flow at a time is a deliberate
// simplification — if you need two modules mid-flow simultaneously, that's
// a sign that flow should probably be its own module state instead.

export interface ModuleContract {
  id: string;
  helpLines: string[];
  capturing: boolean;
  statusBadge: string | null;
  promptLabel: string | null;
  placeholder: string | null;
  handleCommand(cmd: string): boolean;
  handleCapturedInput(raw: string): void;
}
