# Loop 5 gap list (not yet in oniva-ui)

Diffed against folders in `packages/oniva-ui/src/{components,charts,ai,widgets}` as of this loop. Rows tagged "(upgrade)" exist but need the named capability. Priority: P0 next loop, P1, P2. Motion column references recipe # in `loop5-motion-recipes.md`.

Source keys: AE = AI Elements (elements.ai-sdk.dev), PK = prompt-kit, KB = Kibo UI, AU = assistant-ui, CU = Cult UI, MU = Magic UI, AN = Animate UI, MP = Motion-Primitives, RB = React Bits, BD = BoardUI, KO = Kobra, AR = Arc (uiarc), BE = beUI, TD = transitions.dev, EC = EvilCharts.

## A. AI & Agent
| Name | Source | Pri | Motion / notes |
|---|---|---|---|
| Reasoning (collapsible, auto-open while streaming, auto-close after, duration label) | AE, PK, KO | P0 | accordion #21 + shimmer #15 trigger |
| ChainOfThought timeline (steps w/ status dots, collapsible) | AE, PK, KO | P0 | step fade-up 12px/40ms stagger #18 |
| ThinkingStates (status line that rotates "Reading files...") | TD, PK | P0 | #28 |
| ReasoningStream ticker (2-line scrolling viewport) | TD | P1 | #29 |
| StreamingWords (per-word blur-in; ResponseStream upgrade) | TD, KO | P0 | #30 |
| Artifact panel (header, title, actions, content, close) | AE | P0 | slide+fade #7 |
| Canvas / AI side panel (resizable, doc + chat) | AR, CU | P1 | panel #7 |
| InlineCitation hover card with pager (Citation upgrade) | AE, KO | P1 | tooltip #17 |
| Sources collapsible ("Used 6 sources") | AE, PK | P0 | accordion #21 |
| Suggestions (prompt suggestion chips row, scrollable) | AE | P0 | stagger in 40ms |
| PromptInput full (tools menu, model, speech, submit/stop morph; Composer upgrade) | AE, PK, AR | P1 | icon swap #9 |
| SpeechInput (mic button w/ recording state) | AE | P0 | pulse ring |
| AudioWaveform / live visualizer | AE | P0 | bars scaleY by amplitude |
| VoiceOrb (state orb: idle/listening/thinking/speaking) | CU, AE Persona | P0 | #50 |
| Persona / agent avatar with state animation | AE | P1 | #50 |
| AudioPlayer (scrub, speed, waveform) | AE | P1 | - |
| Transcription (word-synced highlight) | AE | P1 | colour wipe per word |
| MicSelector | AE | P2 | - |
| VoiceSelector | AE | P2 | - |
| Confirmation / ToolApproval card (approve, deny, always allow) | AE, KO | P0 | #6-style, confirm morph #49 |
| PlanCard (steps agent asks to run, approve/edit) | AE, KO | P0 | list stagger |
| Queue (pending messages + todos) | AE | P1 | sortable layout #48 |
| Checkpoint (restore marker in thread) | AE | P1 | - |
| ContextMeter (token usage popover, cost) | AE | P0 | ring fill 400ms |
| TokenCounter (live count in composer) | AE | P0 | reel #26 |
| FileDiff / DiffViewer (agent proposes file change, accept/reject hunks) | KO, AE | P0 | hunk collapse #21 |
| AgentFileTree (touched files, status badges) | AE, AN, MU | P1 | branch spring |
| MessageBranch (< 2/3 > version switcher) | AE, AU | P0 | page slide #8 |
| ModelCompare (side-by-side streams) | custom | P1 | synced scroll |
| TypingIndicator (3 dots / matrix) | PK, TD | P0 | #31 |
| StreamingTable (rows resolve in) | custom | P2 | row blur-in |
| MemoryPanel (saved facts, edit/forget) | custom | P1 | list remove closes gap |
| MCPServerList (status, tools count, toggle) | custom | P1 | status pill morph |
| AgentStatusPill (idle/working/waiting/error) | custom | P0 | text swap #4 + shimmer |
| RunLog / Terminal (streaming stdout, ANSI, autoscroll) | AE Terminal, MU Terminal | P0 | line fade-in |
| StackTrace | AE | P2 | - |
| TestResults | AE | P2 | - |
| Sandbox (code run panel w/ tabs) | AE | P2 | - |
| WebPreview (browser chrome + iframe + console) | AE | P1 | - |
| JSXPreview / generative UI renderer | AE, PK, AU | P2 | - |
| ImageGenGrid (progressive reveal, dot noise to image) | TD, KO | P0 | #51 |
| AgentRun timeline (steps, tool calls, durations) | AR | P1 | rail draw |
| WorkflowCanvas (nodes, animated edges, controls) | AE | P2 | animated edge dash |
| AgentSuggestCardStack (suggestions w/ progress, commit) | CU | P1 | stack #32 |
| PromptLibrary / Instructions popover | CU | P2 | - |
| MessageActions (copy, regenerate, like, share, branch) | AE, PK | P0 | icon swap #9 |
| ScrollToBottom button (ChatContainer upgrade) | PK, AE | P1 | fade+y 8px |
| ThreadList / ChatHistory sidebar | AU, KO | P1 | row slide |
| Attachment preview hover/lightbox | AU, KO | P1 | image open tilt |
| OpenInChat menu (open in ChatGPT/Claude) | AE | P2 | - |
| SchemaDisplay / PackageInfo / EnvVars / Snippet / Commit | AE | P2 | - |
| MultiAgentChat (handoff chips, agent lanes) | BD | P1 | - |
| AgentCreator wizard | BD | P2 | page slide #8 |
| GhostText inline completion (tab to accept) | custom | P1 | fade |
| ReasoningEffort selector (low/med/high) | AE ModelSelector | P2 | segmented |
| ToolUI registry (generative widgets per tool) | AU | P2 | - |
| AIEditor w/ agent cursor | KO | P2 | caret glide |
| CollabCursor / presence avatars | KB Cursor, CU | P2 | spring follow |
| WelcomeScreen / ChatStarter (greeting + suggestions) | BD | P1 | texts reveal #18 |
| BranchableHistory (chat fork tree) | AU | P2 | - |
| CitationFootnotes list | AE | P1 | - |
| FeedbackThanks (thumbs reason sheet) | PK | P2 | - |

