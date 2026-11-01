import { createIcon } from '../createIcon';
import type { Part, PartOptions } from '../shapes';
import {
  body,
  circle,
  cut,
  head,
  hole,
  polar,
  poly,
  rect,
  roundPoly,
  roundPolygon,
  seg,
  star,
  stroke,
} from '../shapes';

// Files: document types and file actions.

/** Page with a folded top-right corner (portrait keyline) and its fold, as in File. */
const PAGE = 'M10.5 2H5.25A2 2 0 0 0 3.25 4V14A2 2 0 0 0 5.25 16H12.75A2 2 0 0 0 14.75 14V6.25Z';
const FOLD = 'M10.5 2.25V5.25A1 1 0 0 0 11.5 6.25H14.5';

/** A page with the given marks inside it. Marks live in x 6.25..11.75, y 8.25..13. */
const file = (...marks: Part[]): Part[] => [body(PAGE, { tint: true }), cut(FOLD), ...marks];

/** Solid mark from any path: a dot-like shape in outline and duo, knocked out of the solid in fill. */
const holeD = (d: string, o?: PartOptions): Part => ({ k: 'hole', d, ...o });

export const FilePlusIcon = /*#__PURE__*/ createIcon('FilePlus', () =>
  file(cut(seg(6.5, 10.75, 11.5, 10.75)), cut(seg(9, 8.25, 9, 13))),
);

export const FileMinusIcon = /*#__PURE__*/ createIcon('FileMinus', () =>
  file(cut(seg(6.5, 10.75, 11.5, 10.75))),
);

export const FileXIcon = /*#__PURE__*/ createIcon('FileX', () =>
  file(cut(seg(7, 8.75, 11, 12.75)), cut(seg(11, 8.75, 7, 12.75))),
);

export const FileCheckIcon = /*#__PURE__*/ createIcon('FileCheck', () =>
  file(cut(poly(6.5, 11, 8.5, 13, 11.75, 9))),
);

export const FileSearchIcon = /*#__PURE__*/ createIcon('FileSearch', () =>
  file(cut(circle(8.25, 10, 2)), cut(seg(9.7, 11.45, 11.5, 13.25))),
);

export const FileLockIcon = /*#__PURE__*/ createIcon('FileLock', () =>
  file(cut('M7.75 10.5V9.75A1.25 1.25 0 0 1 10.25 9.75V10.5'), holeD(rect(6.5, 10.5, 5, 2.75, 1))),
);

export const FileImageIcon = /*#__PURE__*/ createIcon('FileImage', () =>
  file(hole(7.5, 9, 1), cut(roundPoly(0.75, 6.25, 13, 10.25, 10, 11.75, 11.75))),
);

export const FileAudioIcon = /*#__PURE__*/ createIcon('FileAudio', () =>
  file(
    holeD(circle(8, 12, 1.25)),
    cut(seg(9.25, 12, 9.25, 8.5)),
    cut('M9.25 8.5Q11.75 8.5 11.75 11'),
  ),
);

export const FileVideoIcon = /*#__PURE__*/ createIcon('FileVideo', () =>
  file(holeD(roundPolygon(0.6, 7.25, 8.5, 7.25, 13, 11.5, 10.75))),
);

export const FileArchiveIcon = /*#__PURE__*/ createIcon('FileArchive', () =>
  file(cut(rect(6.5, 8.25, 5, 5, 1.25)), cut(seg(8.25, 10.5, 9.75, 10.5))),
);

export const FileSpreadsheetIcon = /*#__PURE__*/ createIcon('FileSpreadsheet', () =>
  file(cut(rect(6.25, 8.5, 5.5, 4.75, 1)), cut(seg(6.25, 10.9, 11.75, 10.9)), cut(seg(9, 8.5, 9, 13.25))),
);

export const FileChartIcon = /*#__PURE__*/ createIcon('FileChart', () =>
  file(cut(poly(6.5, 12.75, 8.75, 10.5, 10.25, 11.75, 11.75, 9))),
);

export const FileClockIcon = /*#__PURE__*/ createIcon('FileClock', () =>
  file(cut(circle(9, 10.5, 2.6)), cut(poly(9, 9.5, 9, 10.5, 10, 11.25))),
);

export const FileWarningIcon = /*#__PURE__*/ createIcon('FileWarning', () =>
  file(cut(seg(9, 8.25, 9, 10.25)), hole(9, 12.5)),
);

export const FileQuestionIcon = /*#__PURE__*/ createIcon('FileQuestion', () =>
  file(cut('M7.5 9.5A1.5 1.5 0 0 1 10.5 9.5Q10.5 10.5 9 10.75'), hole(9, 12.5)),
);

