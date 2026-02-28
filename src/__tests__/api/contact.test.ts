import { describe, it, expect } from 'vitest'

const BASE_URL = 'http://localhost:3009'

describe('POST /api/contact', () => {
  it('accepts valid contact form submission', async () => {
    const res = await fetch(`${BASE_URL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@test.com',
        message: 'Test message',
      }),
    })
    expect(res.status).toBe(200)
  })

  it('rejects incomplete submission', async () => {
    const res = await fetch(`${BASE_URL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test' }),
    })
    expect(res.status).toBe(400)
  })
})
