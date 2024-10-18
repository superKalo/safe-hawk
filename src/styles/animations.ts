export const appearTopAnimation = {
	hidden: {
		opacity: 0,
		y: -50
	},
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.5,
			ease: 'easeInOut'
		}
	}
};
export const scaleImageAnimation = {
	halfHidden: {
		opacity: 0,
		scale: 0.5
	},
	hidden: {
		opacity: 0,
		scale: 0.9
	},
	visible: {
		opacity: 1,
		scale: 1,
		transition: {
			duration: 0.3,
			ease: 'easeInOut',
		}
	},
	visibleDelay: {
		opacity: 1,
		scale: 1,
		transition: {
			duration: 0.5,
			ease: 'easeInOut',
			delay: 0.4
		}
	}
};
export const appearBottomImageAnimation = {
	hidden: {
		opacity: 0,
		y: 50
	},
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.5,
			ease: 'easeInOut',
			delay: 0.6
		}
	}
};

export const hoverAnimation = {
	scale: 1.05,
	transition: {
		duration: 0.2,
		ease: [0.61, 1, 0.88, 1]
	}
};
export const hoverAnimationEasy = {
	scale: 1.01,
	transition: {
		duration: 0.2,
		ease: [0.61, 1, 0.88, 1]
	}
};

export const ResizableAnimation = {
	hidden: {
		opacity: 0,
		x: '150%',
	},
	visible: {
		opacity: 1,
		x: 0,
		transition: {
			duration: 0.3,
			ease: [0, 0.55, 0.45, 1]
		}
	}
};
