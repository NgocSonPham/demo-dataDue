import { mode } from '@chakra-ui/theme-tools';

export const buttonStyles = {
	components: {
		Button: {
			baseStyle: {
				borderRadius: '16px',
				boxShadow: '45px 76px 113px 7px rgba(112, 144, 176, 0.08)',
				transition: '.25s all ease',
				boxSizing: 'border-box',
				_focus: {
					boxShadow: 'none'
				},
				_active: {
					boxShadow: 'none'
				}
			},
			variants: {
				outline: () => ({
					borderRadius: '16px'
				}),
				brand: (_props: any) => ({
					bg: "#6F59C5",
					color: 'white',
					_focus: {
						bg: "#6F59C5"
					},
					_active: {
						bg: "#6F59C5"
					},
					_hover: {
						bg: "#6F59C5"
					}
				}),
				action: (props: any) => ({
					fontWeight: '500',
					borderRadius: '50px',
					bg: mode('secondaryGray.300', 'brand.400')(props),
					color: mode('brand.500', 'white')(props),
					_focus: {
						bg: mode('secondaryGray.300', 'brand.400')(props)
					},
					_active: { bg: mode('secondaryGray.300', 'brand.400')(props) },
					_hover: {
						bg: mode('secondaryGray.200', 'brand.400')(props)
					}
				}),
				setup: (props: any) => ({
					fontWeight: '500',
					borderRadius: '50px',
					bg: mode('transparent', 'brand.400')(props),
					border: mode('1px solid', '0px solid')(props),
					borderColor: mode('secondaryGray.400', 'transparent')(props),
					color: mode('secondaryGray.900', 'white')(props),
					_focus: {
						bg: mode('transparent', 'brand.400')(props)
					},
					_active: { bg: mode('transparent', 'brand.400')(props) },
					_hover: {
						bg: mode('secondaryGray.100', 'brand.400')(props)
					}
				})
			}
		}
	}
};
