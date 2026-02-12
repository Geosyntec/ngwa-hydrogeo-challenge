# Legacy App Mapping

Reference for the Knockout → React rewrite. The **legacy app** lives at:

**`C:\Users\AANG\OneDrive - Geosyntec\Development\ngwa_hydrogeology_challenge\GroundWater`**

---

## Legacy structure (student-facing challenge)

The student scenario UI is under **`GroundWater/Scripts/app/`**. The admin area (`GroundWater/Areas/Admin/`) is a separate SPA (scenario management, results, etc.) and is out of scope unless we port it later.

### View models → React feature

| Legacy ViewModel | Path | React equivalent |
|------------------|------|------------------|
| **ScenarioVM** | `Scripts/app/viewmodels/ScenarioVM.js` | `src/features/scenario/ScenarioSlice.ts`, `Scenario.tsx` |
| **MainVM** | `Scripts/app/viewmodels/MainVM.js` | App shell / routing (if any) |
| **MapVM** | `Scripts/app/viewmodels/MapVM.js` | `src/features/scenario/components/MapView/` |
| **WellVM** | `Scripts/app/viewmodels/WellVM.js` | Well state in ScenarioSlice + `WellMarker`, `WellInfoCard` |
| **FlowDirectionVM** | `Scripts/app/viewmodels/FlowDirectionVM.js` | `src/features/scenario/flowDirection/` + `Panels/FlowDirectionPanel/` |
| **GradientVM** | `Scripts/app/viewmodels/GradientVM.js` | `src/features/scenario/gradient/` + `Panels/GradientPanel/` |
| **HorizontalVelocityVM** | `Scripts/app/viewmodels/HorizontalVelocityVM.js` | `src/features/scenario/velocity/` + `Panels/HorizontalVelocityPanel/` |
| **DrawingVM** | `Scripts/app/viewmodels/DrawingVM.js` | Drawing on map (e.g. distance Y, flow line); `services/drawingMath.ts` |
| **PanelBaseVM** | `Scripts/app/viewmodels/PanelBaseVM.js` | Shared panel behavior (Open/Close, Reality Check, Check Answer / Show Solution) |
| **GeologyVM** | `Scripts/app/viewmodels/GeologyVM.js` | Well popover geology table (if ported) |

### Views (templates)

| Legacy view | Path | Content |
|-------------|------|--------|
| **scenario.html** | `Scripts/app/views/scenario.html` | Main scenario UI: map, wells, accordion panels (Choose Wells, Flow Direction, Gradient, Horizontal Velocity), Reality Check panels, modals (submit results, all done, image) |
| shell.html | `Scripts/app/views/shell.html` | App shell / layout |
| about.html, getting-started.html, reference.html | `Scripts/app/views/` | Static/info pages |

### Shared modules (legacy)

| File | Path | Purpose |
|------|------|---------|
| **answer-model.js** | `Scripts/app/shared/answer-model.js` | Simple model: name, value, answer, isCorrect |
| **ko-extenders.js** | `Scripts/app/shared/ko-extenders.js` | KO extenders (e.g. numeric, validation) |
| **ko-handlers.js** | `Scripts/app/shared/ko-handlers.js` | Custom KO logic |
| **ko.bindinghandlers.js** | `Scripts/app/shared/ko.bindinghandlers.js` | Custom bindings (e.g. textbox, popover, scroller) |
| **drawing-helper.js** | `Scripts/app/shared/drawing-helper.js` | Drawing/geometry helpers |

Answer fields in the legacy app use a pattern: observable value + correct answer + `IsCorrect()` / `Checked()` / `ShowAnswer()` — often wrapped by the **AnswerTextBoxTemplate** and custom **textbox** binding. Grading and “Show Solution” live in the panel VMs (e.g. `CheckStepOneAnswers`, `CheckStepTwoAnswers`).

---

## Panel order and dependencies

1. **Choose 3 Wells** — user picks Well 1, 2, 3 on the map. `AllWellsSelected` enables Flow Direction.
2. **Flow Direction** — Step 1 (identify highest/middle/lowest well + elevations + differences) → Step 2 (elevation ratio, distance, position) → Step 3 (compass direction). `Step3Complete` enables Gradient.
3. **Gradient** — Step 1 (reveal “Distance Y” on map, user enters value) → Step 2 (gradient formula). Uses FlowDirectionVM for highest/remaining well names and values. `Step2Complete` enables Horizontal Velocity.
4. **Horizontal Velocity** — Step 1 (i, K, n) → Step 2 (Darcy: V = Ki/n). Uses gradient from GradientVM. Final “Submit Answers” (test) or “All Done” (practice).

Each panel has a **Reality Check** tab (teaching content + figures). Panels use **Check Answer** and **Show Solution** (when not in test mode).

---

## Key legacy files to open when porting

- **Flow Direction:** `FlowDirectionVM.js`, `scenario.html` (Flow Direction panel block), `PanelBaseVM.js`
- **Gradient:** `GradientVM.js`, `scenario.html` (Gradient panel block), `DrawingVM.js` + `drawing-helper.js` for Distance Y
- **Horizontal Velocity:** `HorizontalVelocityVM.js`, `scenario.html` (Horizontal Velocity panel block)
- **Wells / map:** `WellVM.js`, `MapVM.js`, `ScenarioVM.js`, `scenario.html` (map + well popover)
- **Answer validation / formatting:** `ko.bindinghandlers.js` (textbox), `ko-extenders.js`, panel VM `Check*` and answer logic

---

## Data and API

- Scenario list and scenario payload (e.g. map, wells) likely come from the server; scenario structure is used in `ScenarioVM.js` (`ScenarioSelectedIndex.subscribe`, `scenario["wells"]`, `scenario["map"]`).
- Test submission: `SubmitTestResults`, `SendResults`, modals for TeamName/TestLocation and submit result. Practice mode: `AllDone`, “All Done” modal.

Use this doc when asking to implement or refine a feature: e.g. “Implement Flow Direction Step 2 using legacy `FlowDirectionVM.js` and the Flow Direction section in `scenario.html`.”
