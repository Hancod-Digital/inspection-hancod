'use client'
import * as React from "react"
import * as Ariakit from "@ariakit/react"
import { AnimatePresence, MotionConfig, motion, Variants } from "framer-motion"
import { ChevronDown } from "lucide-react"

const menuVariants: Variants = {
  closed: {
    scale: 0,
    transition: {
      delay: 0.15,
    },
  },
  open: {
    scale: 1,
    transition: {
      type: "spring",
      duration: 0.4,
      delayChildren: 0.2,
      staggerChildren: 0.05,
    },
  },
}

const itemVariants: Variants = {
  closed: { x: -16, opacity: 0 },
  open: { x: 0, opacity: 1 },
}

interface MenuProps extends Ariakit.MenuButtonProps {
  open?: boolean;
  setOpen?: (open: boolean) => void;
  label?: React.ReactNode;
  children: React.ReactNode;
  component: any
}

export const Menu = React.forwardRef<HTMLDivElement, MenuProps>(function Menu(
  { open, setOpen, label, children,component, ...props },
  ref
) {
  const menu = Ariakit.useMenuStore({ open, setOpen })
  const currentPlacement = Ariakit.useStoreState(menu, "currentPlacement")
  const mounted = Ariakit.useStoreState(menu, "mounted")

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex items-center">
        
        <Ariakit.MenuButton
          store={menu}
          ref={ref}
          {...props}
          className="ml-1 p-1 hover:bg-gray-100 rounded-full"
        >
         {component}
        </Ariakit.MenuButton>
      </div>
      <AnimatePresence>
        {mounted && (
          <Ariakit.Menu
            store={menu}
            alwaysVisible
            className="z-50 min-w-[180px] rounded-md bg-white p-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            data-placement={currentPlacement}
            render={
              <motion.div
                initial="closed"
                exit="closed"
                animate={open ? "open" : "closed"}
                variants={menuVariants}
              />
            }
          >
            {children}
          </Ariakit.Menu>
        )}
      </AnimatePresence>
    </MotionConfig>
  )
})

interface MenuItemProps extends React.ComponentPropsWithoutRef<typeof MotionMenuItem> {}

const MotionMenuItem = motion(Ariakit.MenuItem)

export const MenuItem = React.forwardRef<HTMLDivElement, MenuItemProps>(function MenuItem(props, ref) {
  return (
    <MotionMenuItem
      ref={ref}
      {...props}
      variants={itemVariants}
      transition={{ opacity: { duration: 0.2 } }}
      className="flex w-full cursor-default items-center rounded-md px-2 py-2 text-sm text-gray-900 hover:bg-gray-100 focus:bg-blue-600 focus:text-white"
    />
  )
})


