import { createIcon } from '../createIcon';
import { arc, body, circle, cut, dot, hole, poly, rect, roundPolygon, seg, stroke } from '../shapes';
import type { Part } from '../shapes';

// Sound and music.

const SPEAKER: number[] = [2.25, 6.5, 5, 6.5, 8.75, 3.25, 8.75, 14.75, 5, 11.5, 2.25, 11.5];
const speaker = (): Part => body(roundPolygon(0.75, ...SPEAKER), { tint: true });

/** Rectangular knock-out (a hole with a rounded-rect shape). */
const holeRect = (x: number, y: number, w: number, h: number, r: number): Part => ({
  k: 'hole',
  d: rect(x, y, w, h, r),
});

// ---- notes ----------------------------------------------------------------

export const MusicNoteIcon = /*#__PURE__*/ createIcon('MusicNote', () => [
  body(circle(6.5, 13.25, 2.25), { tint: true }),
  stroke('M8.75 13.25V3.5Q13 4 14 8'),
]);

export const MusicNotesIcon = /*#__PURE__*/ createIcon('MusicNotes', () => [
  body(circle(5, 13.25, 2), { tint: true }),
  body(circle(12.5, 11.75, 2), { tint: true }),
  stroke(poly(7, 13.25, 7, 4.5, 14.5, 3, 14.5, 11.75)),
  stroke(seg(7, 7.25, 14.5, 5.75)),
]);

export const MusicPlusIcon = /*#__PURE__*/ createIcon('MusicPlus', () => [
  body(circle(5.5, 13, 2.25), { tint: true }),
  stroke('M7.75 13V3.5Q12 3.75 12.25 8'),
  stroke(seg(13.75, 11.5, 13.75, 16)),
  stroke(seg(11.5, 13.75, 16, 13.75)),
]);

export const MusicOffIcon = /*#__PURE__*/ createIcon('MusicOff', () => [
  body(circle(6.5, 13.25, 2.25), { tint: true }),
  stroke('M8.75 13.25V11.9'),
  stroke('M8.75 5.6V3.5Q13 4 14 8'),
  stroke(seg(2.75, 2.75, 15.25, 15.25)),
]);

export const PlaylistIcon = /*#__PURE__*/ createIcon('Playlist', () => [
  stroke(seg(2.5, 4.5, 10, 4.5)),
  stroke(seg(2.5, 8.5, 10, 8.5)),
  stroke(seg(2.5, 12.5, 6.5, 12.5)),
  body(circle(11, 13, 2), { tint: true }),
  stroke('M13 13V5.75Q15.25 5.75 15.75 8.5'),
]);

// ---- volume ---------------------------------------------------------------

export const VolumeLowIcon = /*#__PURE__*/ createIcon('VolumeLow', () => [
  speaker(),
  stroke(arc(9.5, 9, 3, 40, 140)),
]);

export const VolumeMuteIcon = /*#__PURE__*/ createIcon('VolumeMute', () => [
  speaker(),
  stroke(seg(11.75, 6.75, 16, 11.25)),
  stroke(seg(16, 6.75, 11.75, 11.25)),
]);

/** Speaker (shifted right so the off slash crosses the cone) split into two bodies, each 2.25 from the slash. */

export const VolumeOffIcon = /*#__PURE__*/ createIcon('VolumeOff', () => [
  body(roundPolygon(0.75, 2.25, 6.5, 5, 6.5, 8.75, 3.25, 8.75, 14.75, 5, 11.5, 2.25, 11.5), { tint: true }),
  stroke(seg(11, 5, 15.5, 13)),
]);

export const WaveformIcon = /*#__PURE__*/ createIcon('Waveform', () => [
  stroke('M2 9C3.25 4 5 4 6.5 9S9.75 14 11.25 9S14.5 5.5 16 9'),
]);

export const AudioLinesIcon = /*#__PURE__*/ createIcon('AudioLines', () => [
  stroke(seg(3, 7.5, 3, 10.5)),
  stroke(seg(6, 4.5, 6, 13.5)),
  stroke(seg(9, 2.5, 9, 15.5)),
  stroke(seg(12, 5.5, 12, 12.5)),
  stroke(seg(15, 7.5, 15, 10.5)),
]);

export const SoundWaveIcon = /*#__PURE__*/ createIcon('SoundWave', () => [
  body(circle(9, 9, 7), { tint: true }),
  cut(seg(5.75, 7.75, 5.75, 10.25)),
  cut(seg(9, 5.75, 9, 12.25)),
  cut(seg(12.25, 7.75, 12.25, 10.25)),
]);

export const EqualizerIcon = /*#__PURE__*/ createIcon('Equalizer', () => {
  const sliders: [number, number][] = [
    [3.75, 6],
    [9, 11.25],
    [14.25, 8.25],
  ];
  return sliders.flatMap(([x, y]) => [
    stroke(seg(x, 2.5, x, y - 1.75)),
    stroke(seg(x, y + 1.75, x, 15.5)),
    body(circle(x, y, 1.75), { tint: true }),
  ]);
});

// ---- media ----------------------------------------------------------------

export const DiscIcon = /*#__PURE__*/ createIcon('Disc', () => [
  body(circle(9, 9, 7), { tint: true }),
  cut(circle(9, 9, 2.25)),
]);

export const VinylIcon = /*#__PURE__*/ createIcon('Vinyl', () => [
  body(circle(9, 9, 7), { tint: true }),
  cut(arc(9, 9, 5, 215, 265)),
  cut(arc(9, 9, 5, 35, 85)),
  hole(9, 9, 1.5),
]);

