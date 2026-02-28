import { describe, it, expect, beforeAll } from 'vitest'

const BASE_URL = 'http://localhost:3009'

function getNextWeekday(): string {
  const date = new Date()
  date.setDate(date.getDate() + 7)  // One week ahead to avoid conflicts
  while (date.getDay() === 0) {
    date.setDate(date.getDate() + 1)
  }
  return date.toISOString().split('T')[0]
}

let testServiceId: string
let testBookingId: string

describe('Bookings API', () => {
  beforeAll(async () => {
    const res = await fetch(`${BASE_URL}/api/services`)
    const services = await res.json()
    testServiceId = services[0].id
  })

  it('POST /api/bookings - creates a booking', async () => {
    const date = getNextWeekday()
    const res = await fetch(`${BASE_URL}/api/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientName: 'Test User',
        clientEmail: 'test@test.com',
        clientPhone: '07700900099',
        serviceId: testServiceId,
        date,
        startTime: '10:00',
      }),
    })
    expect(res.status).toBe(201)
    const data = await res.json()
    expect(data).toHaveProperty('id')
    expect(data.clientName).toBe('Test User')
    expect(data.status).toBe('confirmed')
    testBookingId = data.id
  })

  it('POST /api/bookings - rejects missing fields', async () => {
    const res = await fetch(`${BASE_URL}/api/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientName: 'Test User',
      }),
    })
    expect(res.status).toBe(400)
  })

  it('GET /api/bookings - filters by phone', async () => {
    const res = await fetch(`${BASE_URL}/api/bookings?phone=07700900099`)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(Array.isArray(data)).toBe(true)
    data.forEach((b: any) => {
      expect(b.clientPhone).toBe('07700900099')
    })
  })

  it('PATCH /api/bookings/[id] - cancels booking', async () => {
    if (!testBookingId) return
    const res = await fetch(`${BASE_URL}/api/bookings/${testBookingId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'cancelled' }),
    })
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.status).toBe('cancelled')
  })
})