export const FileSignatureIcon = /*#__PURE__*/ createIcon('FileSignature', () =>
  file(cut('M6.25 12.25C7 8.75 8 8.75 8.25 10.75S9.5 12.5 11.75 10')),
);

export const FileDownIcon = /*#__PURE__*/ createIcon('FileDown', () =>
  file(cut(seg(9, 8.5, 9, 13)), cut(head(9, 13, 180, 3.5))),
);

export const FileUpIcon = /*#__PURE__*/ createIcon('FileUp', () =>
  file(cut(seg(9, 13, 9, 8.75)), cut(head(9, 8.75, 0, 3.5))),
);

export const FileInputIcon = /*#__PURE__*/ createIcon('FileInput', () =>
  file(cut(seg(11.25, 8.5, 7, 12.75)), cut(head(7, 12.75, 225, 3.5))),
);

export const FileOutputIcon = /*#__PURE__*/ createIcon('FileOutput', () =>
  file(cut(seg(7, 12.75, 11.25, 8.5)), cut(head(11.25, 8.5, 45, 3.5))),
);

export const FilesIcon = /*#__PURE__*/ createIcon('Files', () => [
  stroke('M6.75 13H5.25A2 2 0 0 1 3.25 11V4A2 2 0 0 1 5.25 2H9.75A2 2 0 0 1 11.75 4V5.25'),
  body(rect(6.75, 5.75, 8, 10.25, 2), { tint: true }),
  cut(seg(9.25, 10, 12.25, 10)),
  cut(seg(9.25, 13, 11.25, 13)),
]);

export const FileDiffIcon = /*#__PURE__*/ createIcon('FileDiff', () =>
  file(cut(seg(7.25, 9.25, 10.75, 9.25)), cut(seg(9, 7.5, 9, 11)), cut(seg(7.25, 13, 10.75, 13))),
);

export const FileBracesIcon = /*#__PURE__*/ createIcon('FileBraces', () =>
  file(
    cut(
      'M7.75 8.25Q6.75 8.25 6.75 9.25V9.75Q6.75 10.75 6 10.75Q6.75 10.75 6.75 11.75V12.25Q6.75 13.25 7.75 13.25',
    ),
    cut(
      'M10.25 8.25Q11.25 8.25 11.25 9.25V9.75Q11.25 10.75 12 10.75Q11.25 10.75 11.25 11.75V12.25Q11.25 13.25 10.25 13.25',
    ),
  ),
);

export const FileTerminalIcon = /*#__PURE__*/ createIcon('FileTerminal', () =>
  file(cut(poly(6.5, 9, 8.5, 11, 6.5, 13)), cut(seg(10, 13, 12, 13))),
);

export const FileKeyIcon = /*#__PURE__*/ createIcon('FileKey', () => {
  const [x, y] = polar(7.75, 9.5, 1.5, 135);
  return file(
    cut(circle(7.75, 9.5, 1.5)),
    cut(seg(x, y, 11.5, 13.25)),
    cut(seg(10, 11.75, 11.25, 10.5)),
  );
});

export const FileBadgeIcon = /*#__PURE__*/ createIcon('FileBadge', () =>
  file(cut(circle(9, 9.75, 1.75)), cut(poly(8, 11.4, 7.5, 13)), cut(poly(10, 11.4, 10.5, 13))),
);

export const FilePenIcon = /*#__PURE__*/ createIcon('FilePen', () =>
  file(cut(roundPoly(0.5, 6.5, 13, 7, 11, 11, 7.5, 12, 8.5, 8, 12.5, 6.5, 13))),
);

export const FileTypeIcon = /*#__PURE__*/ createIcon('FileType', () =>
  file(cut(seg(6.75, 8.75, 11.25, 8.75)), cut(seg(9, 8.75, 9, 13))),
);

export const FileHeartIcon = /*#__PURE__*/ createIcon('FileHeart', () =>
  file(
    holeD(
      'M9 13C7.6 12.1 6.5 11.1 6.5 9.8C6.5 8.9 7.1 8.4 7.85 8.4C8.4 8.4 8.8 8.7 9 9.15C9.2 8.7 9.6 8.4 10.15 8.4C10.9 8.4 11.5 8.9 11.5 9.8C11.5 11.1 10.4 12.1 9 13Z',
    ),
  ),
);

export const FileStarIcon = /*#__PURE__*/ createIcon('FileStar', () =>
  file(cut(star(9, 10.75, 2.9, 1.4, 5, 0.4))),
);

export const FileUserIcon = /*#__PURE__*/ createIcon('FileUser', () =>
  file(hole(9, 9.5, 1.25), cut('M6.5 13A2.5 2 0 0 1 11.5 13')),
);
