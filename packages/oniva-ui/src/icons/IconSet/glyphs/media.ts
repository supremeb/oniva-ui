import { createIcon } from '../createIcon';
import {
  arc,
  body,
  circle,
  cut,
  dot,
  head,
  hole,
  LINED,
  polar,
  rect,
  roundPoly,
  roundPolygon,
  seg,
  SOLID,
  stroke,
} from '../shapes';

// Photography and video.

// ---- cameras and clips ---------------------------------------------------

export const PhotoCameraIcon = /*#__PURE__*/ createIcon('PhotoCamera', () => [
  body(
    'M4.5 5.5H6.25L7.1 3.75H10.9L11.75 5.5H13.5A2.5 2.5 0 0 1 16 8V13A2.5 2.5 0 0 1 13.5 15.5H4.5A2.5 2.5 0 0 1 2 13V8A2.5 2.5 0 0 1 4.5 5.5Z',
    { tint: true },
  ),
  cut(circle(9, 10.5, 2.5)),
]);

export const VideoCameraIcon = /*#__PURE__*/ createIcon('VideoCamera', () => [
  body(rect(2, 4.5, 9.5, 9, 2.5), { tint: true }),
  body(roundPolygon(0.75, 11.5, 7.5, 15.75, 5.25, 15.75, 12.75, 11.5, 10.5)),
]);

export const FilmIcon = /*#__PURE__*/ createIcon('Film', () => [
  body(rect(2, 3.75, 14, 10.5, 2.5), { tint: true }),
  cut(seg(6, 3.75, 6, 14.25)),
  cut(seg(12, 3.75, 12, 14.25)),
  cut(seg(2, 7.25, 6, 7.25)),
  cut(seg(2, 10.75, 6, 10.75)),
  cut(seg(12, 7.25, 16, 7.25)),
  cut(seg(12, 10.75, 16, 10.75)),
]);

export const ClapperboardIcon = /*#__PURE__*/ createIcon('Clapperboard', () => [
  body(roundPolygon(0.75, 2.25, 4.25, 15.75, 2.25, 15.75, 5.25, 2.25, 6.5)),
  body(rect(2, 8.75, 14, 6.75, 2), { tint: true }),
  cut(seg(5.5, 12.25, 12.5, 12.25)),
]);

// ---- images --------------------------------------------------------------

const IMAGE_SUN = circle(11.75, 6.75, 1.25);

/** The Image frame as an open path that breaks around a bottom-right modifier (plus / x). */
const IMAGE_BROKEN = 'M8.5 14.25H4.5A2.5 2.5 0 0 1 2 11.75V6.25A2.5 2.5 0 0 1 4.5 3.75H13.5A2.5 2.5 0 0 1 16 6.25V8.5';
const IMAGE_NOTCH =
  'M16 8.5A5.4 5.4 0 0 0 8.5 14.25H4.5A2.5 2.5 0 0 1 2 11.75V6.25A2.5 2.5 0 0 1 4.5 3.75H13.5A2.5 2.5 0 0 1 16 6.25Z';

export const ImagePlusIcon = /*#__PURE__*/ createIcon('ImagePlus', () => [
  body(IMAGE_BROKEN, { tint: true, only: LINED }),
  body(IMAGE_NOTCH, { only: SOLID }),
  cut(IMAGE_SUN),
  cut(roundPoly(1, 4.25, 12.75, 7.75, 9, 10, 11.25)),
  stroke(seg(13.75, 11.5, 13.75, 16)),
  stroke(seg(11.5, 13.75, 16, 13.75)),
]);

export const ImageXIcon = /*#__PURE__*/ createIcon('ImageX', () => [
  body(IMAGE_BROKEN, { tint: true, only: LINED }),
  body(IMAGE_NOTCH, { only: SOLID }),
  cut(IMAGE_SUN),
  cut(roundPoly(1, 4.25, 12.75, 7.75, 9, 10, 11.25)),
  stroke(seg(12.25, 12.25, 15.25, 15.25)),
  stroke(seg(15.25, 12.25, 12.25, 15.25)),
]);

export const ImageOffIcon = /*#__PURE__*/ createIcon('ImageOff', () => [
  body('M7.45 3.75H13.5A2.5 2.5 0 0 1 16 6.25V12.3', { tint: true }),
  body('M2 5.7V11.75A2.5 2.5 0 0 0 4.5 14.25H10.55', { tint: true }),
  cut(circle(12.25, 7, 1.25)),
  stroke(seg(2.75, 2.75, 15.25, 15.25)),
]);

