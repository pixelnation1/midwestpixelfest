import type { ArcadeIconName } from "./ArcadeIcon";

const gold = "#ffd338";
const cyan = "#26c6ed";
const white = "#f5f5ef";
const dark = "#081321";

/** Bold, original vector emblems shared by the six convention categories. */
export function CategoryEmblem({ name }: { name: ArcadeIconName }) {
  return (
    <svg viewBox="0 0 180 160" fill="none" aria-hidden="true" className="relative h-36 w-40 transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none">
      <path d="M90 5 150 30v57c0 29-31 52-60 68-29-16-60-39-60-68V30Z" fill={dark} stroke="#284358" strokeWidth="2" />
      <path d="m90 13 52 22v51c0 24-26 45-52 60-26-15-52-36-52-60V35Z" stroke={cyan} strokeOpacity=".45" />
      <path d="M18 66h22M140 66h22M22 74h14M144 74h14" stroke={gold} strokeWidth="3" />
      <path d="m79 132 11 6 11-6" stroke={gold} strokeWidth="3" />
      {name === "retro" ? <g strokeLinejoin="round">
        <path d="m62 30 51 2 9 15-7 37 10 12-7 29H57l-4-29 9-12Z" fill="#12334a" stroke={cyan} strokeWidth="3" />
        <path d="M66 38h43l4 9H63Z" fill={gold} />
        <path d="M67 53h42l-3 29H65Z" fill="#030b14" stroke={white} strokeWidth="2" />
        <path d="m77 68 7-7 8 9 8-6" stroke={cyan} strokeWidth="3" />
        <path d="m62 87 50 1 8 9H58Z" fill={cyan} />
        <path d="M73 92v-8" stroke={white} strokeWidth="3" /><circle cx="73" cy="83" r="4" fill={gold} />
        <circle cx="98" cy="93" r="3" fill={gold} /><circle cx="108" cy="94" r="3" fill={white} />
        <path d="M79 105h20v13H79Z" fill={dark} /><path d="M85 110h8" stroke={gold} strokeWidth="2" />
      </g> : null}
      {name === "tcg" ? <g strokeLinejoin="round">
        <path d="m49 48 41-14 25 75-41 14Z" fill="#153c52" stroke={cyan} strokeWidth="3" />
        <path d="m82 32 45 9-16 83-45-9Z" fill={dark} stroke={gold} strokeWidth="3" />
        <path d="m86 42 30 6-8 42-30-6Z" fill="#1a3c53" stroke={white} strokeWidth="1.5" />
        <path d="m98 50 4 14 10 7-14 4-8 12-3-15-9-7 14-3Z" fill={gold} />
        <path d="m79 96 25 5m-27 2 20 4" stroke={cyan} strokeWidth="3" />
      </g> : null}
      {name === "tabletop" ? <g strokeLinejoin="round">
        <path d="m90 29 41 29-9 49-32 23-34-25-8-47Z" fill="#103147" stroke={cyan} strokeWidth="3" />
        <path d="m90 29-24 44 49 1Zm-24 44 24 57 25-56M48 58l18 15-10 32m75-47-16 16 7 33M48 58l42-5 41 5M56 105l34 4 32-2" stroke={cyan} strokeWidth="2" />
        <path d="m66 73 49 1-25 35Z" fill={gold} stroke={gold} strokeWidth="3" />
        <text x="90" y="91" fill={dark} fontFamily="Arial,sans-serif" fontSize="18" fontWeight="900" textAnchor="middle">20</text>
      </g> : null}
      {name === "cosplay" ? <g strokeLinejoin="round">
        <path d="m53 40 20 11 17-7 17 7 20-11-5 48-20 23-12 15-12-15-20-23Z" fill="#15384e" stroke={cyan} strokeWidth="3" />
        <path d="m57 57 27 15-8 19-17-14Z" fill={gold} /><path d="m123 57-27 15 8 19 17-14Z" fill={gold} />
        <path d="m64 68 13 7-3 6-9-7Zm52 0-13 7 3 6 9-7Z" fill={dark} />
        <path d="m90 53-4 42 4 8 4-8Z" fill={white} /><path d="m78 111 12-9 12 9" stroke={white} strokeWidth="2" />
      </g> : null}
      {name === "vendors" ? <g strokeLinejoin="round">
        <path d="M55 68h70v52H55Z" fill="#15384e" stroke={cyan} strokeWidth="3" />
        <path d="M52 66 63 43h54l11 23Z" fill={gold} stroke={gold} strokeWidth="3" />
        <path d="m75 43-5 23m20-23v23m15-23 5 23" stroke={dark} strokeWidth="7" />
        <path d="M52 66v6q6 10 13 0 6 10 13 0 6 10 12 0 6 10 13 0 6 10 13 0 6 10 12 0v-6" fill={gold} />
        <path d="M65 85h20v23H65Z" fill={dark} stroke={white} strokeWidth="2" /><path d="M96 85h18v35H96Z" fill={dark} stroke={cyan} strokeWidth="2" /><path d="m70 98 5-7 5 7-5 7Z" fill={gold} />
      </g> : null}
      {name === "guests" ? <g strokeLinejoin="round">
        <path d="m90 28 12 25 28 4-20 20 5 28-25-13-25 13 5-28-20-20 28-4Z" fill={gold} stroke={white} strokeWidth="2" />
        <path d="m90 42 8 18 19 3-14 13 3 18-16-8-16 8 3-18-14-13 19-3Z" fill="#14354b" />
        <path d="m65 119 42-42" stroke={dark} strokeWidth="13" /><path d="m65 119 42-42" stroke={cyan} strokeWidth="8" />
        <path d="m102 65 10-10q10-6 16 1t0 16l-10 10Z" fill={white} stroke={cyan} strokeWidth="3" /><path d="m108 63 12 12m-7-17 12 12" stroke={dark} strokeWidth="2" />
      </g> : null}
    </svg>
  );
}
