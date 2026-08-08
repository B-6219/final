import { SignUp as ClerkSignUp } from '@clerk/clerk-react'
import { ClerkNotConfigured } from './SignIn'

const clerkConfigured = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY)

export default function SignUp() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center pt-20 px-6">
      {clerkConfigured ? (
        <ClerkSignUp
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
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
