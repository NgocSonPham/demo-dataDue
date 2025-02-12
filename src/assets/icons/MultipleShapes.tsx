import React, { HTMLAttributes } from 'react'

type Props = HTMLAttributes<HTMLOrSVGElement>

const MultipleShapes = (props: Props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="18" viewBox="0 0 17 18" fill="none" {...props}>
      <path d="M4.85932 4.82478C4.81147 4.66428 4.7131 4.52351 4.57881 4.42342C4.44453 4.32332 4.28153 4.26926 4.11405 4.26926C3.94657 4.26926 3.78356 4.32332 3.64928 4.42342C3.515 4.52351 3.41662 4.66428 3.36878 4.82478L1.03576 12.6015C1.00088 12.7177 0.993672 12.8405 1.01472 12.96C1.03576 13.0795 1.08448 13.1924 1.15697 13.2897C1.22945 13.387 1.3237 13.466 1.43218 13.5203C1.54065 13.5747 1.66035 13.6029 1.78168 13.6028H6.44771C6.56894 13.6027 6.68847 13.5743 6.79678 13.5199C6.90509 13.4655 6.99917 13.3864 7.07152 13.2892C7.14386 13.1919 7.19246 13.079 7.21343 12.9597C7.23441 12.8403 7.22718 12.7176 7.19233 12.6015L4.85932 4.82478ZM2.827 12.0474L4.1147 7.75466L5.40239 12.0474H2.827ZM13.9652 5.69642C13.9652 5.00428 13.76 4.32769 13.3754 3.75219C12.9909 3.1767 12.4443 2.72816 11.8049 2.46329C11.1654 2.19842 10.4618 2.12911 9.78296 2.26414C9.10412 2.39917 8.48056 2.73247 7.99115 3.22189C7.50173 3.7113 7.16843 4.33486 7.0334 5.0137C6.89837 5.69254 6.96767 6.39618 7.23254 7.03563C7.49741 7.67509 7.94596 8.22164 8.52145 8.60617C9.09694 8.9907 9.77354 9.19595 10.4657 9.19595C11.3935 9.19492 12.283 8.82589 12.9391 8.16982C13.5951 7.51376 13.9642 6.62424 13.9652 5.69642ZM8.5215 5.69642C8.5215 5.3119 8.63553 4.93601 8.84916 4.6163C9.06278 4.29658 9.36642 4.04739 9.72168 3.90024C10.0769 3.75309 10.4678 3.71458 10.845 3.7896C11.2221 3.86462 11.5685 4.04978 11.8404 4.32168C12.1123 4.59358 12.2975 4.94 12.3725 5.31713C12.4475 5.69427 12.409 6.08518 12.2619 6.44043C12.1147 6.79568 11.8655 7.09932 11.5458 7.31295C11.2261 7.52658 10.8502 7.6406 10.4657 7.6406C9.95005 7.6406 9.45554 7.43577 9.09094 7.07117C8.72633 6.70656 8.5215 6.21205 8.5215 5.69642ZM14.7429 10.2328H9.03995C8.8337 10.2328 8.63589 10.3148 8.49005 10.4606C8.34421 10.6065 8.26228 10.8043 8.26228 11.0105V14.3804C8.26228 14.5867 8.34421 14.7845 8.49005 14.9303C8.63589 15.0762 8.8337 15.1581 9.03995 15.1581H14.7429C14.9491 15.1581 15.1469 15.0762 15.2928 14.9303C15.4386 14.7845 15.5205 14.5867 15.5205 14.3804V11.0105C15.5205 10.8043 15.4386 10.6065 15.2928 10.4606C15.1469 10.3148 14.9491 10.2328 14.7429 10.2328ZM13.9652 13.6028H9.81762V11.7882H13.9652V13.6028Z" fill="#475569" />
    </svg>
  )
}

export default MultipleShapes