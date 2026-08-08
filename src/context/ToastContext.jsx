import { createContext, useCallback, useContext, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiCheckCircle, FiXCircle, FiInfo } from 'react-icons/fi'

const ToastContext = createContext(null)

const ICONS = { success: FiCheckCircle, error: FiXCircle, info: FiInfo }
const COLORS = { success: 'border-amber text-amber', error: 'border-racing-red text-racing-red', info: 'border-silver text-silver' }

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = 'info') => {
    const id = Math.random().toString(36).slice(2)
    setToasts((t) => [...t, { id, message, type }])
    setTimeout(() => setToasts((t) => t.filter((toast) => toast.id !== id)), 3500)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {typeof document !== 'undefined' &&
        createPortal(
          <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 w-80">
            <AnimatePresence>
              {toasts.map((toast) => {
                const Icon = ICONS[toast.type]
                return (
                  <motion.div
                    key={toast.id}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 40 }}
                    className={`bg-graphite border-l-2 px-4 py-3 flex items-center gap-3 shadow-lg ${COLORS[toast.type]}`}
                  >
                    <Icon size={18} className="shrink-0" />
                    <p className="text-bone text-sm">{toast.message}</p>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}
