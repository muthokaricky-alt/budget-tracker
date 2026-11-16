// One hand-authored icon set: 20px grid, 1.75 stroke, round caps.
const PATHS = {
  plus: 'M10 4.5v11M4.5 10h11',
  trash: 'M4 6h12M8 6V4.5h4V6M5.5 6l.7 9.2c.05.7.6 1.3 1.3 1.3h5c.7 0 1.25-.6 1.3-1.3L14.5 6',
  download: 'M10 3.5v9M6 8.5l4 4 4-4M4 15.5h12',
  upload: 'M10 12.5v-9M6 7.5l4-4 4 4M4 15.5h12',
  search: 'M9 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12ZM13.5 13.5 17 17',
  undo: 'M7.5 5 4 8.5 7.5 12M4 8.5h7.5a4.5 4.5 0 0 1 0 9H9',
  wallet: 'M3.5 6.5h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1h9M13 11.5h1',
} as const

export type IconName = keyof typeof PATHS

export default function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={PATHS[name]} />
    </svg>
  )
}
