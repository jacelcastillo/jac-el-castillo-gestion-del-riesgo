import { z } from 'zod'
import { validationMessages as msg } from '../../config/incident.ts'
import type { IncidentDraft } from '../../types/incident.ts'

const locationSchema = z
  .object({
    mode: z.enum(['gps', 'manual']),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    accuracy: z.number().optional(),
    address: z.string().trim().optional(),
    reference: z.string().trim().max(160).optional(),
  })
  .superRefine((location, ctx) => {
    const hasCoords = location.latitude !== undefined && location.longitude !== undefined
    const address = location.address ?? ''
    if (location.mode === 'gps' && hasCoords) return
    if (address.length === 0) {
      ctx.addIssue({ code: 'custom', path: ['address'], message: msg.locationRequired })
    } else if (address.length < 4) {
      ctx.addIssue({ code: 'custom', path: ['address'], message: msg.addressTooShort })
    }
  })

const contactSchema = z
  .object({
    anonymous: z.boolean(),
    name: z.string().trim().optional(),
    phone: z.string().trim().optional(),
  })
  .superRefine((contact, ctx) => {
    if (contact.anonymous) return
    if (!contact.name || contact.name.length < 2) {
      ctx.addIssue({ code: 'custom', path: ['name'], message: msg.nameRequired })
    }
    const digits = (contact.phone ?? '').replace(/\D/g, '')
    if (!/^3\d{9}$/.test(digits) && !/^60\d{8}$/.test(digits)) {
      ctx.addIssue({ code: 'custom', path: ['phone'], message: msg.phoneInvalid })
    }
  })

export const incidentSchema = z.object({
  type: z.enum(['deslizamiento', 'inundacion', 'incendio', 'sismo', 'vendaval', 'electrico', 'otro'], {
    error: msg.typeRequired,
  }),
  location: locationSchema,
  description: z.string().trim().min(10, msg.descriptionMin).max(600, msg.descriptionMax),
  severity: z.enum(['baja', 'media', 'alta'], { error: msg.severityRequired }),
  peopleAffected: z.enum(['si', 'no', 'no_se'], { error: msg.peopleRequired }),
  photo: z
    .object({
      dataUrl: z.string(),
      width: z.number(),
      height: z.number(),
      sizeKb: z.number(),
    })
    .optional(),
  contact: contactSchema,
  consent: z.literal(true, { error: msg.consentRequired }),
}) satisfies z.ZodType<IncidentDraft>

export type IncidentFormValues = z.infer<typeof incidentSchema>

/** Cuerpo que acepta el BFF: el mismo formulario más la identidad del reporte, sin foto. */
export const reportRequestSchema = incidentSchema.omit({ photo: true }).extend({
  id: z.uuid(),
  createdAt: z.iso.datetime(),
})

export type ReportRequest = z.infer<typeof reportRequestSchema>
