import { execFileSync } from 'node:child_process';

import type { NodePlopAPI } from 'plop';

const componentFiles = (dir: string, name: string) => [
	...files(dir, name),
	{ type: 'format', data: { dir: `${dir}/${name}` } },
];

const files = (dir: string, name: string) => [
	{
		type: 'add',
		path: `${dir}/${name}/${name}.tsx`,
		templateFile: 'templates/component/component.tsx.hbs',
	},
	{
		type: 'add',
		path: `${dir}/${name}/${name}.module.scss`,
		templateFile: 'templates/component/component.module.scss.hbs',
	},
	{
		type: 'add',
		path: `${dir}/${name}/${name}.test.tsx`,
		templateFile: 'templates/component/component.test.tsx.hbs',
	},
];

export default function (plop: NodePlopAPI): void {
	plop.setActionType('format', (answers, config, plopApi) => {
		const { dir } = config.data as { dir: string };
		const path = plopApi.renderString(dir, answers);
		execFileSync('pnpm', ['exec', 'prettier', '--write', path], {
			stdio: 'ignore',
		});
		return `formatted ${path}`;
	});

	plop.setGenerator('component', {
		description: 'Component + SCSS module + test',
		prompts: [
			{ type: 'input', name: 'name', message: 'Component name:' },
			{
				type: 'list',
				name: 'group',
				message: 'Where does it live?',
				choices: ['utilities', 'layouts', 'motion', 'pages'],
			},
			{
				type: 'input',
				name: 'route',
				message: 'Route folder under components/pages (e.g. blog):',
				when: (answers) => answers.group === 'pages',
			},
		],
		actions: (answers) => {
			const dir =
				answers?.group === 'pages'
					? 'src/components/pages/{{camelCase route}}'
					: 'src/components/{{group}}';
			return componentFiles(dir, '{{pascalCase name}}');
		},
	});

	plop.setGenerator('page', {
		description: 'App route + its page component under components/pages',
		prompts: [
			{ type: 'input', name: 'route', message: 'Route segment (e.g. now):' },
			{ type: 'input', name: 'name', message: 'Page component name:' },
		],
		actions: [
			{
				type: 'add',
				path: 'src/app/{{dashCase route}}/page.tsx',
				templateFile: 'templates/page/page.tsx.hbs',
			},
			...componentFiles(
				'src/components/pages/{{camelCase route}}',
				'{{pascalCase name}}'
			),
			{ type: 'format', data: { dir: 'src/app/{{dashCase route}}' } },
		],
	});
}
