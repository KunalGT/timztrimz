import { describe, it, expect } from 'vitest'

const BASE_URL = 'http://localhost:3009'

let authCookie: string = ''

describe('Admin API', () => {
  describe('Auth', () => {
    it('POST /api/admin/auth/login - valid PIN', async () => {
      const res = await fetch(`${BASE_URL}/api/admin/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: '1234' }),
      })
      expect(res.status).toBe(200)
      const cookie = res.headers.get('set-cookie')
      expect(cookie).toBeTruthy()
      expect(cookie).toContain('timztrimz_admin')
      authCookie = cookie!.split(';')[0]
    })

    it('POST /api/admin/auth/login - invalid PIN', async () => {
      const res = await fetch(`${BASE_URL}/api/admin/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: '9999' }),
      })
      expect(res.status).toBe(401)
    })
  })

  describe('Admin Bookings', () => {
    it('GET /api/admin/bookings - returns all bookings', async () => {
      const res = await fetch(`${BASE_URL}/api/admin/bookings`, {
        headers: { Cookie: authCookie },
      })
      expect(res.status).toBe(200)
      const data = await res.json()
      expect(Array.isArray(data)).toBe(true)
    })
  })

  describe('Admin Services', () => {
    let newServiceId: string

    it('GET /api/admin/services - returns all services', async () => {
      const res = await fetch(`${BASE_URL}/api/admin/services`, {
        headers: { Cookie: authCookie },
      })
      expect(res.status).toBe(200)
      const data = await res.json()
      expect(Array.isArray(data)).toBe(true)
    })

    it('POST /api/admin/services - creates a service', async () => {
      const res = await fetch(`${BASE_URL}/api/admin/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Cookie: authCookie },
        body: JSON.stringify({
          name: 'Test Service',
          description: 'A test service',
          category: 'Cuts',
          price: 15,
          duration: 30,
          active: true,
        }),
      })
      expect(res.status).toBe(201)
      const data = await res.json()
      expect(data.name).toBe('Test Service')
      newServiceId = data.id
    })

    it('PATCH /api/admin/services/[id] - updates a service', async () => {
      if (!newServiceId) return
      const res = await fetch(`${BASE_URL}/api/admin/services/${newServiceId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Cookie: authCookie },
        body: JSON.stringify({ price: 20 }),
      })
      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data.price).toBe(20)
    })

    it('DELETE /api/admin/services/[id] - deletes a service', async () => {
      if (!newServiceId) return
      const res = await fetch(`${BASE_URL}/api/admin/services/${newServiceId}`, {
        method: 'DELETE',
        headers: { Cookie: authCookie },
      })
      expect(res.status).toBe(200)
    })
  })

  describe('Admin Settings', () => {
    it('GET /api/admin/settings - returns settings', async () => {
      const res = await fetch(`${BASE_URL}/api/admin/settings`, {
        headers: { Cookie: authCookie },
      })
      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data).toHaveProperty('shopName')
      expect(data).toHaveProperty('openTime')
      expect(data).toHaveProperty('closeTime')
    })
  })

  describe('Admin Blocked Slots', () => {
    it('GET /api/admin/blocked-slots - returns blocked slots', async () => {
      const res = await fetch(`${BASE_URL}/api/admin/blocked-slots`, {
        headers: { Cookie: authCookie },
      })
      expect(res.status).toBe(200)
      const data = await res.json()
      expect(Array.isArray(data)).toBe(true)
    })
  })

  describe('Auth - Logout', () => {
    it('POST /api/admin/auth/logout - clears cookie', async () => {
      const res = await fetch(`${BASE_URL}/api/admin/auth/logout`, {
        method: 'POST',
        headers: { Cookie: authCookie },
      })
      expect(res.status).toBe(200)
      const cookie = res.headers.get('set-cookie')
      expect(cookie).toContain('timztrimz_admin=')
    })
  })
})
