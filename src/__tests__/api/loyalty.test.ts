import { describe, it, expect } from 'vitest'

const BASE_URL = 'http://localhost:3009'

describe('GET /api/loyalty', () => {
  it('returns loyalty data for known phone', async () => {
    const res = await fetch(`${BASE_URL}/api/loyalty?phone=07700900001`)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toHaveProperty('totalVisits')
    expect(data).toHaveProperty('stampsTowardsFree')
  })

  it('returns zero for unknown phone', async () => {
    const res = await fetch(`${BASE_URL}/api/loyalty?phone=00000000000`)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.totalVisits).toBe(0)
    expect(data.stampsTowardsFree).toBe(0)
  })

  it('returns 400 when phone is missing', async () => {
    const res = await fetch(`${BASE_URL}/api/loyalty`)
    expect(res.status).toBe(400)
  })
})
