export default function WaveDivider({ className = "" }) {
  return (
    <svg
      className={`waveDivider ${className}`.trim()}
      viewBox="0 0 100 8"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M0 1.5 C12.5 5.3 12.5 5.3 25 1.5 S37.5 -2.3 50 1.5 S62.5 5.3 75 1.5 S87.5 -2.3 100 1.5 V8 H0 Z"
        fill="currentColor"
      />
      <path
        d="M0 1.5 C12.5 5.3 12.5 5.3 25 1.5 S37.5 -2.3 50 1.5 S62.5 5.3 75 1.5 S87.5 -2.3 100 1.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.45"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
