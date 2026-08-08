import { SignIn as ClerkSignIn } from '@clerk/clerk-react'
import { FiKey } from 'react-icons/fi'

const clerkConfigured = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY)

export default function SignIn() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center pt-20 px-6">
      {clerkConfigured ? (
        <ClerkSignIn
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          appearance={{
            variables: {
              colorPrimary: '#d91c2b',
              colorBackground: '#1a1b1e',
              colorText: '#f6f5f2',
              colorInputBackground: '#0b0b0c',
              colorInputText: '#f6f5f2',
              borderRadius: '0px',
            },
          }}
        />
      ) : (
        <ClerkNotConfigured />
      )}
    </div>
  )
}

export function ClerkNotConfigured() {
  return (
    <div className="text-center max-w-md border border-graphite-light p-10">
      <FiKey size={28} className="text-amber mx-auto mb-4" />
      <h1 className="font-display text-2xl uppercase text-bone mb-3">Clerk Not Connected Yet</h1>
      <p className="text-silver text-sm leading-relaxed">
        Add your <code className="text-amber">VITE_CLERK_PUBLISHABLE_KEY</code> to{' '}
        <code className="text-amber">.env.local</code> and restart the dev server to enable
        sign in, sign up, and Google authentication here.
      </p>
    </div>
  )
}
