# oniva-ui component coverage matrix

Sources actually fetched: [component.gallery](https://component.gallery/components/), [BoardUI home](https://www.boardui.com), [BoardUI components](https://www.boardui.com/components), [BoardUI license](https://www.boardui.com/license), [Base UI llms.txt](https://base-ui.com/llms.txt), [Prompt Kit llms.txt](https://www.prompt-kit.com/llms.txt), [Kibo UI](https://www.kibo-ui.com/components), [EvilCharts](https://evilcharts.com), [React Aria](https://react-spectrum.adobe.com/react-aria/components.html), [Tremor](https://tremor.so/docs/getting-started/installation).
Not fully retrievable via fetch (JS-rendered indexes): shadcn/ui, Radix, HeroUI, Tremor component list, designeer.xyz. Those columns are from well-known public docs (shadcn: https://ui.shadcn.com/docs/components, Radix: https://www.radix-ui.com/primitives, HeroUI: https://www.heroui.com/docs/components, Tremor: https://tremor.so) and should be spot-checked. Note shadcn now ships Base UI and RAC ("aria") variants of components (docs URLs `/docs/components/base/*` and `/aria/*`), and a new `Questionnaire` and `Message Scroller`.

Legend (systems): sh=shadcn, Rx=Radix, BU=Base UI, RAC=React Aria Components, Hr=HeroUI, Tr=Tremor, Bd=BoardUI, PK=Prompt Kit (Kibo UI noted in text). Priority: P0 = v0.1, P1 = v0.2, P2 = later.

## 1. Matrix

| Component | Category | Systems | Pri | React Aria to build on |
|---|---|---|---|---|
| Button | Primitives | sh Rx? BU RAC Hr Tr Bd | P0 | Button |
| Icon button | Primitives | sh BU RAC Hr Bd | P0 | Button |
| Link / Link button | Primitives | RAC Hr Bd | P0 | Link |
| Separator / Divider | Primitives | sh Rx BU RAC Hr Bd | P0 | Separator |
| Avatar | Primitives | sh Rx BU Hr Bd | P0 | none (custom, image load state) |
| Avatar group / stack | Primitives | sh Hr (Kibo avatar-stack) | P1 | none |
| Badge | Primitives | sh Hr Tr Bd | P0 | none |
| Chip / Tag (removable) | Primitives | RAC(TagGroup) Hr Bd | P1 | TagGroup / Tag |
| Close button | Primitives | Bd | P1 | Button |
| Kbd | Primitives | sh Hr | P1 | none |
| Icon wrapper | Primitives | Hr | P1 | none |
| Visually hidden | Primitives | Rx | P0 | VisuallyHidden |
| Heading / Text | Primitives | Rx(Themes) RAC(Heading, Text) | P1 | Heading, Text |
| Toggle button | Primitives | sh Rx BU RAC | P0 | ToggleButton |
| Toggle button group | Primitives | sh Rx BU RAC | P1 | ToggleButtonGroup |
| Button group | Primitives | sh Hr Bd | P1 | Group |
| Skip link | Navigation | (component.gallery) | P2 | none |
| Text input | Forms | sh Rx(themes) BU RAC Hr Tr Bd | P0 | TextField, Input |
| Textarea | Forms | sh BU RAC Hr Tr Bd | P0 | TextField, TextArea |
| Number field / Stepper | Forms | BU RAC Hr Tr | P1 | NumberField |
| Search field | Forms | RAC Hr Tr | P1 | SearchField |
| Password field | Forms | Hr | P2 | TextField |
| Input OTP | Forms | sh BU Bd | P1 | none (custom; RAC has no OTP) |
| Input group / addons | Forms | sh Bd | P1 | Group |
| Label / Field / Description / Error | Forms | sh BU RAC | P0 | Label, FieldError, Text slot=description |
| Fieldset | Forms | BU | P1 | Fieldset-ish via Group / role=group |
| Form | Forms | sh BU RAC | P0 | Form |
| Checkbox | Forms | sh Rx BU RAC Hr Tr Bd | P0 | Checkbox |
| Checkbox group | Forms | BU RAC Hr | P1 | CheckboxGroup |
| Radio group | Forms | sh Rx BU RAC Hr Bd | P0 | RadioGroup, Radio |
| Switch | Forms | sh Rx BU RAC Hr Tr Bd | P0 | Switch |
| Select | Forms | sh Rx BU RAC Hr Tr Bd | P0 | Select, ListBox, Popover |
| Combobox / Autocomplete | Forms | sh BU RAC Hr | P0 | ComboBox |
| Multi-select | Forms | Tr Hr (TagGroup based) | P1 | ComboBox + TagGroup |
| Slider (single/range) | Forms | sh Rx BU RAC Hr Tr Bd | P0 | Slider |
| Segmented control | Forms | Tr Bd Hr(Tabs) | P1 | ToggleButtonGroup (single) |
| Date field | Forms | RAC Hr | P1 | DateField |
| Date picker | Forms | sh RAC Hr Tr Bd | P1 | DatePicker |
| Date range picker | Forms | sh RAC Hr Tr | P1 | DateRangePicker |
| Time field | Forms | RAC Hr | P2 | TimeField |
| Color picker / swatch | Forms | RAC Hr | P2 | ColorPicker, ColorArea, ColorSlider |
| File upload / dropzone | Forms | PK Bd Hr(?) | P0 | DropZone, FileTrigger |
| Rating | Forms | Hr(?) | P2 | none |
| Rich text editor | Forms | (none; component.gallery) | P2 | none |
| Composer / prompt input (textarea + actions) | AI & Agent | PK Bd | P0 | TextField, Toolbar |
| Dialog / Modal | Overlays | sh Rx BU RAC Hr Bd | P0 | Modal, Dialog |
| Alert dialog / confirm | Overlays | sh Rx BU | P1 | Dialog role=alertdialog |
| Drawer / Sheet | Overlays | sh BU Hr | P1 | Modal (slide variant) |
| Popover | Overlays | sh Rx BU RAC Hr Tr | P0 | Popover, DialogTrigger |
| Tooltip | Overlays | sh Rx BU RAC Hr Bd | P0 | Tooltip, TooltipTrigger |
| Hover card / Preview card | Overlays | sh Rx BU | P1 | Popover (hover trigger) |
| Dropdown menu | Overlays | sh Rx BU RAC Hr Bd | P0 | Menu, MenuTrigger |
| Context menu | Overlays | sh Rx BU | P1 | Menu |
| Menubar | Overlays | sh Rx BU | P2 | Menu (custom) |
| Command palette | Overlays | sh (cmdk) Hr? | P1 | Autocomplete + Menu |
| Toast / Notification | Feedback | sh(Sonner) BU RAC(Toast) Hr Bd | P0 | UNSTABLE_Toast / ToastRegion |
| Tabs | Navigation | sh Rx BU RAC Hr Tr Bd | P0 | Tabs |
| Breadcrumbs | Navigation | sh RAC Hr Bd | P0 | Breadcrumbs |
| Pagination | Navigation | sh Hr Bd | P0 | none (Links/Buttons) |
| Sidebar | Navigation | sh Bd | P0 | Disclosure, Link, Tree optional |
| Navigation menu | Navigation | sh Rx BU Hr | P1 | Menu / Disclosure (no direct) |
| Navbar / Header | Navigation | Hr | P1 | Toolbar optional |
| Stepper / Progress steps | Navigation | (component.gallery) | P1 | none |
| Tree view | Navigation | RAC(Tree) | P1 | Tree |
| Accordion | Data display | sh Rx BU Hr | P0 | Disclosure, DisclosureGroup |
| Collapsible | Data display | sh Rx BU | P1 | Disclosure |
| Card | Data display | sh Hr Tr Bd | P0 | none |
| List / ListBox | Data display | RAC Hr | P1 | ListBox, GridList |
| Table | Data display | sh RAC Hr Tr | P0 | Table |
| Data table (sort/filter/select/paginate) | Data display | sh(TanStack) Hr Bd | P0 | Table + TanStack Table |
| Data grid (editable) | Data display | Bd | P2 | Table / useGrid |
| Description list / key-value | Data display | Hr? | P1 | none |
| Empty state | Feedback | sh | P0 | none |
| Skeleton | Feedback | sh Hr | P0 | none |
| Spinner | Feedback | sh Hr PK | P0 | ProgressBar indeterminate |
| Progress bar | Feedback | sh Rx BU RAC Hr Tr Bd | P0 | ProgressBar |
| Meter | Feedback | BU RAC | P1 | Meter |
| Alert / Banner / Callout | Feedback | sh Hr | P0 | none (role=alert) |
| Image | Data display | Hr | P2 | none |
| Carousel | Data display | sh Hr Bd | P2 | none |
| Calendar (single date) | Forms | sh RAC Hr Bd | P1 | Calendar |
| Range calendar | Forms | sh RAC Hr | P1 | RangeCalendar |
| Scroll area | Layout | sh Rx BU | P1 | none |
| Stack / Flex / Grid | Layout | Hr?, component.gallery Stack | P0 | none (StyleX utilities) |
| Aspect ratio | Layout | sh Rx | P2 | none |
| Resizable panels | Layout | sh | P1 | none (use react-resizable-panels) |
| Toolbar | Layout | Rx BU RAC | P1 | Toolbar |
| Layout shell (sidebar + header + content) | Layout | sh(Sidebar block) Bd | P1 | none |
| Chat container (auto-scroll) | AI & Agent | PK shadcn(Message Scroller) | P0 | none |
| Message (user/assistant, avatar, actions) | AI & Agent | PK | P0 | none |
| Markdown renderer | AI & Agent | PK | P0 | none |
| Code block (+copy) | AI & Agent | PK Kibo | P1 | none |
| Response stream (streaming text) | AI & Agent | PK | P1 | none |
| Scroll-to-bottom button | AI & Agent | PK | P1 | Button |
| Agent thinking / thinking bar | AI & Agent | PK Bd | P0 | none |
| Text shimmer | AI & Agent | PK shadcn(utils shimmer) | P1 | none |
| Tool call card | AI & Agent | PK Kibo | P0 | Disclosure |
| Steps / chain of thought | AI & Agent | PK | P1 | Disclosure |
| Agent progress (multi-step) | AI & Agent | Bd | P0 | Disclosure + ProgressBar |
| Task list (streaming log) | AI & Agent | Bd | P1 | none |
| Source / citation chip | AI & Agent | PK | P0 | Tooltip / Popover |
| Web search trail | AI & Agent | Bd | P1 | Disclosure |
| Composer attachments (tiles w/ upload ring) | AI & Agent | Bd PK | P1 | GridList |
| Composer loader (orbiting light) | AI & Agent | Bd | P1 | none |
| Composer panel (model, effort, permission modes) | AI & Agent | Bd | P1 | Select, ToggleButtonGroup |
| Agent limits / context window usage | AI & Agent | Bd | P0 | Meter / ProgressBar |
| Model selector | AI & Agent | Bd(Dropdown) Kibo | P1 | Select |
| Questionnaire (plan-mode Qs) | AI & Agent | Bd sh | P1 | RadioGroup, CheckboxGroup |
| Feedback bar (thumbs) | AI & Agent | PK | P1 | ToggleButton |
| System message banner | AI & Agent | PK | P1 | none |
| JSX / generative UI preview | AI & Agent | PK | P2 | none |
| Image generation loader / gallery | AI & Agent | Bd | P2 | none |
| Agent creator / avatar + voice | AI & Agent | Bd | P2 | none |
| Reasoning / sources / suggestions (Kibo AI) | AI & Agent | Kibo | P2 | none |
| Stat card (KPI + delta chip) | Dashboard widgets | Tr Bd | P0 | none |
| Delta / trend badge | Dashboard widgets | Tr Bd | P1 | none |
| Progress ring / activity rings | Dashboard widgets | Bd | P0 | Meter / ProgressBar |
| Category bar / spark bar | Dashboard widgets | Tr | P1 | Meter |
| Legend | Dashboard widgets | Tr | P1 | none |
| Notification center (inbox) | Dashboard widgets | Bd | P1 | Tabs, GridList |
| Meeting schedule / booking flow | Dashboard widgets | Bd | P1 | Calendar, ListBox |
| Event calendar (month view with events) | Dashboard widgets | Bd | P1 | Calendar (base), custom grid |
| Settings modal (multi-page) | Dashboard widgets | Bd | P1 | Modal, Tabs |
| Contribution heatmap | Dashboard widgets | Bd | P1 | none |
| Health widgets (sleep score, steps, alerts) | Dashboard widgets | Bd | P2 | Meter |
| Auth card (sign-in) | Dashboard widgets | Bd sh(blocks) | P1 | Form, TextField |
| Line chart | Charts | Tr Bd Evil | P0 | none |
| Bar chart | Charts | Tr Bd Evil | P0 | none |
| Area chart | Charts | Tr Bd Evil | P0 | none |
| Donut / pie chart | Charts | Tr Evil | P0 | none |
| Sparkline | Charts | Tr | P1 | none |
| Combo chart | Charts | Tr Bd | P1 | none |
| Scatter / bubble | Charts | Tr Bd Evil | P1 | none |
| Radar | Charts | Bd Evil | P1 | none |
| Radial / gauge | Charts | Bd Evil | P1 | none |
| Heatmap | Charts | Bd Evil | P1 | none |
| Funnel | Charts | Tr Bd | P1 | none |
| Sankey | Charts | Bd | P2 | none |
| Treemap | Charts | Evil | P2 | none |
| Chart card / tooltip / legend shell | Charts | Tr Bd | P0 | Tooltip patterns |
| Dashboard template | Templates | Bd(Pro) Tr(Blocks) | P1 | none |
| AI chat template | Templates | Bd PK | P1 | none |
| Finance / marketing / medical dashboards | Templates | Bd(Pro) | P2 | none |
| Multi-agent chat template | Templates | Bd(Pro) | P2 | none |

Counts: 144 rows; P0 = 54, P1 = 70, P2 = 20.

Systems caveat: "?" or "Hr?" means uncertain from memory; verify. Radix has no Avatar-less equivalents of RAC date/color; Radix Primitives and shadcn lists are from public docs knowledge.

## 2. BoardUI signature components

Per [components index](https://www.boardui.com/components): 85 components (2 foundations, 30 Base, 18 blocks, 18 charts, 10 templates, remainder).
Unique vs shadcn/RAC:
- Agent set: Agent Thinking, Agent Progress, Agent Limits (context window + plan limits), Task List (streaming log), Web Search trail, Questionnaire, Agent Creator, Composer Panel / Loader (orbiting light) / Attachments (upload rings).
- Dashboard: Stat Cards (delta chips), Data Table, Data Grid (editable spreadsheet w/ summaries), Notification Center, Settings Modal, Calendar with event pills, Meeting Schedule.
- Health/playful charts: Activity Rings, Sleep Score, Steps, Most Active Days, Contributions heatmap.
- Chart cards (Recharts, 18): Revenue, Area, Combo, Earnings, Funnel, Heatmap, Radar, Radial, Line, Sankey, Scatter, Stage Bars, plus above.
- Stack per homepage: React 19.2, Tailwind v4, React Aria 1.17, TanStack Table 8.21, Recharts, Motion, Remix Icon; MCP install; 400+ tokens.

### License finding
- Free tier repo: https://github.com/BoardUI/boardui . Per [license page](https://www.boardui.com/license) (updated 2 Sep 2026): free source "published on GitHub under the MIT licence"; homepage also says "one public repo under the MIT license". CLI on npm is MIT. Pro source is a separate paid license.
- Caution: the license page forbids using Source to build a competing component library/design system/kit offered to others, and forbids redistributing recognisable derivatives of Pro source. The MIT free-tier text allows reuse, but the page says it also applies where MIT is silent. Recommendation: clean-room implement oniva-ui from patterns/behaviors (this matrix), do not copy BoardUI Pro or its markup/tokens; verify the actual LICENSE file in the repo before copying any free-tier code. I did not open the repo itself.

## 3. Chart types (Tremor / BoardUI / EvilCharts)

EvilCharts ([site](https://evilcharts.com)) is Recharts + ECharts, shadcn-styled, animated. Tremor chart list from public docs knowledge (Area, Bar, Line, Donut, Bar List, Progress/Tracker, Spark charts, Category bar, Combo); BoardUI list fetched.

| Chart | Tr | Bd | Evil | Pri |
|---|---|---|---|---|
| Line | y | y | y | P0 |
| Bar (vertical/horizontal, stacked) | y | y (Earnings) | y | P0 |
| Area (stacked/100%) | y | y | y | P0 |
| Donut / pie | y | via Radial | y | P0 |
| Sparkline (line/area/bar) | y | - | partial | P0 |
| Bar list (ranked) | y | Stage Bars-like | - | P1 |
| Combo (bar + line dual axis) | y | y | partial | P1 |
| Scatter / bubble | y | y | y | P1 |
| Radar | - | y | y | P1 |
| Radial / gauge / speedometer | - | y | y | P1 |
| Heatmap (matrix + calendar-year) | - | y | y | P1 |
| Funnel | - | y | y | P1 |
| Progress ring / activity rings | - | y | - | P0 (as widget) |
| Category bar / tracker | y | - | - | P1 |
| Sankey | - | y | - | P2 |
| Treemap | - | - | y | P2 |

Recommendation: build chart layer on Recharts (MIT, used by BoardUI, Evil, shadcn) wrapped in StyleX-tokenised ChartCard / ChartTooltip / ChartLegend; ship 5 base charts + sparkline + ring (~8 incl. donut) at v0.1.
