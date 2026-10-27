export const consultationPolicy = {
  action: 'plan-inquiry',
  maxBodyBytes: 3_000_000,
  maxReceiptBytes: 2_097_152,
  maxLengths: {
    name: 100,
    business: 200,
    email: 254,
    phone: 40,
    message: 6000,
  },
} as const
