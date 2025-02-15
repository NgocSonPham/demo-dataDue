"use client"

import * as React from "react"
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import RadioSelected from "@/assets/icons/RadioIcon"

type Checked = DropdownMenuCheckboxItemProps["checked"]

interface DropdownMenuSelectAbleProps {
  options: any[]
  value: string
  optionTitle?: string
  onChange: (value: string) => void
  triggerComponent?: React.ReactElement<any, string | React.JSXElementConstructor<any>>
}

export function DropdownMenuSelectAble(props: DropdownMenuSelectAbleProps) {
  const { options, value, optionTitle, onChange, triggerComponent } = props
  const [open, setOpen] = React.useState(false)

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild className="border-none outline-none">
        {triggerComponent ? triggerComponent : <Button variant="outline">Open</Button>}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[220px] rounded-lg !border border-[#DFDFDF]" align="end">
        {
          optionTitle &&
          <div className={cn('w-[220px] h-10 rounded-t-lg justify-between py-4 px-4 pb-2')}>
            <span className="font-inter font-normal text-xs leading-4 tracking-[0%]">{optionTitle}</span>
          </div>
        }
        <div className="w-full h-fit max-h-[88px] py-2">
          <div className="w-full h-full flex flex-col">
            {
              options.map(op => {
                const isSelected = op.value === value
                return <div
                  key={op.value}
                  onClick={() => {
                    if (op.disabled) return
                    onChange(op.value)
                    setOpen(false)
                  }}
                  className={cn("w-full cursor-pointer h-[36px] pt-[8px] pr-[16px] pb-[8px] pl-[16px] gap-[12px] flex items-center",
                    op.disabled && "opacity-50 cursor-not-allowed")}
                >
                  <RadioSelected selected={isSelected} />
                  <span>{op.label}</span>
                </div>
              })
            }
          </div>
          <div>

          </div>
        </div>

      </DropdownMenuContent>
    </DropdownMenu>
  )
}
