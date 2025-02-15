
import React, { useEffect } from 'react'
import styles from './styles.module.scss'
import clsx from 'clsx'
import { Textarea } from './ui/textarea';
import { cn } from '@/lib/utils';
type Props = {
  placeholder?: string;
  value?: string;
  limit?: number;
  wordCount?: boolean;
  error?: any;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  className?: string;
}


const TextArea = (props: Props) => {
  const { placeholder = '', value = '', error, limit, wordCount, className, onChange = () => { }, ...rest } = props;

  return (
    <div className={clsx(styles.textAreaWrapper, className, error && '!border-red-500')}>
      <Textarea
        maxLength={limit}
        value={value}
        onChange={onChange}
        className={cn('font-normal resize-none shadow-none text-[12px] leading-[14.52px] tracking-[0%] border-none outline-none', className)}
      />
      {wordCount && <div className={styles.footer}>{value?.length} {limit && ` / ${limit}`}</div>}
      {error && <div className='text-red-500 text-sm w-full text-left'>{error.message}</div>}
    </div>
  )
}

export default TextArea