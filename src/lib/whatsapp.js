// Single source of truth for the dealership's WhatsApp number. No pricing
// is shown anywhere in the app by design — every listing routes interested
// buyers here instead, which is how this dealership actually transacts.
export const WHATSAPP_NUMBER = '254791948411' // +254 791 948 411, no leading +/00 for wa.me

/**
 * Builds a wa.me link with a prefilled message referencing the specific
 * listing, so the dealer immediately knows what the customer is asking
 * about instead of getting a blank "hi".
 */
export function buildWhatsAppLink(item, { kind = 'vehicle' } = {}) {
  if (!item) {
    return `https://wa.me/${WHATSAPP_NUMBER}`
  }
  const label = kind === 'bike' ? 'bike' : 'car'
  const message = `Hi Al-Husnain Motors, I'm interested in the ${item.year ?? ''} ${item.brand ?? ''} ${item.model ?? ''} (${label} ID: ${item.id}). Is it still available?`
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message.trim())}`
}
