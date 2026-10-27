# Loop 5 motion recipes

Provenance tags: **[T]** = published verbatim in transitions.dev `_root.css` / skill files (github Jakubantalik/transitions.dev). **[K]** = published in Kobra's agent doc (kobra.systems/install.md). **[B]** = read from beUI OTP source (beui.dev). **[C]** = Cult UI docs. **[U]** = Arc/uiarc docs (preset names only, no numbers). **[I]** = inferred / typical value from the named library; not verified, tune in the lab.

Global rules (adopt as oniva tokens):
- Entrances 150-250ms on ease-out-expo-ish, exits shorter (60-70% of enter). Animate only transform / opacity / filter(blur) / grid-template-rows / clip-path. [K][T]
- Everything has a `prefers-reduced-motion` branch: remove transform + blur, keep a <=150ms opacity fade (or 0ms for loops, which freeze). [K][T]
- Press: scale ~0.97-0.99 on the surface, label stays put. [K]
- Counters use `tabular-nums`. [K]

## Token scale (from transitions.dev) [T]
| Token | Value |
|---|---|
| duration stagger / micro / quick / fast / medium / slow / very-slow | 40 / 80 / 150 / 250 / 350 / 400 / 500 ms |
| ease-smooth-out (default for nearly everything) | cubic-bezier(0.22, 1, 0.36, 1) |
| ease-bounce (badge pop) | cubic-bezier(0.34, 1.36, 0.64, 1) |
| ease-bounce-strong (avatar return) | cubic-bezier(0.34, 3.85, 0.64, 1) |
| ease-in-out (swaps, shimmer reveal) | ease-in-out |
| ease-out (tooltips) / linear (shimmer, pulse, spinner) | ease-out / linear |
| distances micro/small/base/medium/large | 4 / 6 / 8 / 12 / 30 px |
| scales | 0.96 modal, 0.97 dropdown, 0.98 tooltip, 0.99 dropdown-close |
| blur | 2px small, 3px medium, 8px large (success check) |
Kobra alt: ease-out `cubic-bezier(0.23,1,0.32,1)` entry 150-250ms, ease-exit `cubic-bezier(0.4,0,0.6,1)`. [K]

## Recipes
Columns: purpose | properties | duration | easing / spring | stagger | interruptibility | reduced-motion

