import { describe, it, expect } from 'vitest'

const BASE_URL = 'http://localhost:3009'

describe('GET /api/gallery', () => {
  it('returns gallery images', async () => {
    const res = await fetch(`${BASE_URL}/api/gallery`)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBeGreaterThan(0)
    expect(data[0]).toHaveProperty('url')
    expect(data[0]).toHaveProperty('category')
  })

  it('filters by category', async () => {
    const res = await fetch(`${BASE_URL}/api/gallery?category=fades`)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(Array.isArray(data)).toBe(true)
    data.forEach((img: any) => {
      expect(img.category).toBe('fades')
    })
  })
})
