import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';

const TYPE_ICON = {
  Booking: 'bi-calendar-check',
  Payment: 'bi-credit-card',
  Reminder: 'bi-star',
};

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const visible = showAll ? notifications : notifications.filter((n) => !n.read);

  return (
    <div className="position-relative" ref={ref}>
      <button
        className="btn btn-link text-white position-relative p-2"
        style={{ textDecoration: 'none' }}
        onClick={() => setOpen((o) => !o)}
        aria-label="Notifications"
      >
        <i className="bi bi-bell-fill fs-5" />
        {unreadCount > 0 && <span className="hf-notif-dot">{unreadCount > 9 ? '9+' : unreadCount}</span>}
      </button>

      {open && (
        <div
          className="position-absolute end-0 mt-2 bg-white rounded-3 shadow-lg"
          style={{ width: 360, maxHeight: 460, overflowY: 'auto', zIndex: 1050, border: '1px solid var(--hf-border)' }}
        >
          <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
            <div>
              <div className="fw-bold">{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</div>
              <button className="btn btn-link btn-sm p-0 text-decoration-none" onClick={() => setShowAll((s) => !s)}>
                {showAll ? 'Show unread only' : 'View read notifications'}
              </button>
            </div>
            {unreadCount > 0 && (
              <button className="btn btn-hf-outline btn-sm" onClick={markAllAsRead}>
                Mark all read
              </button>
            )}
          </div>

          {visible.length === 0 && <div className="p-4 text-center text-muted small">You're all caught up.</div>}

          {visible.map((n) => (
            <div key={n.id} className={`d-flex gap-2 p-3 border-bottom ${!n.read ? 'bg-light' : ''}`}>
              <div className="flex-shrink-0">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: 36, height: 36, background: 'var(--hf-green-100)', color: 'var(--hf-green-800)' }}
                >
                  <i className={`bi ${TYPE_ICON[n.type] || 'bi-bell'}`} />
                </div>
              </div>
              <div className="flex-grow-1">
                <div className="small">{n.message}</div>
                <div className="d-flex justify-content-between align-items-center mt-1">
                  <span className="text-muted" style={{ fontSize: '0.72rem' }}>
                    {timeAgo(n.createdAt)}
                  </span>
                  <div className="d-flex gap-2">
                    {n.type === 'Reminder' && (
                      <button
                        className="btn btn-link btn-sm p-0 text-decoration-none"
                        onClick={() => {
                          setOpen(false);
                          navigate(`/customer/bookings/${n.bookingId}/rate`);
                        }}
                      >
                        Rate Provider
                      </button>
                    )}
                    {!n.read && (
                      <button className="btn btn-link btn-sm p-0 text-decoration-none" onClick={() => markAsRead(n.id)}>
                        Mark as Read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
