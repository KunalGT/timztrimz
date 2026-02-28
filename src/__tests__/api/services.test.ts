import { describe, it, expect } from 'vitest'

const BASE_URL = 'http://localhost:3009'

describe('GET /api/services', () => {
  it('returns all active services', async () => {
    const res = await fetch(`${BASE_URL}/api/services`)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBeGreaterThan(0)
    expect(data[0]).toHaveProperty('name')
    expect(data[0]).toHaveProperty('price')
    expect(data[0]).toHaveProperty('duration')
    expect(data[0]).toHaveProperty('category')
  })

  it('filters services by category', async () => {
    const res = await fetch(`${BASE_URL}/api/services?category=Cuts`)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(Array.isArray(data)).toBe(true)
    data.forEach((service: any) => {
      expect(service.category).toBe('Cuts')
    })
  })

  it('returns empty array for invalid category', async () => {
    const res = await fetch(`${BASE_URL}/api/services?category=NonExistent`)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBe(0)
  })
})
