import * as stylex from '@stylexjs/stylex';

export const font = stylex.defineVars({
  '--oniva-font-sans':
    "'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  '--oniva-font-mono': "'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, Consolas, monospace",

  '--oniva-font-size-11': '11px',
  '--oniva-font-size-12': '12px',
  '--oniva-font-size-13': '13px',
  '--oniva-font-size-14': '14px',
  '--oniva-font-size-16': '16px',
  '--oniva-font-size-18': '18px',
  '--oniva-font-size-20': '20px',
  '--oniva-font-size-24': '24px',
  '--oniva-font-size-32': '32px',
  '--oniva-font-size-40': '40px',
  '--oniva-font-size-48': '48px',
  '--oniva-font-size-56': '56px',
  '--oniva-font-size-64': '64px',
  '--oniva-font-size-72': '72px',

  '--oniva-font-lh-11': '16px',
  '--oniva-font-lh-12': '17px',
  '--oniva-font-lh-13': '18px',
  '--oniva-font-lh-14': '20px',
  '--oniva-font-lh-16': '22px',
  '--oniva-font-lh-18': '24px',
  '--oniva-font-lh-20': '26px',
  '--oniva-font-lh-24': '30px',
  '--oniva-font-lh-32': '38px',
  '--oniva-font-lh-40': '46px',
  '--oniva-font-lh-48': '54px',
  '--oniva-font-lh-56': '62px',
  '--oniva-font-lh-64': '70px',
  '--oniva-font-lh-72': '78px',

  '--oniva-font-weight-regular': '400',
  '--oniva-font-weight-medium': '500',
  '--oniva-font-weight-semibold': '600',
  '--oniva-font-weight-bold': '700',

  '--oniva-font-track-caption': '0em', // sentence-case 12px text takes no tracking
  '--oniva-font-track-label': '0.05em', // uppercase <= 14px labels
  '--oniva-font-track-hero': '-0.02em',
});
