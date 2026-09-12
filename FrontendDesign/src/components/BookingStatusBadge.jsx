const CLASS_MAP = {
  Pending: 'status-pending',
  Accepted: 'status-accepted',
  'In Progress': 'status-inprogress',
  Completed: 'status-completed',
  Rejected: 'status-rejected',
  Cancelled: 'status-cancelled',
};

export default function BookingStatusBadge({ status }) {
  return <span className={`hf-badge-status ${CLASS_MAP[status] || 'status-pending'}`}>{status}</span>;
}
