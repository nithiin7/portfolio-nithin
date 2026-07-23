export interface WakaTimeLanguageStat {
	name: string;
	percent: number;
	text: string;
}

export interface WakaTimeDay {
	date: string;
	totalSeconds: number;
	text: string;
}

export interface WakaTimeStats {
	humanReadableTotal: string;
	humanReadableDailyAverage: string;
	totalSeconds: number;
	bestDay: { date: string; text: string } | null;
	languages: WakaTimeLanguageStat[];
	days: WakaTimeDay[];
}
