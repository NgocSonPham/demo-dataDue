import React, { ButtonHTMLAttributes } from 'react'
import styles from './buttonStyles.module.scss'
import clsx from 'clsx'
import { Button as ButtonUI } from '@/components/ui/button';

type Props = {
  variant: ButtonVariants.DANGER | ButtonVariants.PRIMARY | ButtonVariants.SECONDARY | ButtonVariants.SUCCESS | ButtonVariants.WARNING | ButtonVariants.INFO | ButtonVariants.LIGHT | ButtonVariants.DARK | ButtonVariants.LINK
  icon?: React.ReactNode
  label?: string
} & ButtonHTMLAttributes<HTMLButtonElement>

export enum ButtonVariants {
  DANGER = 'danger',
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  SUCCESS = 'success',
  WARNING = 'warning',
  INFO = 'info',
  LIGHT = 'light',
  DARK = 'dark',
  LINK = 'link',
}

const Button = (props: Props) => {
  const { variant, className, icon, label, ...rest } = props

  const buttonClassName = (variant: ButtonVariants) => {
    switch (variant) {
      case ButtonVariants.DANGER:
        return styles.danger
      case ButtonVariants.PRIMARY:
        return styles.primary
      case ButtonVariants.SECONDARY:
        return styles.secondary
      default:
        return ''
    }
  }




  return (
    <button className={clsx(styles.button, buttonClassName(variant), ' disabled:!cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none', className)} {...rest}>
      {icon}
      {label && <span>{label}</span>}
    </button>

  )
}

export default Button