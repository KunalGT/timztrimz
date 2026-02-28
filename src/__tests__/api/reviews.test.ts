import { describe, it, expect } from 'vitest'

const BASE_URL = 'http://localhost:3009'

describe('GET /api/reviews', () => {
  it('returns reviews', async () => {
    const res = await fetch(`${BASE_URL}/api/reviews`)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBeGreaterThan(0)
    expect(data[0]).toHaveProperty('rating')
    expect(data[0]).toHaveProperty('comment')
    expect(data[0]).toHaveProperty('booking')
  })

  it('respects limit parameter', async () => {
    const res = await fetch(`${BASE_URL}/api/reviews?limit=3`)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.length).toBeLessThanOrEqual(3)
  })
})
