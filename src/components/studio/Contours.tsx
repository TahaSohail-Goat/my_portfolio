export function Contours({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`contours ${className}`}
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      aria-hidden="true"
    >
      {Array.from({ length: 12 }, (_, i) => (
        <path
          key={i}
          d={`M ${-350 + i * 63} -100 C ${-150 + i * 80} ${200 + i * 10}, ${750 - i * 27} ${-200 + i * 42}, ${560 + i * 48} 260 S ${40 + i * 40} ${520 - i * 10}, ${420 + i * 54} 700 S ${1000 + i * 40} 530, ${1300 + i * 65} 1100`}
          stroke="currentColor"
          strokeWidth="1"
        />
      ))}
    </svg>
  );
}
