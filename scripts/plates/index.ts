// `pnpm plates [slug…] [--force]`: capture (or import) screens, then compose plates.
import { capture } from './capture.ts';
import { compose } from './compose.ts';
import projects from './projects.config.ts';
import { selectProjects } from './shared.ts';

const selected = selectProjects(projects);
console.log('capture');
await capture(selected, { force: process.argv.includes('--force') });
console.log('compose');
await compose(selected);
