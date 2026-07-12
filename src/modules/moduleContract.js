// A "command module" is a self-contained set of terminal commands plus
// whatever state it needs (its own useState/useEffect, its own API calls).
// This file has no runtime exports — it's the contract every module hook
// should satisfy so App.jsx can stay generic.
//
// To add a new module (e.g. a different learning tool hitting a different
// backend, with its own command set):
//
//   1. Create src/modules/<name>/ for its data, API calls, and a
//      use<Name>Module.js hook (see modules/interview/useInterviewModule.js
//      for a full working example).
//
//   2. Have that hook return an object shaped like this:
//
//        {
//          id: 'foo',                      // unique id
//          helpLines: string[],            // printed under the "help" command
//          capturing: boolean,             // true while this module wants
//                                           // every raw keystroke instead of
//                                           // command parsing — e.g. an
//                                           // in-progress multi-step flow
//                                           // like the interview module's
//                                           // "answer this question" mode
//          statusBadge: string | null,     // shown top-right of the title bar
//          promptLabel: string | null,     // overrides the "$" prompt
//          placeholder: string | null,     // input placeholder while capturing
//          handleCommand(cmd) -> boolean,  // try to handle a command typed
//                                           // at the normal "$" prompt;
//                                           // return true if it was handled
//          handleCapturedInput(raw),       // handle raw input while `capturing`
//                                           // is true (bypasses handleCommand)
//        }
//
//   3. In App.jsx, call your hook alongside useInterviewModule() and add
//      the result to the `modules` array. That's it — help text, command
//      dispatch, capture-mode routing, and the title-bar badge all pick it
//      up automatically.
//
// Keeping modules to one "capturing" flow at a time is a deliberate
// simplification — if you need two modules mid-flow simultaneously, that's
// a sign that flow should probably be its own module state instead.
