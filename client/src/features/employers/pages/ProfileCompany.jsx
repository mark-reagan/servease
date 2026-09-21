import { useEffect, useState } from 'react'
import { api, ApiError } from '../../../shared/api/client'
import { useAuth } from '../../auth/context/AuthContext'
import Spinner from '../../../shared/components/Spinner'

export default function ProfileCompany() {
  const { user, refresh } = useAuth()
  const [form, setForm] = useState(null)
  const [logoFile, setLogoFile] = useState(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (user?.company_profile) {
      setForm({
        company_name: user.company_profile.company_name || '',
        description: user.company_profile.description || '',
        website: user.company_profile.website || '',
        industry: user.company_profile.industry || '',
        company_size: user.company_profile.company_size || '',
        location: user.company_profile.location || '',
      })
    }
  }, [user])

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    setError('')

    const data = new FormData()
    Object.entries(form).forEach(([key, value]) => data.append(key, value ?? ''))
    if (logoFile) data.append('logo', logoFile)

    try {
      await api.put('/profile/company', data)
      await refresh()
      setMessage('Company profile updated.')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not save your company profile.')
    } finally {
      setSaving(false)
    }
  }

  if (!form) {
    return (
      <div className="py-24 flex justify-center">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl mb-1">Company profile</h1>
      <p className="text-ink-muted text-sm mb-8">
        Candidates see this on your job postings and company page.
      </p>

      {message && <p className="text-teal text-sm mb-4">{message}</p>}
      {error && <p className="text-rust text-sm mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="field-label" htmlFor="company_name">Company name</label>
          <input
            id="company_name"
            className="field-input"
            value={form.company_name}
            onChange={(e) => update('company_name', e.target.value)}
          />
        </div>

        <div>
          <label className="field-label" htmlFor="description">Description</label>
          <textarea
            id="description"
            rows={5}
            className="field-input"
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="field-label" htmlFor="website">Website</label>
            <input
              id="website"
              className="field-input"
              placeholder="https://"
              value={form.website}
              onChange={(e) => update('website', e.target.value)}
            />
          </div>
          <div>
            <label className="field-label" htmlFor="industry">Industry</label>
            <input
              id="industry"
              className="field-input"
              value={form.industry}
              onChange={(e) => update('industry', e.target.value)}
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="field-label" htmlFor="company_size">Company size</label>
            <input
              id="company_size"
              className="field-input"
              placeholder="e.g. 11-50"
              value={form.company_size}
              onChange={(e) => update('company_size', e.target.value)}
            />
          </div>
          <div>
            <label className="field-label" htmlFor="location">Location</label>
            <input
              id="location"
              className="field-input"
              value={form.location}
              onChange={(e) => update('location', e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="field-label" htmlFor="logo">Logo</label>
          <input
            id="logo"
            type="file"
            accept="image/*"
            className="field-input"
            onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
          />
        </div>

        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Saving…' : 'Save company profile'}
        </button>
      </form>
    </div>
  )
}
