import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { ChevronDown } from 'lucide-react'

interface AccordionItemProps {
  title: React.ReactNode
  children: React.ReactNode
  defaultOpen?: boolean
}

export function AccordionItem({ title, children, defaultOpen = false }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  // Update isOpen when defaultOpen changes (for auto-collapse)
  useEffect(() => {
    setIsOpen(defaultOpen)
  }, [defaultOpen])

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-background">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors text-left"
      >
        <div className="font-medium text-sm text-foreground">{title}</div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </motion.div>
      </button>
      <motion.div
        initial={false}
        animate={{
          height: isOpen ? 'auto' : 0,
          opacity: isOpen ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <div className="px-4 pb-4">
          {children}
        </div>
      </motion.div>
    </div>
  )
}
