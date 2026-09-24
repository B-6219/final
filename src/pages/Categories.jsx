// import { NavLink } from 'react-router-dom'
// import { motion } from 'framer-motion'
// import { FiArrowUpRight } from 'react-icons/fi'
// import { Breadcrumbs } from '@/components/ui/States'
// import { useCategories } from '@/hooks/useTaxonomy'

// export default function Categories() {
//   const { categories } = useCategories()

//   return (
//     <div className="pt-28 pb-24">
//       <div className="mx-auto max-w-7xl px-6 lg:px-10">
//         <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Categories' }]} />
//         <h1 className="font-display text-4xl lg:text-5xl uppercase text-bone mt-4 mb-10">Vehicle Categories</h1>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {categories.map((cat, i) => (
//             <motion.div
//               key={cat._id}
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.4, delay: i * 0.05 }}
//             >
//               <NavLink
//                 to={`/shop?category=${encodeURIComponent(cat.name)}`}
//                 className="group relative border border-graphite-light p-10 flex-col justify-between h-56 hover:border-amber transition-colors overflow-hidden block"
//               >
//                 <div className="absolute inset-0 bg-racing-red/0 group-hover:bg-racing-red/5 transition-colors" />
//                 <span className="spec-strip text-silver-dim text-xs">{String(i + 1).padStart(2, '0')}</span>
//                 <div className="flex items-end justify-between">
//                   <span className="font-display text-3xl uppercase text-bone">{cat.name}</span>
//                   <FiArrowUpRight className="text-silver group-hover:text-amber transition-colors" size={22} />
//                 </div>
//                 {cat.count != null && <span className="spec-strip text-silver-dim text-sm">{cat.count} vehicles</span>}
//               </NavLink>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }

import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowUpRight } from 'react-icons/fi'
import { Breadcrumbs } from '@/components/ui/States'
import { useCategories } from '@/hooks/useTaxonomy'

const categoryImages = {
  sedan: 'https://images.unsplash.com/photo-1555215695-3004980ad54e',
  suv: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b',
  coupe: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d',
  truck: 'https://images.unsplash.com/photo-1551830820-330a71b99659',
  motorcycle: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39',
  van: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e',
}

export default function Categories() {
  const { categories } = useCategories()

  return (
    <div className="pt-28 pb-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Breadcrumbs
          items={[
            { label: 'Home', to: '/' },
            { label: 'Categories' }
          ]}
        />

        <h1 className="font-display text-4xl lg:text-5xl uppercase text-bone mt-4 mb-10">
          Vehicle Categories
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, i) => {
            const image =
              categoryImages[cat.name.toLowerCase()] ||
              'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7'

            return (
              <motion.div
                key={cat._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <NavLink
                  to={`/shop?category=${encodeURIComponent(cat.name)}`}
                  className="group relative h-56 overflow-hidden border border-graphite-light block hover:border-amber transition-colors"
                >
                  {/* Background image */}
                  <img
                    src={image}
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-black/60 group-hover:bg-black/45 transition-colors" />

                  {/* Red/amber hover effect */}
                  <div className="absolute inset-0 bg-racing-red/0 group-hover:bg-racing-red/10 transition-colors" />

                  {/* Content */}
                  <div className="relative z-10 h-full p-8 flex flex-col justify-between">
                    <span className="spec-strip text-white/70 text-xs">
                      {String(i + 1).padStart(2, '0')}
                    </span>

                    <div className="flex items-end justify-between">
                      <div>
                        <span className="font-display text-3xl uppercase text-bone">
                          {cat.name}
                        </span>

                        {cat.count != null && (
                          <span className="block spec-strip text-white/70 text-sm mt-2">
                            {cat.count} vehicles
                          </span>
                        )}
                      </div>

                      <FiArrowUpRight
                        className="text-white group-hover:text-amber transition-colors"
                        size={26}
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