## B. Motion primitives
| Name | Source | Pri | Motion spec |
|---|---|---|---|
| AnimatedNumber (NumberFlow-style) | TD, MU, BE | P0 | #2, #26, #43 |
| SpinningCounter reel | TD | P1 | #26 |
| RollingText / TextRoll | MP, BE | P1 | char y roll 250ms stagger 30ms |
| TextScramble / HyperText | MU, MP, BE | P1 | #44 |
| TextMorph | MP, AR | P1 | char shared layout |
| TextReveal (blur/word/line/wipe) | TD | P0 | #18, #56 |
| WordRotate | MU | P2 | vertical swap #4 |
| Typewriter | MU, CU | P2 | - |
| MagneticButton | BE, MP | P1 | #41 |
| SpotlightCard / MagicCard | MU, MP | P1 | radial-gradient at pointer |
| GlareCard / TiltCard | TD, BE, MU | P1 | #19 |
| BorderBeam / ShineBorder | MU, CU | P0 | #42 |
| GlowEffect | MP | P2 | animated conic blur |
| Marquee | MU, KB, AR | P0 | #46 |
| AnimatedTabs indicator (Tabs upgrade, shared layout) | TD, BE, MP | P0 | #16 |
| ExpandableTabs | BE | P1 | pill expand |
| MorphingPopover | MP, BE, AR | P1 | #55 |
| MorphingDialog (shared element) | MP, BE | P1 | #37 |
| DynamicIsland | CU, BE | P0 | #36 |
| ToastStack Sonner-style (Toast upgrade) | TD, BE, KO | P0 | #32 |
| BottomSheet w/ drag, snap points | BE, KO, AR | P0 | #47 |
| BouncyAccordion (Accordion upgrade) | BE, TD | P1 | #21 |
| SortableList (layout reorder) | BE, AN, CU | P1 | #48 |
| Ripple / RippleButton | MU, AN | P2 | radial scale 600ms |
| Confetti | MU, TD | P1 | canvas physics |
| SkeletonReveal (crossfade) | TD, KO | P0 | #14 |
| Dock | MU, BE, AR | P2 | magnify by distance |
| AvatarGroup hover falloff | TD, MU | P1 | #11 |
| CardStack hover fan | TD, AR | P2 | spring fan |
| LikeButton burst | TD | P2 | #23 |
| SuccessCheck / SpinnerToCheck | TD | P0 | #10 |
| ErrorShake (Field upgrade) | TD, BE | P0 | #12 |
| InputDissolve (SearchField clear) | TD, KO | P2 | #13 |
| ThemeToggle view-transition | MU, BE | P1 | #39 |
| WheelPicker | AR | P2 | #53 |
| PullToRefresh | AR, BE | P2 | #54 |
| SwipeActions row | AR, BE | P1 | drag reveal |
| HoldToConfirm / ConfirmMorph | AR | P1 | #49 |
| CopyButton icon swap | AR, AN | P0 | #9 |
| ActionSwap (CTA text/icon blur swap) | BE | P1 | #4 |
| ProgressiveBlur edge | MU | P1 | masked backdrop-blur ramp |
| ScrollProgress | MU, AR | P1 | scroll-timeline |
| ShimmerButton / Pulsating / Rainbow | MU | P2 | - |
| AnimatedBeam (integration lines) | MU | P2 | path gradient travel |
| OrbitingCircles | MU | P2 | - |
| Globe / DottedMap | MU, CU | P2 | webgl / canvas |
| Meteors / Particles / Warp | MU | P2 | - |
| AuroraText / GradientText / ShinyText | MU, RB | P1 | bg-position loop |
| Highlighter (marker stroke) | MU | P2 | clip draw |
| Lens (magnifier) | MU | P2 | - |
| SmoothCursor / Pointer | MU | P2 | spring |
| ArcPicker / CylinderCarousel / CoverFlow | BE, AR | P2 | 3D |
| SharedLayoutBg (hover pill list) | BE | P0 | #38 |
| ExpandableControl / AdaptiveStepper | BE | P2 | - |
| LiquidTabBar / GlassMenu | AR | P2 | - |
| Loader pack (dots, bars, matrix, comet, ascii) | BE, TD, AR | P0 | #31, #57 |
| ShaderBackground (mesh, grain, warp) | BE, CU, RB | P2 | WebGL |
| FlickeringGrid / DotPattern / NoiseTexture | MU | P2 | - |
| InfiniteSlider | MP | P1 | marquee variant |
| ImageComparison slider | MP, AR | P1 | clip drag |
| FlipCard | AN | P2 | rotateY 600ms |
| RadialMenu | AN | P2 | polar stagger |
| ElasticSlider | AR | P2 | - |
| NumberField limit pushback | - | P2 | rubber-band |
| OTP digit roll + gliding ring + success sweep (InputOTP upgrade) | BE, KO, BD | P0 | #34, #35 |

