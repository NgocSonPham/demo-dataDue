import React, { HTMLAttributes } from 'react'
import styles from './styles.module.scss'
import clsx from 'clsx'
import CardTitle from './components/CardTitle'
type Props = HTMLAttributes<HTMLDivElement> & {
  headerTitle?: string
  titleSize?: 'small' | 'medium' | 'large'
  footer?: React.ReactNode
}

const CardContent = (props: Props) => {
  const { className, headerTitle, children, footer, titleSize = 'medium', ...rest } = props
  return (
    <div className={clsx(styles.info, className)}>
      {
        headerTitle && <div className={styles.header}>
          <CardTitle title={headerTitle} size={titleSize} />
        </div>
      }
      <div className={styles.body}>
        {children}
      </div>
      {
        footer && <div className={styles.footer}>
          {footer}
        </div>
      }
    </div>
  )
}

export default CardContent