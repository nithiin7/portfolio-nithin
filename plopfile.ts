import type { NodePlopAPI } from 'plop';

module.exports = (plop: NodePlopAPI) => {
	plop.setGenerator('component', {
		description: 'Create a reusable component',
		prompts: [
			{
				type: 'input',
				name: 'name',
				message: 'What is your component name?',
			},
			{
				type: 'input',
				name: 'moduleName',
				message: 'Which module/subfolder does it belongs to?',
			},
		],
		actions: [
			{
				type: 'add',
				path: 'src/components/{{moduleName}}/{{pascalCase name}}/{{pascalCase name}}.tsx',
				templateFile: 'templates/component/component.tsx.hbs',
			},
			{
				type: 'add',
				path: 'src/components/{{moduleName}}/{{pascalCase name}}/{{pascalCase name}}.module.scss',
				templateFile: 'templates/component/component.module.scss.hbs',
			},
			{
				type: 'add',
				path: 'src/components/{{moduleName}}/{{pascalCase name}}/index.ts',
				templateFile: 'templates/component/page.ts.hbs',
			},
			{
				type: 'add',
				path: 'src/components/{{moduleName}}/{{pascalCase name}}/{{pascalCase name}}.stories.ts',
				templateFile: 'templates/component/component.stories.ts.hbs',
			},
		],
	});
	plop.setGenerator('page', {
		description: 'Create a page',
		prompts: [
			{
				type: 'input',
				name: 'name',
				message: 'What is your page name?',
			},
			{
				type: 'input',
				name: 'moduleName',
				message: 'Which module/subfolder does it belongs to?',
			},
		],
		actions: [
			{
				type: 'add',
				path: 'src/app/{{moduleName}}/{{dashCase name}}/{{pascalCase name}}.tsx',
				templateFile: 'templates/page/page.tsx.hbs',
			},
			{
				type: 'add',
				path: 'src/app/{{moduleName}}/{{dashCase name}}/{{pascalCase name}}.module.scss',
				templateFile: 'templates/page/page.module.scss.hbs',
			},
			{
				type: 'add',
				path: 'src/app/{{moduleName}}/{{dashCase name}}/page.ts',
				templateFile: 'templates/page/page.ts.hbs',
			},
		],
	});
};