## C. Charts
| Name | Source | Pri | Notes |
|---|---|---|---|
| Entrance reveal system (clip wipe / bar grow / draw-on) for all charts | EC | P0 | #59 |
| Gradient + glow + SVG pattern fills (dots, lines, grid) | EC | P0 | defs library |
| Chart brush / zoom range | EC, AR | P1 | draggable window |
| Scrub crosshair tooltip with rolling values | - | P0 | #60 |
| PieChart (full, gradient, glow) | EC | P1 | - |
| Semi-circle radial | EC | P1 | - |
| Stacked / grouped / blocks bar variants | EC | P0 | - |
| Streamgraph | AR | P2 | - |
| Waffle | AR | P2 | - |
| Slope chart | AR | P2 | - |
| Ridgeline | AR | P2 | - |
| Treemap (morphing) | BE, AR | P1 | tile tween |
| Sunburst | AR | P2 | - |
| RaceBar (animated ranking) | AR | P2 | layout |
| Realtime stream line | AR | P1 | shift left |
| VolumeProfile | BE | P2 | - |
| StatusBar history (Tracker upgrade w/ tooltips) | BE | P2 | - |
| Candlestick / OHLC | custom | P2 | - |
| Waterfall (MRR) | AR | P1 | - |
| Bullet chart | Tremor | P2 | - |
| Histogram / Boxplot | custom | P2 | - |
| Bump chart | custom | P2 | - |
| Cohort retention heatmap | AR | P1 | - |
| Choropleth / world map | AR | P1 | topojson |
| Connected scatter / line replay | AR | P2 | - |
| Small multiples | AR | P2 | - |
| Dumbbell / lollipop | custom | P2 | - |
| Marimekko | custom | P2 | - |
| Network graph | custom | P2 | - |
| Chart annotations / reference lines | EC | P1 | - |
| Donut morph between periods | TD | P0 | #33 |
| Analytics gradient-stroke line w/ floating cards | CU | P2 | - |
| Dots / point markers primitive | EC | P2 | - |
| Chart background patterns primitive | EC | P1 | - |

