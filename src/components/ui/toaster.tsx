"use client"

// import {
//   Toast,
//   ToastClose,
//   ToastConfirm,
//   ToastDescription,
//   ToastProvider,
//   ToastTitle,
//   ToastViewport,
// } from "@/components/ui/use-toast"
import { useToast } from "@/components/ui/use-toast"
import { Toast, ToastClose, ToastConfirm, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "./toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
        {toasts.map(function ({ id, title, description, action,confirmationButton,onconfirm, ...props }) {
          return (
            <Toast key={id} {...props}>
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
                {confirmationButton && (
                <ToastConfirm onClick={onconfirm} altText="s" />
                )}
              </div>
              {action}
              <ToastClose />
            </Toast>
          )
        })}
      <ToastViewport />
    </ToastProvider>
  )
}
