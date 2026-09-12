export default function RatingStars({ rating = 0, count, size = '0.9rem' }) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;
  const stars = [];
  for (let i = 0; i < 5; i++) {
    let icon = 'bi-star';
    if (i < full) icon = 'bi-star-fill';
    else if (i === full && hasHalf) icon = 'bi-star-half';
    stars.push(<i key={i} className={`bi ${icon}`} style={{ fontSize: size, color: 'var(--hf-gold-600)' }} />);
  }
  return (
    <span className="d-inline-flex align-items-center gap-1">
      <span className="d-inline-flex gap-1">{stars}</span>
      <span className="hf-rating">{rating.toFixed(1)}</span>
      {typeof count === 'number' && <span className="text-muted small">({count})</span>}
    </span>
  );
}
