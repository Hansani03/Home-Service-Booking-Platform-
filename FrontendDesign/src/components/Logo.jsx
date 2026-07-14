export default function Logo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="64" height="64" rx="14" fill="#123524" />
      <path d="M32 12 L52 28 V50 H12 V28 Z" fill="none" stroke="#C9A24B" strokeWidth="4" strokeLinejoin="round" />
      <path d="M26 38 L30 42 L40 30" fill="none" stroke="#C9A24B" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
