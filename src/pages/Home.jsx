import Hero from '@/components/layout/Hero'
import BrandsStrip from '@/components/layout/BrandsStrip'
import FeaturedVehicles from '@/components/layout/FeaturedVehicles'
import CategoriesGrid from '@/components/layout/CategoriesGrid'
import WhyChooseUs from '@/components/layout/WhyChooseUs'

export default function Home() {
  return (
    <>
      <Hero />
      <BrandsStrip />
      <FeaturedVehicles />
      <CategoriesGrid />
      <WhyChooseUs />
    </>
  )
}