export const ImagesIcon = /*#__PURE__*/ createIcon('Images', () => [
  stroke('M6.5 3H13.75A2.25 2.25 0 0 1 16 5.25V9.5'),
  body(rect(2, 6.25, 11, 9, 2.25), { tint: true }),
  cut(circle(10, 9.5, 1)),
  cut(roundPoly(1, 3.75, 14, 6.75, 10.75, 9.5, 13.25)),
]);

export const GalleryIcon = /*#__PURE__*/ createIcon('Gallery', () => [
  body(rect(2, 2.5, 6.25, 13, 2), { tint: true }),
  body(rect(11.25, 2.5, 4.75, 4.75, 1.5)),
  body(rect(11.25, 10.75, 4.75, 4.75, 1.5)),
  hole(5.125, 6.75, 1),
]);

export const FrameImageIcon = /*#__PURE__*/ createIcon('FrameImage', () => [
  body(rect(2.5, 2.5, 13, 13, 2.5), { tint: true }),
  cut(rect(5.75, 5.75, 6.5, 6.5, 1)),
]);

export const SlideshowIcon = /*#__PURE__*/ createIcon('Slideshow', () => [
  body(rect(2, 2.5, 14, 9.75, 2.5), { tint: true }),
  cut(circle(12.25, 6, 1)),
  cut(roundPoly(1, 4.75, 10.5, 8, 7, 11, 10.5)),
  dot(6, 15.25),
  dot(9, 15.25),
  dot(12, 15.25),
]);

export const PortraitIcon = /*#__PURE__*/ createIcon('Portrait', () => [
  body(rect(3.25, 2, 11.5, 14, 2), { tint: true }),
  cut(circle(9, 6.25, 1.75)),
  cut('M5.75 13.5Q5.75 10.5 9 10.5Q12.25 10.5 12.25 13.5'),
]);

export const PanoramaIcon = /*#__PURE__*/ createIcon('Panorama', () => [
  body('M2 5.5C6 3.75 12 3.75 16 5.5V12.5C12 14.25 6 14.25 2 12.5Z', { tint: true }),
  cut(roundPoly(1, 4.75, 11, 7.5, 8, 10, 10.25, 11.25, 9.25, 13.25, 11)),
]);

export const ThumbnailIcon = /*#__PURE__*/ createIcon('Thumbnail', () => [
  body(rect(2, 2.5, 14, 9.5, 2.5), { tint: true }),
  cut(roundPolygon(0.6, 7.5, 5.25, 11, 7.25, 7.5, 9.25)),
  stroke(seg(2.5, 15.25, 11.5, 15.25)),
]);

// ---- capture -------------------------------------------------------------

export const ApertureIcon = /*#__PURE__*/ createIcon('Aperture', () => [
  body(circle(9, 9, 7), { tint: true }),
  cut(roundPolygon(0.5, ...[0, 1, 2, 3, 4, 5].flatMap((i) => polar(9, 9, 2.75, i * 60 + 30)))),
  ...[0, 1, 2, 3, 4, 5].map((i) => {
    const [x1, y1] = polar(9, 9, 2.75, i * 60 + 30);
    const [x2, y2] = polar(9, 9, 5.75, i * 60 + 80);
    return cut(seg(x1, y1, x2, y2));
  }),
]);

export const LensIcon = /*#__PURE__*/ createIcon('Lens', () => [
  body(circle(9, 9, 7), { tint: true }),
  cut(circle(9, 9, 3.25)),
  hole(9, 9, 1),
]);

export const FlashIcon = /*#__PURE__*/ createIcon('Flash', () => [
  body(circle(9, 9, 7), { tint: true }),
  cut(roundPolygon(0.5, 10, 5.5, 7, 9.5, 9, 9.5, 8.25, 12.75, 11, 8.5, 9, 8.5)),
]);

export const RecordIcon = /*#__PURE__*/ createIcon('Record', () => [
  body(circle(9, 9, 7), { tint: true }),
  hole(9, 9, 2.75),
]);

export const FiltersIcon = /*#__PURE__*/ createIcon('Filters', () => [
  body(circle(9, 6.25, 4.25), { tint: true }),
  stroke(circle(6, 11.5, 4.25)),
  stroke(circle(12, 11.5, 4.25)),
]);

