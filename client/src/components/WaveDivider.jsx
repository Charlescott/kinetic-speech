export default function WaveDivider({ className = "" }) {
  return (
    <svg
      className={`waveDivider ${className}`.trim()}
      viewBox="0 0 100 10"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M0,5 C16.7,8.5 33.3,8.5 50,5 C66.7,1.5 83.3,1.5 100,5 L100,10 L0,10 Z"
        fill="currentColor"
      />
      <path
        className="waveDivider__stroke"
        d="M0,5 C16.7,8.5 33.3,8.5 50,5 C66.7,1.5 83.3,1.5 100,5"
        fill="none"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