## D. Blocks / marketing
| Name | Source | Pri | Notes |
|---|---|---|---|
| Pricing table + billing toggle | AR | P0 | - |
| Pricing calculator / usage pricing | AR | P1 | slider + rolling total |
| Plan comparison / comparison table | AR | P1 | - |
| Testimonials wall (marquee) | MU, KB | P1 | #46 |
| Logo cloud / logo carousel | KO, AR | P0 | - |
| Feature grid | AR | P0 | - |
| Feature bento | MU, AR | P0 | - |
| CTA section | AR | P0 | - |
| Footer | AR | P0 | - |
| Site header (nav + mega menu) | AR | P0 | - |
| Hero (centered, split, product-shot, signup) | AR, CU | P0 | - |
| FAQ section | AR | P1 | accordion |
| Stats band | AR | P1 | counters |
| Changelog feed | AR | P1 | - |
| Waitlist / newsletter signup | AR | P0 | success check |
| Contact section | AR | P2 | - |
| Blog grid / article card | AR | P2 | - |
| Announcement bar | AR | P1 | - |
| Sign in / sign up / centered / split / immersive | AR, BD | P1 | - |
| Onboarding multi-step | AR, CU | P1 | page slide |
| Checkout summary + cart drawer | AR | P2 | counting total |
| Product listing / detail | AR | P2 | - |
| Help center / search results | AR | P2 | - |
| Settings page + security + API keys + webhooks + roles | AR | P1 | - |
| Integrations grid | AR | P1 | - |
| Billing overview + usage meter | AR | P1 | - |
| Cancel flow | AR | P2 | - |
| Feature voting / poll | CU | P2 | - |
| Scroll story / sticky feature section | AR, CU | P2 | - |

## E. Data / dashboard / core extras
| Name | Source | Pri | Notes |
|---|---|---|---|
| Kanban board (drag, WIP) | KB, CU, AR | P0 | #48 |
| Timeline / activity timeline | AR, KB | P0 | - |
| Gantt / Roadmap | KB | P1 | - |
| DataGrid (sort, filter, resize, edit, virtual) | BE, BD | P0 | DataTable upgrade |
| Spreadsheet cell grid | - | P2 | - |
| FilterBar / FilterToolbar (chips w/ operators) | AR, KO | P0 | - |
| DateRange presets (DateRangePicker upgrade) | BE | P0 | - |
| KPI strip / MetricCard drilldown | AR | P0 | counters |
| Leaderboard | custom | P1 | rank layout anim |
| World map / geo | MU, AR | P1 | - |
| Invoice studio / invoice view | AR | P2 | - |
| Chat inbox / support conversation / inbox triage | AR | P1 | row removal closes gap |
| Comment thread | AR | P1 | - |
| JSON viewer | AR | P1 | - |
| TimePicker | AR | P1 | - |
| ColorPicker (morph trigger) | BE, KB, KO | P1 | - |
| Rating / stars | custom | P1 | - |
| AvatarGroup | KB, MU | P0 | #11 |
| Carousel | KO, BD | P0 | - |
| Lightbox / ImageViewer | AR, KO | P1 | - |
| QRCode | KB, KO | P2 | - |
| Countdown | AR | P2 | - |
| TagInput / MentionInput / MoneyInput / PhoneInput | AR | P1 | - |
| PasswordField + strength | AR | P1 | - |
| InlineEdit | AR | P1 | - |
| ShortcutRecorder | AR | P2 | - |
| RichTextEditor | AR | P2 | - |
| SignaturePad | AR | P2 | - |
| TeamDirectory / team members | AR | P2 | - |
| Org chart | custom | P2 | - |
| ShareAccess dialog | AR | P1 | - |
| LinkUnfurl card | AR | P2 | - |
| NowPlaying / MediaPlayer | AR | P2 | - |
| Floating toolbar / expandable toolbar | CU, BE | P2 | - |
| Announcement / ActivityFeed | AR | P1 | - |
| Metrics dashboard block | AR | P1 | - |
| Project board | AR | P2 | - |
