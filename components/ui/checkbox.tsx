"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(
        "peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={cn("flex items-center justify-center text-current")}
      >
        <CheckIcon className="h-4 w-4" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
})
Checkbox.displayName = CheckboxPrimitive.Root.displayName


const ControlledCheckbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & {
    value?: boolean
    onChange?: (value: boolean) => void
    id?: string
    label?: string
  }
>((props, ref) => {
  return <>
    <Checkbox ref={ref} {...props} checked={props.value} onCheckedChange={(checked: boolean) => {
      props.onChange?.(checked)
    }} />
    {props.label && <LabelPrimitive.Root className="text-sm leading-none cursor-pointer " htmlFor={props.id}>{props.label}</LabelPrimitive.Root>}
  </>
})

Checkbox.displayName ="Checkbox"
ControlledCheckbox.displayName ="ControlledCheckbox"
export { Checkbox, ControlledCheckbox }
