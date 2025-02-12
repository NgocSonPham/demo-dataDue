import { Textarea, TextareaProps } from '@chakra-ui/react'
import React from 'react'
import styles from './styles.module.scss'
import clsx from 'clsx'
type Props = {
  placeholder?: string;
  value?: string;
  limit?: number;
  wordCount?: boolean;
  error?: any;
  onChange?: (value: string) => void;
} & TextareaProps


const TextArea = (props: Props) => {
  const { placeholder = '', value = '', error, limit, wordCount, className, onChange = () => { }, ...rest } = props;
  console.log('TextArea>>', error);
  return (
    <div className={clsx(styles.textAreaWrapper, className)}>
      <Textarea
        bg="backgroundTextfield"
        w="full"
        fontSize="sm"
        fontWeight="400"
        letterSpacing={"-0.2px"}
        lineHeight="24px"
        rounded={"0px"}
        rows={5}
        variant={"unstyled"}
        p={0}
        className={styles.textarea}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        {...rest}
      />
      {wordCount && <div className={styles.footer}>{value?.length} {limit && ` / ${limit}`}</div>}
    </div>
  )
}

export default TextArea