export const CassetteIcon = /*#__PURE__*/ createIcon('Cassette', () => [
  body(rect(2, 3.75, 14, 10.5, 2.5), { tint: true }),
  cut(circle(6.25, 8, 1.5)),
  cut(circle(11.75, 8, 1.5)),
  cut(seg(6.5, 11.5, 11.5, 11.5)),
]);

export const RadioIcon = /*#__PURE__*/ createIcon('Radio', () => [
  body(rect(2, 6.75, 14, 8.75, 2.5), { tint: true }),
  stroke(seg(5.5, 6.75, 12, 2.5)),
  cut(circle(6.25, 11.25, 2)),
  cut(seg(10.5, 9.75, 13.5, 9.75)),
  cut(seg(10.5, 12.75, 13.5, 12.75)),
]);

export const BoomboxIcon = /*#__PURE__*/ createIcon('Boombox', () => [
  body(rect(2, 6, 14, 9, 2.5), { tint: true }),
  stroke('M5.5 6V4.25Q5.5 3 6.75 3H11.25Q12.5 3 12.5 4.25V6'),
  cut(circle(6.25, 10.5, 1.75)),
  cut(circle(11.75, 10.5, 1.75)),
]);

// ---- mics and listening ----------------------------------------------------

export const MicStandIcon = /*#__PURE__*/ createIcon('MicStand', () => [
  body(rect(6.5, 2, 5, 7, 2.5), { tint: true }),
  cut(seg(6.5, 5.25, 11.5, 5.25)),
  stroke(seg(9, 9, 9, 15.75)),
  stroke(seg(5.75, 15.75, 12.25, 15.75)),
]);

export const MicVocalIcon = /*#__PURE__*/ createIcon('MicVocal', () => [
  body(circle(10.75, 7.25, 3.75), { tint: true }),
  cut(seg(9.2, 5.7, 12.3, 8.8)),
  body('M7.26 8.62L2.66 13.22A1.5 1.5 0 0 0 4.78 15.34L9.38 10.74'),
]);

export const HeadsetIcon = /*#__PURE__*/ createIcon('Headset', () => [
  stroke('M3.75 9.5V8.75A5.25 5.25 0 0 1 14.25 8.75V9.5'),
  body(rect(2, 9.5, 3.5, 4.75, 1.5), { tint: true }),
  body(rect(12.5, 9.5, 3.5, 4.75, 1.5), { tint: true }),
  stroke('M14.25 14.25Q14.25 15.75 11.5 15.75H10'),
  dot(9.5, 15.75, 1.25),
]);

export const EarIcon = /*#__PURE__*/ createIcon('Ear', () => [
  body('M4.5 8A4.75 4.75 0 0 1 14 8C14 10.75 11.5 11 11.5 13.5A2.5 2.5 0 0 1 6.5 13.5V12Z', { tint: true }),
  cut('M7.25 8.5A2 2 0 0 1 11.25 8.5'),
  hole(9.25, 11.75, 1),
]);

export const BellRingIcon = /*#__PURE__*/ createIcon('BellRing', () => [
  body('M5 13.25H13L12.5 12Q12 11 12 9.75V7.5A3 3 0 0 0 6 7.5V9.75Q6 11 5.5 12Z', { tint: true }),
  stroke('M7.75 15.5A1.25 1.25 0 0 0 10.25 15.5'),
  stroke(arc(9, 8, 7, 250, 290)),
  stroke(arc(9, 8, 7, 70, 110)),
]);

// ---- instruments ----------------------------------------------------------

export const MetronomeIcon = /*#__PURE__*/ createIcon('Metronome', () => [
  body(roundPolygon(1.5, 5.75, 2.5, 12.25, 2.5, 15, 15.5, 3, 15.5), { tint: true }),
  cut(seg(8.5, 12.75, 10.75, 6.25)),
  hole(9.6, 9.5, 1.25),
]);

export const PianoIcon = /*#__PURE__*/ createIcon('Piano', () => [
  body(rect(2, 3.75, 14, 10.5, 2.5), { tint: true }),
  cut(seg(6.67, 9.5, 6.67, 14.25)),
  cut(seg(11.33, 9.5, 11.33, 14.25)),
  holeRect(5.27, 4.5, 2.8, 5, 0.75),
  holeRect(9.93, 4.5, 2.8, 5, 0.75),
]);

export const GuitarIcon = /*#__PURE__*/ createIcon('Guitar', () => [
  body('M6.543 8.543A3.5 3.5 0 1 0 9.457 11.457A2.5 2.5 0 1 0 6.543 8.543Z', { tint: true }),
  stroke(seg(10.77, 7.23, 15.25, 2.75)),
  hole(6.25, 11.75, 1.25),
]);

export const DrumIcon = /*#__PURE__*/ createIcon('Drum', () => [
  body('M2.5 6A6.5 2.75 0 0 1 15.5 6V12A6.5 2.75 0 0 1 2.5 12Z', { tint: true }),
  cut('M2.5 6A6.5 2.75 0 0 0 15.5 6'),
  cut(poly(4.5, 10.25, 6.75, 12.5, 9, 10.25, 11.25, 12.5, 13.5, 10.25)),
]);

export const TuningForkIcon = /*#__PURE__*/ createIcon('TuningFork', () => [
  stroke('M6.5 2.5V8.75A2.5 2.5 0 0 0 11.5 8.75V2.5'),
  stroke(seg(9, 11.25, 9, 15.5)),
]);
