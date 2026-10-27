import { plans, planContent } from '../../src/data/plans.ts'
import { consultationPolicy as policy } from '../../src/data/consultationPolicy.ts'
import type { ConsultationPayload } from '../../src/types/consultation.ts'
import type { RequestContact } from '../../src/types/plan.ts'

function record(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

function onlyKeys(value: Record<string, unknown>, keys: string[]) {
  return Object.keys(value).every((key) => keys.includes(key))
}

function text(value: unknown, max: number, multiline = false): value is string {
  return (
    typeof value === 'string' &&
    value.trim().length > 0 &&
    value.length <= max &&
    !Array.from(value).some((char) => {
      const code = char.charCodeAt(0)
      return (
        (code < 32 || code === 127) &&
        !(multiline && [9, 10, 13].includes(code))
      )
    })
  )
}

function contact(value: unknown, custom: boolean): value is RequestContact {
  if (
    !record(value) ||
    !onlyKeys(value, [
      'name',
      'business',
      'email',
      'phone',
      'message',
      'domain',
    ])
  )
    return false
  if (
    !Object.entries(policy.maxLengths).every(([key, max]) =>
      (key === 'business' || key === 'message') && !custom
        ? value[key] === '' || text(value[key], max, key === 'message')
        : text(value[key], max, key === 'message'),
    )
  )
    return false
  return (
    /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test((value.email as string).trim()) &&
    /^[+\d\s().-]+$/.test(value.phone as string) &&
    (value.phone as string).replace(/\D/g, '').length >= 8 &&
    (value.phone as string).replace(/\D/g, '').length <= 20 &&
    planContent.domainOptions.some((option) => option.value === value.domain)
  )
}

function ids(value: unknown, allowed: string[]): value is string[] {
  return (
    Array.isArray(value) &&
    value.length <= allowed.length &&
    value.every((id) => typeof id === 'string' && allowed.includes(id)) &&
    new Set(value).size === value.length
  )
}

export function validReceipt(
  value: unknown,
): value is NonNullable<ConsultationPayload['receipt']> {
  if (
    !record(value) ||
    !onlyKeys(value, ['mediaType', 'content']) ||
    !['application/pdf', 'image/png', 'image/jpeg'].includes(
      String(value.mediaType),
    ) ||
    typeof value.content !== 'string' ||
    value.content.length < 8 ||
    value.content.length > 4 * Math.ceil(policy.maxReceiptBytes / 3) ||
    !/^[A-Za-z0-9+/]+={0,2}$/.test(value.content)
  )
    return false
  try {
    const bytes = atob(value.content)
    if (
      !bytes.length ||
      bytes.length > policy.maxReceiptBytes ||
      btoa(bytes) !== value.content
    )
      return false
    if (value.mediaType === 'application/pdf') return bytes.startsWith('%PDF-')
    if (value.mediaType === 'image/png')
      return bytes.startsWith('\x89PNG\r\n\x1a\n')
    return bytes.startsWith('\xff\xd8\xff')
  } catch {
    return false
  }
}

export function validatePayload(value: unknown): ConsultationPayload | null {
  if (
    !record(value) ||
    !onlyKeys(value, [
      'requestId',
      'planId',
      'selectedChoiceIds',
      'selectedExtraIds',
      'contact',
      'couponCode',
      'receipt',
      'turnstileToken',
    ])
  )
    return null
  if (
    typeof value.requestId !== 'string' ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value.requestId,
    )
  )
    return null
  const plan = plans.find((item) => item.id === value.planId)
  if (
    !plan ||
    !contact(value.contact, plan.id === 'medida') ||
    !ids(
      value.selectedChoiceIds,
      plan.choices.map((item) => item.id),
    ) ||
    !ids(
      value.selectedExtraIds,
      plan.extras.map((item) => item.id),
    )
  )
    return null
  if (plan.choiceMode === 'single' && value.selectedChoiceIds.length !== 1)
    return null
  const selectedExtras = plan.extras.filter((extra) =>
    (value.selectedExtraIds as string[]).includes(extra.id),
  )
  if (selectedExtras.some((extra) => extra.price.status !== 'defined'))
    return null
  const groups = selectedExtras.map((extra) => extra.group).filter(Boolean)
  if (new Set(groups).size !== groups.length) return null
  if (plan.id === 'medida') {
    if (value.receipt !== undefined || value.couponCode !== undefined)
      return null
  } else {
    if (!validReceipt(value.receipt)) return null
    if (
      value.couponCode !== undefined &&
      (typeof value.couponCode !== 'string' ||
        !/^[A-Z0-9_-]{1,32}$/.test(value.couponCode))
    )
      return null
  }
  if (!text(value.turnstileToken, 2048)) return null
  return {
    requestId: value.requestId,
    planId: plan.id,
    selectedChoiceIds: value.selectedChoiceIds,
    selectedExtraIds: value.selectedExtraIds,
    contact: {
      ...value.contact,
      name: value.contact.name.trim(),
      business: value.contact.business.trim(),
      email: value.contact.email.trim().toLowerCase(),
      phone: value.contact.phone.trim(),
      message: value.contact.message.trim(),
    },
    ...(plan.id === 'medida'
      ? {}
      : {
          receipt: value.receipt as NonNullable<ConsultationPayload['receipt']>,
          ...(value.couponCode
            ? { couponCode: value.couponCode as string }
            : {}),
        }),
    turnstileToken: value.turnstileToken,
  }
}
