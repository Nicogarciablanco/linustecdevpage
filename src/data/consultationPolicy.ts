export const consultationPolicy = {
  action: 'plan-inquiry',
  maxBodyBytes: 32_768,
  maxMaterialUrlLength: 2048,
  maxLengths: {
    name: 100,
    business: 200,
    email: 254,
    phone: 40,
    message: 6000,
  },
} as const

export function validMaterialUrl(value: unknown): value is string {
  if (
    typeof value !== 'string' ||
    value.length > consultationPolicy.maxMaterialUrlLength
  )
    return false
  if (!value) return false
  if (
    !/^https?:\/\/[^/]/i.test(value) ||
    /\s|[\u2028\u2029\u202a-\u202e\u2066-\u2069\\]/u.test(value) ||
    Array.from(value).some((char) => {
      const code = char.charCodeAt(0)
      return code < 32 || code === 127
    })
  )
    return false
  try {
    const url = new URL(value)
    return (
      (url.protocol === 'https:' || url.protocol === 'http:') &&
      !!url.hostname &&
      !url.username &&
      !url.password
    )
  } catch {
    return false
  }
}