| # | Recipe | Purpose | Properties | Duration | Easing / spring | Stagger | Interruptible | Reduced motion |
|---|---|---|---|---|---|---|---|---|
| 1 | Card resize [T] | Content-driven height/width change | width/height (or FLIP transform) | 300ms | (0.22,1,0.36,1) | - | Yes (retarget) | instant |
| 2 | Number pop-in [T] | Digit appears/changes | translateY 8px, blur 2px, opacity | 500ms | (0.34,1.45,0.64,1) | 70ms/digit | Yes, per digit | opacity only |
| 3 | Notification badge [T] | Count badge appears | diagonal slide (-8.2px, 12.4px) 260ms, pop scale 500ms, fade 400ms, blur 2px | 260-500; close 180 | slide (0.22,1,0.36,1); pop (0.34,1.36,0.64,1); close (0.4,0,0.2,1) | - | Yes | fade only |
| 4 | Text swap [T] | Label/status swap | translateY 4px + blur 2px + opacity | 150ms | ease-in-out | - | Yes | opacity |
| 5 | Menu dropdown [T] | Origin-aware menu | scale 0.97 -> 1, opacity; close scale 0.99 | open 250 / close 150 | (0.22,1,0.36,1) | - | Yes | opacity |
| 6 | Modal [T] | Dialog | scale 0.96, opacity | open 250 / close 150 | (0.22,1,0.36,1) | - | Yes | opacity |
| 7 | Panel reveal [T] | Bottom/side panel | translateY 100px, blur 2px | open 400 / close 350 | (0.22,1,0.36,1) | - | Yes | opacity |
| 8 | Page side-by-side [T] | Wizard / route step | translateX 8px, blur 3px, fade 250ms | 250ms | (0.22,1,0.36,1) both | 0 | Yes | opacity |
| 9 | Icon swap [T] | Copy -> check, play -> pause | scale from 0.25, blur 2px, opacity | 250ms | ease-in-out | - | Yes | opacity |
| 10 | Success check [T] | Confirmation | opacity 500, rotate from 80deg 500, y-bob 40px 500, blur from 10px 500, SVG path draw 500 delayed 80ms | 500ms | all (0.22,1,0.36,1) except bob (0.34,1.35,0.64,1) | path +80ms | No (one shot) | static check |
| 11 | Avatar group hover [T] | Distance-falloff lift | lift -4px, scale 1.05, neighbours follow x0.45 falloff | 320ms | in (0.22,1,0.36,1), out (0.34,3.85,0.64,1) | - | Yes | none |
| 12 | Error shake [T] | Validation error | translateX segments 6px / overshoot 4px, 80ms + 60ms segs, auto-revert after 3000ms, revert 280ms | ~300ms | (0.22,1,0.36,1) | - | Re-trigger restarts | red border only, no movement |
| 13 | Input clear dissolve [T] | Clear value | per-word out fly 12px + blur 2px (400ms) then in (400ms); glow peak at 0.15, opacity 0.42 | 1000ms total | (0.22,1,0.36,1) | per word | Yes | instant clear |
| 14 | Skeleton -> content [T] | Loading handoff | pulse 1000ms linear opacity min 0.5, then content reveal 400ms blur 2px | 400ms reveal | ease-in-out | - | Yes | crossfade 150ms |
| 15 | Shimmer text [T] | Pending label | background-position sweep, band 400%, base #7c7c7c highlight #0d0d0d | 2000ms loop | linear | - | n/a | static base colour |
| 16 | Tabs sliding [T] | Active pill | pill translateX/width, text colour | 250ms | (0.22,1,0.36,1) | - | Yes (retarget) | instant |
| 17 | Tooltip [T] | Hint | scale 0.98, opacity; delay 80ms; out 50ms; moving between triggers 160ms | in 150 / out 50 | ease-out; move (0.22,1,0.36,1) | - | Yes | opacity |
| 18 | Texts reveal [T] | Headline lines | translateY 12px, blur 3px | 500ms | (0.22,1,0.36,1) | 40ms/line | n/a | opacity |
| 19 | Card tilt [T] | 3D hover | perspective 1000px; follow 400ms; return 1000ms; glare opacity 0.32, fade 300ms; pointer tracked on flat OUTER wrapper (avoid edge flicker) | follow 400 / return 1000 | (0.22,1,0.36,1) | - | Yes | disabled |
| 20 | Plus -> menu morph [T] | FAB opens menu | radius 40 -> 20px, rotate 45deg, slide 40px, scale 0.97, blur 2px, content fade 200ms | open 350 / close 250 | open (0.34,1.25,0.64,1), close (0.22,1,0.36,1) | - | Yes | fade |
| 21 | Accordion [T] | Disclosure | grid-template-rows 0fr -> 1fr; chevron 250ms | 250ms | (0.22,1,0.36,1) | - | Yes | instant |
| 22 | Toast [T] | Notification | translateY 16px, blur 2px, scale 0.97 | open 350 / close 250 | (0.22,1,0.36,1) | - | Yes | opacity |
| 23 | Like button [T] | Delight | fill 150ms, heart pop 350ms, 2.5px particles travel 20px over 600ms | 350-600ms | pop (0.34,1.96,0.64,1) | particles radial | One shot | fill only |
| 24 | Learn-more hover [T] | Chevron nudge | translateX 2px, spread 8deg | 350ms | (0.22,1,0.36,1) | - | Yes | none |
| 25 | Checkbox draw [T] | Check | box 150ms, stroke-dashoffset draw 350ms, uncheck 150ms | 350ms | (0.22,1,0.36,1) | - | Yes | instant |
| 26 | Spinning counter / reel [T] | Odometer | per-digit translateY in 30px cells, blur 3px mid-spin | 1400ms | (0.16,1,0.3,1) | 90ms/column | Yes | instant value |
| 27 | Toggle [T] | Switch | thumb travel 14.66px with 1px overshoot then 0px (double bounce) | 350ms | (0.34,1.35,0.64,1) | - | Yes | instant |
| 28 | Thinking states [T] | Agent status line | hold 2000ms, swap out/in 150ms with 50ms gap, y 8px, blur 2px, shimmer 2000ms | 150ms swap | ease-in-out | - | Yes | static text, no shimmer |
| 29 | Reasoning stream [T] | Scroll 2 visible lines of reasoning | translateY step per `lines`(2) every 840ms hold, 500ms step, 28px top/bottom mask fade | 500ms step | (0.22,1,0.36,1) | - | Pausable | show last N lines static |
| 30 | Streaming text [T] | Word-by-word reveal | per-word opacity + 1px blur, 350ms fade, 60ms gap | 350ms/word | (0.22,1,0.36,1) | 60ms | Append-safe | instant append |
| 31 | Matrix dot loader [T] | 16-dot loader | colour pulse #d9d9d9 -> #85858f, 4 delay-pattern variants | 1200ms cycle | ease-in-out | per-dot delay (--d ms) | n/a | freeze one pattern |
| 32 | Banner / toast stacking [T] | Stack with peek | open 350 / close 250; rise 60px; peek 12px; spread gap 8px; depth scale 0.06, depth fade 0.4; depth blur 1px / 2px | 350ms | (0.22,1,0.36,1) | depth-based | Yes | no stack motion |
| 33 | Donut morph [T] | Chart data change | segments tween 400ms, gap 3px, corner 2px, label fade 150ms | 400ms | (0.22,1,0.36,1) JS tween | - | Yes (retarget) | instant |
| 34 | Morphing OTP slot digit [B] | OTP entry | digit enter: y 6px, rotateX -35deg, blur 2px; exit: y -2px, rotateX 15deg, blur 2px; origin center bottom, perspective 240px | spring duration 0.3 bounce 0.2 | spring | paste sweep 45ms/slot (0.4s); success sweep 48ms/slot (0.42s) | Yes | opacity only |
| 35 | Gliding focus ring [B] | OTP / segmented focus box | shared box x/y/w/h springs between slots; opacity 200ms (0.22,1,0.36,1) | spring duration 0.3 (0.42 on sweep) bounce 0.18 | spring | - | Yes | duration 0 |
| 36 | Dynamic Island [C] | Status shell morph | width/height/radius spring between 14 presets (default, compact, compactLong, compactMedium, large, long, medium, tall, ultra, massive, minimalLeading, minimalTrailing, reset, empty) + queued `{size, delay}` steps | spring [I] ~0.5s bounce 0.3 | spring | content blur crossfade | queue + isAnimating | jump, no morph |
| 37 | Morphing modal height [beUI] | Multi-view dialog | single panel animates height between inner views, blur crossfade | [I] 300-400ms | spring or (0.22,1,0.36,1) | - | Yes | instant |
| 38 | Shared-layout hover pill [U][beUI] | Nav / list hover | one pill via layoutId glides between items, blur enter/exit | [I] spring 0.3 bounce 0.15 | spring | - | Yes | instant |
| 39 | Theme toggle via View Transitions [beUI][magicui] | Theme swap | clip-path circle/rect/polygon (star, hexagon...) reveal from click origin; shutter slats variant | [I] 500-700ms | ease-in-out | slats stagger | n/a | no transition |
| 40 | Press-spring button [beUI][K] | Tactile | scale 0.97-0.99 on surface only; Stateful: label turns out + spinner turns in (never swap to "Saving...") | 100-150ms | spring | - | Yes | none |
| 41 | Magnetic button / dropzone [beUI][K] | Pointer attraction | translate toward pointer within radius, spring back | [I] spring stiffness ~150 damping ~15 | spring | - | Yes | disabled |
| 42 | Border beam / shine border [magicui] | Attention ring | conic/offset-path highlight orbiting the border, mask-composite to show ring only | [I] 6-12s loop linear | linear | - | n/a | static border |
| 43 | Number ticker [magicui][beUI] | Count-up | spring value 0 -> n on in-view; rolling ticker variant | [I] spring damping 60 stiffness 100 | spring | per-digit | Yes | show final |
| 44 | Text scramble / hyper text [magicui][beUI] | Hacker reveal | random glyph cycle then settle left-to-right | [I] 30-50ms tick, ~600-900ms total | linear ticks | per char | restart | show final |
| 45 | Blur fade in-view [magicui] | Section reveal | opacity + blur 6px + y 6px on viewport entry | [I] 400ms | ease-out | 40-100ms | n/a | opacity |
| 46 | Marquee [magicui][kibo] | Logos / testimonials | translateX -100% loop, pause on hover | [I] 20-40s | linear | - | pause on hover/focus | pause (static row) |
| 47 | Drawer / bottom sheet [beUI][Vaul] | Mobile sheet | drag y with inertia, snap points, glass surface, velocity-based dismiss | [I] spring stiffness 400 damping 40 | spring | - | Yes | slide -> fade |
| 48 | Sortable list [beUI][animate-ui] | Reorder | layout spring, drag handle, keyboard reorder, aria-live announcements, undo | [I] spring 0.35 bounce 0.1 | spring | - | Yes | instant swap |
| 49 | Confirm morph / hold-to-confirm [U] | Destructive ask-in-place | button morphs into Cancel/Confirm pair with undo; hold fills ring | [I] hold 600-800ms | linear fill | - | release cancels | tap-twice |
| 50 | Voice orb [U][cult AI Blob Warp] | Voice agent state | shader/blob scale + warp driven by amplitude; states idle/listening/thinking/speaking | continuous | amplitude lerp [I] | - | live | static gradient circle |
| 51 | Image-gen placeholder [T] | AI image loading | dot noise wakes, then resolves into image | [I] ~800-1200ms | ease-in-out | dot field | Yes | crossfade |
| 52 | Smoky dissolve delete [T, Pro] | Destructive delete | image shreds, falls, smoke | [I] ~900ms | - | per shard | one-shot | fade out |
| 53 | Wheel picker [U] | Time/date wheel | 3D drum on native scroll with snap; rotateX by distance from centre | momentum | native | - | Yes | flat list |
| 54 | Pull-to-refresh [U] | Mobile refresh | drag resistance, threshold feedback, async hold | [I] spring | spring | - | Yes | button |
| 55 | Gooey popover [U] | Liquid popover | SVG goo filter neck between trigger and panel; crisp content fades on top | [I] 400ms | spring | - | Yes | plain scale/fade |
| 56 | Pixel-mask text reveal (title reveal) | Titles | reveal by blur, word, line, or wipe | [I] 500ms | (0.22,1,0.36,1) | 40ms | n/a | opacity |
| 57 | Newton/ASCII loaders [U] | 17 loader variants | spinner, dots, bars, dot-matrix, dither, morph, comet, scramble, metaballs, newton, helix, percent, 5 terminal spinners | loop | linear/ease-in-out | - | n/a | calm opacity pulse (all variants) |
| 58 | Lenis smooth scroll + reading progress [U] | Long-form | scroll-linked progress bar via CSS scroll-timeline or motion value | scroll-linked | linear | - | n/a | native scroll |
| 59 | Chart entrance (evilcharts) [I] | Area/bar/line reveal | clipPath wipe L->R for area/line, bars grow from baseline with stagger, glow filter drop-shadow, gradient + SVG pattern fills | 600-900ms | (0.22,1,0.36,1) | 30-50ms bars | Yes (data change tweens) | no entrance |
| 60 | Chart scrub crosshair | "Scrub to read any day" | vertical rule + dot follow pointer, tooltip value rolls | pointer-linked | none (direct) + 120ms value ease | - | live | static tooltip |

## 10 best to implement first
1 token set above (duration/ease/distance/blur) as StyleX vars; 2 Thinking states + Shimmer; 3 Streaming text word blur; 4 Toast stacking (#32); 5 Number pop-in + reel counter; 6 Tabs sliding pill (shared layout); 7 Morphing OTP slot + gliding ring; 8 Accordion grid-rows; 9 Success check + spinner->check; 10 Dynamic-island size presets / morphing modal.
