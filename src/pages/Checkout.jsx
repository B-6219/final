import { useMemo, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { FiCheck, FiCreditCard, FiSmartphone, FiArrowLeft, FiArrowRight, FiAlertCircle } from 'react-icons/fi'
import { Breadcrumbs, EmptyState } from '@/components/ui/States'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { formatPrice, cn } from '@/lib/utils'
import { useCart } from '@/hooks/useCart'
import { useAddresses } from '@/hooks/useAddresses'
import { useCreateOrder } from '@/hooks/useOrders'
import { usePayments } from '@/hooks/usePayments'
import { useToast } from '@/context/ToastContext'

const STEPS = ['Shipping', 'Payment', 'Review', 'Confirmation']

// Real cart items come from useCart(); placing the order calls
// useCreateOrder(), which hits api.orders.create once Convex is connected
// (and clears the cart server-side) or returns a mock order id otherwise.
// Immediately after, usePayments() fires the matching real Stripe/M-Pesa
// Convex action (convex/payments.js). Neither has API keys wired into this
// build — each action throws a clear "not configured" error until you run
// `npx convex env set STRIPE_SECRET_KEY ...` / the MPESA_* equivalents,
// which this page catches and surfaces as a toast rather than blocking
// order confirmation (the order itself is still saved as pending payment).
export default function Checkout() {
  const { items, clearCart } = useCart()
  const { addAddress } = useAddresses()
  const createOrder = useCreateOrder()
  const { chargeWithStripe, chargeWithMpesa } = usePayments()
  const { showToast } = useToast()

  const [step, setStep] = useState(0)
  const [shipping, setShipping] = useState({ fullName: '', line1: '', city: '', country: '', phone: '' })
  const [paymentMethod, setPaymentMethod] = useState('stripe')
  const [orderId, setOrderId] = useState(null)
  const [placing, setPlacing] = useState(false)
  const [paymentNote, setPaymentNote] = useState(null)

  const activeItems = items.filter((i) => !i.savedForLater)
  const subtotal = activeItems.reduce((sum, i) => sum + (i.vehicle?.price ?? 0) * i.quantity, 0)
  const tax = subtotal * 0.08
  const shippingFee = activeItems.length > 0 ? 1200 : 0
  const total = subtotal + tax + shippingFee

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1))
  const back = () => setStep((s) => Math.max(s - 1, 0))

  const shippingValid = shipping.fullName && shipping.line1 && shipping.city && shipping.country && shipping.phone

  const placeOrder = async () => {
    setPlacing(true)
    setPaymentNote(null)
    try {
      const addressId = await addAddress({
        fullName: shipping.fullName,
        line1: shipping.line1,
        city: shipping.city,
        country: shipping.country,
        phone: shipping.phone,
        postalCode: '00000',
      })
      const id = await createOrder({
        items: activeItems.map((i) => ({ vehicleId: i.vehicle.id, price: i.vehicle.price, quantity: i.quantity })),
        addressId,
        subtotal,
        tax,
        shipping: shippingFee,
        discount: 0,
        total,
        paymentMethod,
      })
      setOrderId(id)

      // Attempt the real charge. A "not configured" error here is expected
      // during setup — the order is already saved as pending, so we still
      // move to the confirmation step and just surface what happened.
      try {
        if (paymentMethod === 'stripe') {
          const { clientSecret } = await chargeWithStripe({ amount: Math.round(total * 100), currency: 'usd', orderId: String(id) })
          setPaymentNote({ type: 'success', text: `Stripe PaymentIntent created (${clientSecret.slice(0, 20)}…) — confirm client-side with Stripe.js to complete the charge.` })
        } else {
          const { customerMessage } = await chargeWithMpesa({
            phone: shipping.phone.replace(/^0/, '254').replace(/\D/g, ''),
            amount: Math.round(total),
            orderId: String(id),
            callbackUrl: 'https://example.com/mpesa/callback', // replace with your deployed webhook
          })
          setPaymentNote({ type: 'success', text: customerMessage || 'M-Pesa STK push sent to your phone.' })
        }
      } catch (paymentErr) {
        setPaymentNote({ type: 'info', text: paymentErr.message })
      }

      clearCart()
      next()
    } catch (err) {
      showToast(err.message || 'Could not place order', 'error')
    } finally {
      setPlacing(false)
    }
  }

  if (activeItems.length === 0 && step < 3) {
    return (
      <div className="pt-28">
        <EmptyState
          title="Your cart is empty"
          message="Add a vehicle to your cart before checking out."
          action={<NavLink to="/shop"><Button>Browse Inventory</Button></NavLink>}
        />
      </div>
    )
  }

  return (
    <div className="pt-28 pb-24">
      <div className="mx-auto max-w-5xl px-6 lg:px-10">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Cart', to: '/cart' }, { label: 'Checkout' }]} />
        <h1 className="font-display text-4xl lg:text-5xl uppercase text-bone mt-4 mb-10">Checkout</h1>

        {/* Stepper */}
        <ol className="flex items-center mb-12">
          {STEPS.map((label, i) => (
            <li key={label} className="flex items-center flex-1 last:flex-none">
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    'w-8 h-8 flex items-center justify-center font-display text-sm shrink-0 border',
                    i < step && 'bg-amber border-amber text-obsidian',
                    i === step && 'border-racing-red text-racing-red',
                    i > step && 'border-graphite-light text-silver-dim'
                  )}
                >
                  {i < step ? <FiCheck size={16} /> : i + 1}
                </span>
                <span className={cn('font-display uppercase text-sm hidden sm:block', i <= step ? 'text-bone' : 'text-silver-dim')}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={cn('flex-1 h-px mx-4', i < step ? 'bg-amber' : 'bg-graphite-light')} />
              )}
            </li>
          ))}
        </ol>

        {/* Step 0 — Shipping */}
        {step === 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
            <Input label="Full Name" id="fullName" value={shipping.fullName}
              onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })} placeholder="Jane Mwangi" />
            <Input label="Phone" id="phone" value={shipping.phone}
              onChange={(e) => setShipping({ ...shipping, phone: e.target.value })} placeholder="+254 7XX XXX XXX" />
            <Input label="Address" id="line1" className="sm:col-span-2" value={shipping.line1}
              onChange={(e) => setShipping({ ...shipping, line1: e.target.value })} placeholder="Street address" />
            <Input label="City" id="city" value={shipping.city}
              onChange={(e) => setShipping({ ...shipping, city: e.target.value })} placeholder="Nairobi" />
            <Input label="Country" id="country" value={shipping.country}
              onChange={(e) => setShipping({ ...shipping, country: e.target.value })} placeholder="Kenya" />
          </div>
        )}

        {/* Step 1 — Payment */}
        {step === 1 && (
          <div className="max-w-2xl">
            <div className="flex gap-4 mb-8">
              <PaymentTab
                active={paymentMethod === 'stripe'}
                icon={FiCreditCard}
                label="Card (Stripe)"
                onClick={() => setPaymentMethod('stripe')}
              />
              <PaymentTab
                active={paymentMethod === 'mpesa'}
                icon={FiSmartphone}
                label="M-Pesa"
                onClick={() => setPaymentMethod('mpesa')}
              />
            </div>

            {paymentMethod === 'stripe' ? (
              <div className="border border-graphite-light p-6">
                <p className="text-silver text-sm mb-4">
                  Card details are collected securely by Stripe Elements at checkout time —
                  no card data ever touches this app's servers.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 opacity-50 pointer-events-none">
                  <Input label="Card Number" placeholder="•••• •••• •••• ••••" />
                  <Input label="Expiry" placeholder="MM / YY" />
                  <Input label="CVC" placeholder="•••" />
                  <Input label="Name on Card" placeholder="Jane Mwangi" />
                </div>
                <p className="spec-strip text-amber text-xs mt-4 uppercase tracking-wide">
                  Stripe integration point — add VITE_STRIPE_PUBLISHABLE_KEY to enable
                </p>
              </div>
            ) : (
              <div className="border border-graphite-light p-6">
                <p className="text-silver text-sm mb-4">
                  You'll receive an STK push prompt on your phone to complete payment via M-Pesa.
                </p>
                <div className="opacity-50 pointer-events-none">
                  <Input label="M-Pesa Phone Number" placeholder="+254 7XX XXX XXX" />
                </div>
                <p className="spec-strip text-amber text-xs mt-4 uppercase tracking-wide">
                  Daraja API integration point — add MPESA_* keys to enable
                </p>
              </div>
            )}
          </div>
        )}

        {/* Step 2 — Review */}
        {step === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
            <div>
              <h3 className="font-display uppercase text-bone text-lg mb-4">Shipping To</h3>
              <p className="text-silver text-sm mb-8">
                {shipping.fullName}, {shipping.line1}, {shipping.city}, {shipping.country} · {shipping.phone}
              </p>
              <h3 className="font-display uppercase text-bone text-lg mb-4">Items</h3>
              <div className="flex flex-col gap-3">
                {activeItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 border border-graphite-light p-3">
                    <img src={item.vehicle.image} alt={item.vehicle.model} className="w-20 h-14 object-cover" />
                    <div className="flex-1">
                      <p className="text-bone text-sm font-display uppercase">{item.vehicle.brand} {item.vehicle.model}</p>
                    </div>
                    <p className="text-bone text-sm">{formatPrice(item.vehicle.price)}</p>
                  </div>
                ))}
              </div>
            </div>
            <aside className="border border-graphite-light p-6 h-fit">
              <h3 className="font-display uppercase text-bone text-lg mb-6">Order Total</h3>
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between"><span className="text-silver">Subtotal</span><span className="text-bone">{formatPrice(subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-silver">Tax</span><span className="text-bone">{formatPrice(tax)}</span></div>
                <div className="flex justify-between"><span className="text-silver">Shipping</span><span className="text-bone">{formatPrice(shippingFee)}</span></div>
              </div>
              <div className="border-t border-graphite-light mt-4 pt-4 flex justify-between">
                <span className="font-display uppercase text-bone">Total</span>
                <span className="font-display text-2xl text-bone">{formatPrice(total)}</span>
              </div>
              <p className="text-silver-dim text-xs mt-3 uppercase tracking-wide">
                Paying via {paymentMethod === 'stripe' ? 'Card (Stripe)' : 'M-Pesa'}
              </p>
            </aside>
          </div>
        )}

        {/* Step 3 — Confirmation */}
        {step === 3 && (
          <div className="max-w-lg mx-auto text-center py-12">
            <div className="w-16 h-16 rounded-full bg-amber/10 border border-amber flex items-center justify-center mx-auto mb-6">
              <FiCheck size={28} className="text-amber" />
            </div>
            <h2 className="font-display text-3xl uppercase text-bone mb-3">Order Confirmed</h2>
            <p className="text-silver text-sm mb-2">
              Order <span className="text-amber spec-strip">#{orderId}</span> has been placed.
            </p>
            <p className="text-silver text-sm mb-6">
              A confirmation has been sent, and Chief Motors will be in touch to arrange delivery.
            </p>

            {paymentNote && (
              <div className={cn(
                'flex items-start gap-2 text-left text-xs p-4 border mb-8',
                paymentNote.type === 'success' ? 'border-amber/40 text-amber' : 'border-graphite-light text-silver'
              )}>
                <FiAlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{paymentNote.text}</span>
              </div>
            )}

            <NavLink to="/dashboard/orders"><Button>View Order History</Button></NavLink>
          </div>
        )}

        {/* Nav buttons */}
        {step < 3 && (
          <div className="flex items-center justify-between mt-12 max-w-2xl">
            <Button variant="ghost" icon={FiArrowLeft} onClick={back} disabled={step === 0}>Back</Button>
            <Button
              icon={FiArrowRight}
              iconPosition="right"
              onClick={step === 2 ? placeOrder : next}
              disabled={(step === 0 && !shippingValid) || placing}
            >
              {placing ? 'Placing Order…' : step === 2 ? 'Place Order' : 'Continue'}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

function PaymentTab({ active, icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 px-5 py-3 border font-display text-sm uppercase tracking-wide transition-colors',
        active ? 'border-racing-red text-bone bg-racing-red/10' : 'border-graphite-light text-silver hover:border-bone'
      )}
    >
      <Icon size={16} /> {label}
    </button>
  )
}
