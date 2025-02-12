import React, { HTMLAttributes } from 'react'

type Props = HTMLAttributes<SVGElement>

const XIcon = (props: Props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none" {...props}>
      <path d="M3.5957 4.07507L9.40232 9.88169M3.5957 9.88169L9.40232 4.07507" stroke="#4F46E5" strokeWidth="1.08874" />
    </svg>
  )
}

export default XIcon