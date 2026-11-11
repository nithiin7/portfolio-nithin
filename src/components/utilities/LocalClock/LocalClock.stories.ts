import LocalClock from './LocalClock';

const meta = {
	title: 'Utilities/LocalClock',
	component: LocalClock,
};

export default meta;

export const Bangalore = {
	args: { timeZone: 'Asia/Kolkata', zoneLabel: 'IST' },
};

export const NoSeconds = {
	args: { timeZone: 'Asia/Kolkata', zoneLabel: 'IST', showSeconds: false },
};
