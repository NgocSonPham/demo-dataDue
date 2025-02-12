import React, { HTMLProps } from 'react'

const LinkIcon = (props: HTMLProps<SVGSVGElement>) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none" {...props}>
      <path d="M11.8021 16.2232L11.2014 16.8239C9.21085 18.8144 5.9835 18.8144 3.99293 16.8239C2.00236 14.8333 2.00236 11.606 3.99293 9.61539L4.59363 9.01468" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
      <path d="M8.19775 12.6189L11.802 9.01465" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
      <path d="M8.19775 5.41044L8.79846 4.80973C10.789 2.81916 14.0164 2.81916 16.0069 4.80973C17.9975 6.8003 17.9975 10.0276 16.0069 12.0182L15.4062 12.6189" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export default LinkIcon