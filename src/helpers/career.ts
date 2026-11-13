import { toCompany } from 'helpers/company';
import type { EmploymentType, Experience } from 'types/career';
import type { RawCompany } from 'types/contentful';

export interface RawCareerRole {
	sys: { id: string };
	title: string;
	/** Deprecated text name, read only when the role has no employer. */
	companyName?: string | null;
	employer?: RawCompany | null;
	location?: string | null;
	type?: string | null;
	startDate: string;
	endDate?: string | null;
	description?: string | null;
	techStack?: string[] | null;
}

const EMPLOYMENT_TYPES: readonly EmploymentType[] = [
	'full-time',
	'contract',
	'freelance',
	'internship',
];

const MONTH = new Intl.DateTimeFormat('en-GB', {
	month: 'short',
	year: 'numeric',
	timeZone: 'UTC',
});

/** "2026-08-01" → "Aug 2026". Contentful Date fields are UTC. */
export const formatMonthYear = (iso: string): string =>
	MONTH.format(new Date(iso));

/** Contentful career role → the row shape the career list and resume render. */
export const toExperience = (role: RawCareerRole): Experience => ({
	id: role.sys.id,
	year: role.startDate.slice(0, 4),
	company: role.employer?.name ?? role.companyName ?? '',
	employer: role.employer ? toCompany(role.employer) : undefined,
	position: role.title,
	description: role.description ?? '',
	technologies: role.techStack ?? [],
	duration: `${formatMonthYear(role.startDate)} – ${
		role.endDate ? formatMonthYear(role.endDate) : 'Present'
	}`,
	startDate: role.startDate,
	endDate: role.endDate ?? undefined,
	location: role.location ?? undefined,
	type: EMPLOYMENT_TYPES.find((type) => type === role.type) ?? 'full-time',
});

/** Newest role first. */
export const sortByStart = (experiences: Experience[]): Experience[] =>
	[...experiences].sort((a, b) => b.startDate.localeCompare(a.startDate));

/** Whole years since the earliest start date, or null with no roles. */
export const yearsOfExperience = (
	startDates: readonly string[],
	now: Date = new Date()
): number | null => {
	if (startDates.length === 0) return null;
	const earliest = [...startDates].sort()[0];
	if (earliest === undefined) return null;
	const first = new Date(earliest);
	const months =
		(now.getUTCFullYear() - first.getUTCFullYear()) * 12 +
		(now.getUTCMonth() - first.getUTCMonth());
	return Math.floor(months / 12);
};

export interface CareerPeriod {
	start: string;
	end: string | null;
	current: boolean;
}

/** Start/end years for a role, e.g. 2025 → 2026, or 2026 → current. */
export const careerPeriod = (
	experience: Pick<Experience, 'startDate' | 'endDate'>
): CareerPeriod => {
	const start = experience.startDate.slice(0, 4);
	const end = experience.endDate?.slice(0, 4) ?? null;
	return {
		start,
		end: end === start ? null : end,
		current: !experience.endDate,
	};
};
