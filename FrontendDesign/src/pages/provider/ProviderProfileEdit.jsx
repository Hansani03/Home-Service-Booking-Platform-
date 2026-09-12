import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as providerService from '../../services/providerService';
import RatingStars from '../../components/RatingStars';

export default function ProviderProfileEdit() {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    location: user.location,
    experienceYears: user.experienceYears,
    hourlyRate: user.hourlyRate,
    available: user.available,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setSaved(false);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    const updated = await providerService.updateProviderProfile(user.id, {
      ...form,
      businessName: `${form.firstName} ${form.lastName}`,
      experienceYears: Number(form.experienceYears),
      hourlyRate: Number(form.hourlyRate),
    });
    refreshUser(updated);
    setSaving(false);
    setSaved(true);
  }

  return (
    <div className="container py-5" style={{ maxWidth: 640 }}>
      <div className="hf-card p-4">
        <div className="d-flex justify-content-between align-items-start mb-4">
          <div>
            <h4 className="hf-section-title mb-0">{user.businessName} : PD-{user.id}</h4>
            <RatingStars rating={user.rating} count={user.ratingCount} />
          </div>
        </div>

        {saved && <div className="alert alert-success py-2 small">Profile updated successfully.</div>}

        <form onSubmit={handleSave}>
          <div className="row g-3 mb-3">
            <div className="col-sm-6">
              <label className="form-label small">First Name</label>
              <input className="form-control" value={form.firstName} onChange={(e) => update('firstName', e.target.value)} />
            </div>
            <div className="col-sm-6">
              <label className="form-label small">Last Name</label>
              <input className="form-control" value={form.lastName} onChange={(e) => update('lastName', e.target.value)} />
            </div>
            <div className="col-sm-6">
              <label className="form-label small">Email</label>
              <input type="email" className="form-control" value={form.email} onChange={(e) => update('email', e.target.value)} />
            </div>
            <div className="col-sm-6">
              <label className="form-label small">Phone</label>
              <input className="form-control" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
            </div>
            <div className="col-sm-6">
              <label className="form-label small">City</label>
              <input className="form-control" value={form.location} onChange={(e) => update('location', e.target.value)} />
            </div>
            <div className="col-sm-6">
              <label className="form-label small">Years of Experience</label>
              <input type="number" min={0} className="form-control" value={form.experienceYears} onChange={(e) => update('experienceYears', e.target.value)} />
            </div>
            <div className="col-sm-6">
              <label className="form-label small">Hourly Rate (Rs.)</label>
              <input type="number" min={0} className="form-control" value={form.hourlyRate} onChange={(e) => update('hourlyRate', e.target.value)} />
            </div>
            <div className="col-sm-6">
              <label className="form-label small d-block">Availability</label>
              <div className="form-check form-switch mt-2">
                <input className="form-check-input" type="checkbox" checked={form.available} onChange={(e) => update('available', e.target.checked)} id="availSwitch" />
                <label className="form-check-label" htmlFor="availSwitch">
                  {form.available ? 'Available' : 'Unavailable'}
                </label>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-end">
            <button className="btn btn-hf-primary" type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Save Changes?'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
