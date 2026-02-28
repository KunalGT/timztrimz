import { describe, it, expect } from 'vitest'

const BASE_URL = 'http://localhost:3009'

// Get next weekday (not Sunday)
function getNextWeekday(): string {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  while (date.getDay() === 0) {
    date.setDate(date.getDate() + 1)
  }
  return date.toISOString().split('T')[0]
}

function getNextSunday(): string {
  const date = new Date()
  while (date.getDay() !== 0) {
    date.setDate(date.getDate() + 1)
  }
  return date.toISOString().split('T')[0]
}

describe('GET /api/availability', () => {
  it('returns time slots for a valid weekday', async () => {
    const date = getNextWeekday()
    const res = await fetch(`${BASE_URL}/api/availability?date=${date}&duration=30`)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toHaveProperty('slots')
    expect(Array.isArray(data.slots)).toBe(true)
    if (data.slots.length > 0) {
      expect(data.slots[0]).toHaveProperty('time')
      expect(data.slots[0]).toHaveProperty('available')
    }
  })

  it('returns dayOff for Sunday', async () => {
    const sunday = getNextSunday()
    const res = await fetch(`${BASE_URL}/api/availability?date=${sunday}&duration=30`)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.dayOff).toBe(true)
  })

  it('returns 400 when date is missing', async () => {
    const res = await fetch(`${BASE_URL}/api/availability?duration=30`)
    expect(res.status).toBe(400)
  })
})
