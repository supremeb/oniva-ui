import type { ReactElement, SVGProps } from 'react';

/** Original geometric logo marks for a fictional customer set (no real brands). */
export interface FakeLogo {
  name: string;
  Mark: (props: SVGProps<SVGSVGElement>) => ReactElement;
}

const wrap = (children: ReactElement) =>
  function Mark(props: SVGProps<SVGSVGElement>) {
    return (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true" {...props}>
        {children}
      </svg>
    );
  };

export const fakeLogos: FakeLogo[] = [
  { name: 'Northwind Labs', Mark: wrap(<path d="M12 2 22 20H2z" />) },
  { name: 'Kestrel', Mark: wrap(<><circle cx="8" cy="12" r="6" /><circle cx="16" cy="12" r="6" opacity=".55" /></>) },
  { name: 'Brightloop', Mark: wrap(<path fillRule="evenodd" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 5a5 5 0 1 1 0 10 5 5 0 0 1 0-10Z" />) },
  { name: 'Halcyon', Mark: wrap(<><rect x="3" y="3" width="8" height="8" rx="2" /><rect x="13" y="13" width="8" height="8" rx="2" /><rect x="13" y="3" width="8" height="8" rx="4" opacity=".55" /></>) },
  { name: 'Tessel', Mark: wrap(<path d="M12 2 21 7v10l-9 5-9-5V7z" />) },
  { name: 'Orbit & Co', Mark: wrap(<><circle cx="12" cy="12" r="4" /><path d="M2 12a10 4 0 1 0 20 0 10 4 0 1 0-20 0Zm2 0a8 2 0 1 1 16 0 8 2 0 1 1-16 0Z" opacity=".55" /></>) },
  { name: 'Parallel', Mark: wrap(<><path d="M4 3h5l-3 18H1z" /><path d="M14 3h5l-3 18h-5z" opacity=".55" transform="translate(3)" /></>) },
  { name: 'Quill', Mark: wrap(<path d="M4 20C4 10 10 4 20 4c0 10-6 16-16 16Z" />) },
];
