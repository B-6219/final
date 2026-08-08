import { NavLink } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import Button from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6 pt-20">
      <p className="spec-strip text-racing-red text-8xl lg:text-9xl font-display leading-none">404</p>
      <h1 className="font-display text-bone text-3xl lg:text-4xl uppercase mt-6 mb-3">
        This road doesn't lead anywhere
      </h1>
      <p className="text-silver max-w-md text-sm mb-8">
        The page you're looking for has been sold, moved, or never existed.
        Head back to the inventory to keep browsing.
      </p>
      <NavLink to="/">
        <Button icon={FiArrowLeft}>Back to Home</Button>
      </NavLink>
    </div>
  )
}
