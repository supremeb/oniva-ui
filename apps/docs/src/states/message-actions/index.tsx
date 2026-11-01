import { MessageActions } from 'oniva-ui';
import type { StateModule } from '../types';

const answer =
  'Net revenue retention reached 112% in Q3; expansion came mostly from Team plan upgrades at Northwind Labs.';
const noop = () => {};

const longReasons = [
  'Not accurate',
  'Too long',
  "Didn't follow instructions",
  'Cited a source that does not exist',
  'Ignored the attached spreadsheet',
  'Other',
];

const versionTexts = [
  'NRR rose to 112% in Q3, driven by Team plan upgrades.',
  answer,
  'Q3 NRR: 112%. Team plan upgrades were the main source of expansion.',
];

const mod: StateModule = {
  slug: 'message-actions',
  title: 'Message actions',
  width: 480,
  groups: [
    {
      label: 'Actions',
      states: [
        { id: 'copy-only', label: 'copy only (feedback hidden)', render: () => <MessageActions text={answer} showFeedback={false} /> },
        { id: 'copy-and-feedback', label: 'copy and feedback', render: () => <MessageActions text={answer} reasons={[]} /> },
        { id: 'default', label: 'copy, regenerate, feedback', render: () => <MessageActions text={answer} onRegenerate={noop} /> },
        {
          id: 'full-set',
          label: 'full set',
          render: () => <MessageActions text={answer} onRegenerate={noop} onSpeak={noop} onShare={noop} onBranch={noop} />,
        },
      ],
    },
    {
      label: 'Feedback',
      states: [
        { id: 'liked', label: 'liked', render: () => <MessageActions text={answer} onRegenerate={noop} defaultFeedback="like" /> },
        {
          id: 'disliked-closed',
          label: 'disliked, reasons closed',
          render: () => <MessageActions text={answer} onRegenerate={noop} defaultFeedback="dislike" />,
        },
        {
          id: 'reasons-open',
          label: 'disliked, reasons open',
          render: () => <MessageActions text={answer} onRegenerate={noop} defaultFeedback="dislike" defaultReasonOpen />,
        },
        {
          id: 'reasons-long',
          label: 'reasons wrap over lines',
          render: () => (
            <MessageActions text={answer} onRegenerate={noop} defaultFeedback="dislike" defaultReasonOpen reasons={longReasons} />
          ),
        },
        {
          id: 'panel',
          label: 'panel variant',
          render: () => (
            <MessageActions variant="panel" text={answer} onRegenerate={noop} onSpeak={noop} defaultFeedback="dislike" defaultReasonOpen />
          ),
        },
        {
          id: 'no-reasons',
          label: 'disliked, no reason row',
          render: () => <MessageActions text={answer} defaultFeedback="dislike" reasons={[]} />,
        },
      ],
    },
    {
      label: 'Versions',
      states: [
        {
          id: 'versions-latest',
          label: '3 versions, on the latest',
          render: () => <MessageActions text={versionTexts[2]!} versions={versionTexts} onRegenerate={noop} />,
        },
        {
          id: 'versions-first',
          label: '3 versions, on the first',
          render: () => <MessageActions text={versionTexts[0]!} versions={3} version={0} onRegenerate={noop} />,
        },
        {
          id: 'versions-many',
          label: '12 versions',
          render: () => <MessageActions text={answer} versions={12} version={9} onRegenerate={noop} onSpeak={noop} onShare={noop} onBranch={noop} />,
        },
        {
          id: 'versions-no-regenerate',
          label: 'versions without regenerate (switcher hidden)',
          render: () => <MessageActions text={answer} versions={3} />,
        },
      ],
    },
    {
      label: 'Run',
      states: [
        {
          id: 'regenerating',
          label: 'regenerating',
          render: () => <MessageActions text={answer} versions={2} onRegenerate={noop} isRegenerating />,
        },
        {
          id: 'speaking',
          label: 'reading aloud',
          render: () => <MessageActions text={answer} onRegenerate={noop} onSpeak={noop} isSpeaking />,
        },
      ],
    },
  ],
  missing: [
    'Copied confirmation: needs a click on Copy (internal timer), no prop starts it.',
    'Thanks confirmation after sending a reason: reached only by interaction (Send), no default prop.',
    'Panel Send confirmation ("Thanks!"): reached only by pressing Send.',
    'Free-text "Other" input: appears only after picking the Other chip.',
  ],
};

export default mod;
