// import { NavLink } from 'react-router-dom'
// import { motion } from 'framer-motion'
// import { FiArrowUpRight } from 'react-icons/fi'
// import { Breadcrumbs } from '@/components/ui/States'
// import { useBrands } from '@/hooks/useTaxonomy'
// import { useVehicleList } from '@/hooks/useVehicles'

// export default function Brands() {
//   const { brands } = useBrands()
//   const { vehicles } = useVehicleList()

//   return (
//     <div className="pt-28 pb-24">
//       <div className="mx-auto max-w-7xl px-6 lg:px-10">
//         <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Brands' }]} />
//         <h1 className="font-display text-4xl lg:text-5xl uppercase text-bone mt-4 mb-10">Our Brands</h1>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//           {brands.map((brand, i) => {
//             const count = vehicles.filter((v) => v.brand === brand.name).length
//             return (
//               <motion.div
//                 key={brand._id}
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ duration: 0.4, delay: i * 0.04 }}
//               >
//                 <NavLink
//                   to={`/shop?brand=${encodeURIComponent(brand.name)}`}
//                   className="group border border-graphite-light p-8 flex-col justify-between h-40 hover:border-amber transition-colors block"
//                 >
//                   <span className="font-display text-xl uppercase text-bone">{brand.name}</span>
//                   <div className="flex items-center justify-between">
//                     <span className="spec-strip text-silver-dim text-sm">{count} listed</span>
//                     <FiArrowUpRight className="text-silver group-hover:text-amber transition-colors" size={18} />
//                   </div>
//                 </NavLink>
//               </motion.div>
//             )
//           })}
//         </div>
//       </div>
//     </div>
//   )
// }

import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowUpRight } from 'react-icons/fi'
import { Breadcrumbs } from '@/components/ui/States'
import { useBrands } from '@/hooks/useTaxonomy'
import { useVehicleList } from '@/hooks/useVehicles'

const brandImages = {
  BMW: 'https://images.unsplash.com/photo-1555215695-3004980ad54e',
  'Mercedes-Benz': 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8',
  Audi: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6',
  Toyota: 'https://images.unsplash.com/photo-1623869675781-80aa31012a5a',
  Honda: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6',
  Ford: 'https://images.unsplash.com/photo-1551830820-330a71b99659',
  Porsche: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70',
  Lexus: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d',
  Nissan: 'https://images.unsplash.com/photo-1514316454349-750a7db3fd21',
  'Land Rover': 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf',
  Hyundai: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6',
  Suzuki: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39',
}

export default function Brands() {
  const { brands } = useBrands()
  const { vehicles } = useVehicleList()

  return (
    <div className="pt-28 pb-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">

        <Breadcrumbs
          items={[
            { label: 'Home', to: '/' },
            { label: 'Brands' }
          ]}
        />

        <h1 className="font-display text-4xl lg:text-5xl uppercase text-bone mt-4 mb-10">
          Our Brands
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          {brands.map((brand, i) => {

            const count = vehicles.filter(
              (v) => v.brand === brand.name
            ).length

            const backgroundImage =
              brandImages[brand.name] ||
              'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7'

            return (
              <motion.div
                key={brand._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  delay: i * 0.04
                }}
              >

                <NavLink
                  to={`/shop?brand=${encodeURIComponent(brand.name)}`}
                  className="
                    group
                    relative
                    h-48
                    overflow-hidden
                    border
                    border-graphite-light
                    block
                    hover:border-amber
                    transition-colors
                  "
                >

                  {/* Background Image */}
                  <img
                    src={backgroundImage}
                    alt={brand.name}
                    className="
                      absolute
                      inset-0
                      w-full
                      h-full
                      object-cover
                      transition-transform
                      duration-700
                      group-hover:scale-110
                    "
                  />

                  {/* Dark Overlay */}
                  <div
                    className="
                      absolute
                      inset-0
                      bg-black/60
                      group-hover:bg-black/45
                      transition-colors
                      duration-300
                    "
                  />

                  {/* Red/Amber Hover Overlay */}
                  <div
                    className="
                      absolute
                      inset-0
                      bg-racing-red/0
                      group-hover:bg-racing-red/10
                      transition-colors
                    "
                  />

                  {/* Content */}
                  <div className="relative z-10 h-full p-8 flex flex-col justify-between">

                    <span className="spec-strip text-white/70 text-xs">
                      {String(i + 1).padStart(2, '0')}
                    </span>

                    <div className="flex items-end justify-between">

                      <div>
                        <span className="
                          font-display
                          text-xl
                          uppercase
                          text-bone
                          group-hover:text-amber
                          transition-colors
                        ">
                          {brand.name}
                        </span>

                        <span className="
                          block
                          spec-strip
                          text-white/70
                          text-sm
                          mt-2
                        ">
                          {count} listed
                        </span>
                      </div>

                      <FiArrowUpRight
                        className="
                          text-white
                          group-hover:text-amber
                          transition-colors
                        "
                        size={22}
                      />

                    </div>

                  </div>

                </NavLink>

              </motion.div>
            )
          })}

        </div>
      </div>
    </div>
  )
}