export const FocusFrameIcon = /*#__PURE__*/ createIcon('FocusFrame', () => [
  body(rect(6, 6, 6, 6, 1.5), { tint: true }),
  stroke(seg(9, 2, 9, 3.5)),
  stroke(seg(9, 14.5, 9, 16)),
  stroke(seg(2, 9, 3.5, 9)),
  stroke(seg(14.5, 9, 16, 9)),
]);

const SHOT_CORNERS = [
  roundPoly(2, 2.75, 6.75, 2.75, 2.75, 6.75, 2.75),
  roundPoly(2, 11.25, 2.75, 15.25, 2.75, 15.25, 6.75),
  roundPoly(2, 15.25, 11.25, 15.25, 15.25, 11.25, 15.25),
  roundPoly(2, 6.75, 15.25, 2.75, 15.25, 2.75, 11.25),
];

export const ScreenshotIcon = /*#__PURE__*/ createIcon('Screenshot', () => [
  ...SHOT_CORNERS.map((d) => stroke(d)),
  body(rect(6, 6.5, 6, 5, 1.25), { tint: true }),
]);

export const ScreenRecordIcon = /*#__PURE__*/ createIcon('ScreenRecord', () => [
  body(rect(2, 3, 14, 9.75, 2.5), { tint: true }),
  hole(9, 7.9, 1.75),
  stroke(seg(9, 12.75, 9, 15.5)),
  stroke(seg(6.25, 15.5, 11.75, 15.5)),
]);

export const LiveIcon = /*#__PURE__*/ createIcon('Live', () => [
  dot(9, 9, 1.5),
  stroke(arc(9, 9, 3.75, 235, 305)),
  stroke(arc(9, 9, 3.75, 55, 125)),
  stroke(arc(9, 9, 7, 235, 305), { soft: true }),
  stroke(arc(9, 9, 7, 55, 125), { soft: true }),
]);

export const SubtitlesIcon = /*#__PURE__*/ createIcon('Subtitles', () => [
  body(rect(2, 3.75, 14, 10.5, 2.5), { tint: true }),
  cut(seg(4.75, 8.25, 7.5, 8.25)),
  cut(seg(9.25, 8.25, 13.25, 8.25)),
  cut(seg(4.75, 11.5, 8.25, 11.5)),
  cut(seg(10, 11.5, 13.25, 11.5)),
]);

// ---- transport -----------------------------------------------------------

export const SkipBackIcon = /*#__PURE__*/ createIcon('SkipBack', () => [
  body(roundPolygon(1.25, 14.5, 3.75, 6.5, 9, 14.5, 14.25), { tint: true }),
  stroke(seg(3.5, 3.75, 3.5, 14.25)),
]);

export const RewindIcon = /*#__PURE__*/ createIcon('Rewind', () => [
  body(roundPolygon(1, 7.5, 4.75, 2.5, 9, 7.5, 13.25), { tint: true }),
  body(roundPolygon(1, 15, 4.75, 10, 9, 15, 13.25), { tint: true }),
]);

export const FastForwardIcon = /*#__PURE__*/ createIcon('FastForward', () => [
  body(roundPolygon(1, 3, 4.75, 8, 9, 3, 13.25), { tint: true }),
  body(roundPolygon(1, 10.5, 4.75, 15.5, 9, 10.5, 13.25), { tint: true }),
]);

export const StopIcon = /*#__PURE__*/ createIcon('Stop', () => [body(rect(4, 4, 10, 10, 2), { tint: true })]);

export const PlayPauseIcon = /*#__PURE__*/ createIcon('PlayPause', () => [
  body(roundPolygon(1.25, 2.5, 4, 8.5, 9, 2.5, 14), { tint: true }),
  stroke(seg(11.75, 4.5, 11.75, 13.5)),
  stroke(seg(15, 4.5, 15, 13.5)),
]);

export const ReplayIcon = /*#__PURE__*/ createIcon('Replay', () => {
  const [x, y] = polar(9, 9, 6.5, 310);
  return [
    stroke(arc(9, 9, 6.5, 310, 570)),
    stroke(head(x, y, 220, 3.5)),
    body(roundPolygon(0.75, 7.75, 6.75, 11.5, 9, 7.75, 11.25), { tint: true }),
  ];
});
