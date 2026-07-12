# InterviewBooster frontend — structure

```
src/
├── App.jsx                    top-level: auth gate, core commands, module dispatch
├── main.jsx / index.css / App.css   unchanged entry files
│
├── theme/colors.js             COLORS palette, font stack
├── lib/                        generic helpers, no interview-specific knowledge
│   ├── id.js                   makeLine/nextId (log-entry factory)
│   ├── textUtils.js            extractQuoted, shuffle
│   └── downloadFile.js         generic browser file-download helper
│
├── hooks/                      shell-level state, module-agnostic
│   ├── useAuth.js              session check, login banner, logout
│   ├── useTerminalLog.js       scrollback state + auto-scroll
│   └── useCommandHistory.js    ↑ / ↓ history recall
│
├── components/                 pure presentation
│   ├── Terminal.jsx            the live shell (title bar, scrollback, input)
│   ├── TerminalLine.jsx        renders one scrollback entry by `kind`
│   ├── TerminalFrame.jsx       shared card chrome for the auth screens
│   ├── LoginScreen.jsx / LoadingScreen.jsx
│   └── icons/OAuthIcons.jsx    Microsoft/Google marks
│
└── modules/
    ├── moduleContract.js       ⭐ read this first — the shape every module hook returns
    └── interview/
        ├── useInterviewModule.js   state + command handling (the "brain")
        ├── questionPool.js         QUESTION_POOL / ANSWER_POOL / getCorrectAnswer
        ├── grading.js               GRADE_STYLE, gradeStyleFor, gradeOne (/api/grade)
        ├── report.js                 buildMarkdownReport
        └── helpText.js               help lines for "interview ..." commands
```

## Why it's split this way

- **`theme/` and `lib/`** hold anything with zero interview-specific
  knowledge — new modules reuse these directly instead of reinventing a
  download helper or a shuffle function.
- **`hooks/` and `components/`** are the terminal shell itself. They don't
  know what "interview" means; they take a `badge`, `promptLabel`, and
  `placeholder` as props and render whatever the active module hands them.
- **`modules/interview/`** is the entire interview feature, self-contained.
  Deleting this folder (and its one line of wiring in `App.jsx`) would
  remove the interview command set with no ripple effects elsewhere.

## Adding a second module

This is the part that matters for what you mentioned — swapping in a
different command set that talks to a different service, or adding
additional learning modules alongside this one.

1. Create `src/modules/<name>/` and write a `use<Name>Module.js` hook. Model
   it on `useInterviewModule.js`. It owns its own `useState`, does its own
   `fetch` calls, and returns an object shaped like:

   ```js
   {
     id: 'foo',
     helpLines: [...],           // shown under "help"
     capturing: boolean,         // true while it wants every keystroke
     statusBadge: string|null,   // title-bar badge, e.g. "foo 3/5"
     promptLabel: string|null,   // overrides "$"
     placeholder: string|null,
     handleCommand(cmd) -> boolean,
     handleCapturedInput(raw),
   }
   ```

2. In `App.jsx`:

   ```js
   const fooModule = useFooModule({ appendLines, makeLine, busy, setBusy });
   const modules = [interviewModule, fooModule];
   ```

That's it. Help text, command routing, and the "answer this" capture mode
(if your module needs one, like the interview's mock-interview flow) all
wire up automatically because `App.jsx` only talks to the module contract,
never to interview-specific state directly.

If you eventually want the person to *switch* between modules (e.g. an
`interview` command set vs. a `resume` command set that shouldn't both be
active at once), the cleanest extension is an `activeModuleId` bit of state
in `App.jsx` that filters the `modules` array — everything else here already
supports that without further changes.
