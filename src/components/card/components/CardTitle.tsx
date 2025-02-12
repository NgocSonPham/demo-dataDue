import React, { HTMLAttributes } from 'react'
import styles from './styles.module.scss'
import clsx from 'clsx'


type Props = HTMLAttributes<HTMLDivElement> & {
  title: string
  size?: 'small' | 'medium' | 'large'
}

const CardTitle = (props: Props) => {
  const { className, title, size = 'medium', ...rest } = props

  const titleClass = clsx(styles.title, className, {
    [styles.small]: size === 'small',
    [styles.medium]: size === 'medium',
    [styles.large]: size === 'large',
  })

  return (
    <h2 className={titleClass} {...rest}>
      {title}
    </h2>
  )
}

export default CardTitle