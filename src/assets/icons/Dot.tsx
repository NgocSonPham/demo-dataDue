import React, { HTMLAttributes } from 'react'

type Props = HTMLAttributes<HTMLDivElement>

const DotIcon = (props: Props) => {
  return (
    <div className='w-[6px] h-[6px] bg-[#CBD5E1] rounded-full' {...props}></div>
  )
}

export default DotIcon