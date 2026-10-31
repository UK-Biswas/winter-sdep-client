interface LogoProps {
  size?: number;
  className?: string;
}

/**
 * FrostTogether mark: a rounded "frost tile" with a six-point burst and a
 * warm marigold core — cold season, warm people.
 */
export function LogoMark({ size = 40, className }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <linearGradient id="ft-tile" x1="0" y1="0" x2="48" y2="48">
          <stop stopColor="#0F5B50" />
          <stop offset="1" stopColor="#062E2A" />
        </linearGradient>
      </defs>

      <rect width="48" height="48" rx="14" fill="url(#ft-tile)" />
      <rect
        x="1"
        y="1"
        width="46"
        height="46"
        rx="13"
        stroke="rgba(207,245,232,0.28)"
      />

      <g
        stroke="#D9F7EC"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.95"
      >
        <path d="M24 9.5v29" />
        <path d="M11.4 16.75 36.6 31.25" />
        <path d="M11.4 31.25 36.6 16.75" />
      </g>

      <circle cx="24" cy="24" r="5.4" fill="#F5AC3C" />
      <circle cx="24" cy="24" r="2.1" fill="#FFF6E4" />
    </svg>
  );
}

export function LogoLockup({ size = 40 }: LogoProps) {
  return (
    <span className="brand-lockup">
      <LogoMark size={size} />
      <span className="brand-copy">
        <strong>FrostTogether</strong>
        <small>WINTER COMMUNITY</small>
      </span>
    </span>
  );
}
