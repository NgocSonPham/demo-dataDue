import React from 'react'

type Props = React.SVGProps<SVGSVGElement> & {
  selected?: boolean
}

const RadioSelected = (props: Props) => {
  const { selected = false, ...rest } = props
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" {...rest}>
      <rect x="0.5" y="0.5" width="19" height="19" rx="9.5" fill="#EEF2FF" />
      <rect x="0.5" y="0.5" width="19" height="19" rx="9.5" stroke="#A1A1AA" />
      {selected && <circle cx="10" cy="10" r="5" fill="#4F4F4F" />}
    </svg>
  )
}

export default RadioSelected