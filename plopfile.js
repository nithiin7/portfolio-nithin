module.exports = (plop) => {
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
				path: 'src/components/{{moduleName}}/{{pascalCase name}}/{{pascalCase name}}.jsx',
				templateFile: 'templates/component/component.jsx.hbs',
			},
			{
				type: 'add',
				path: 'src/components/{{moduleName}}/{{pascalCase name}}/{{pascalCase name}}.module.scss',
				templateFile: 'templates/component/component.module.scss.hbs',
			},
			{
				type: 'add',
				path: 'src/components/{{moduleName}}/{{pascalCase name}}/index.js',
				templateFile: 'templates/component/page.js.hbs',
			},
			{
				type: 'add',
				path: 'src/components/{{moduleName}}/{{pascalCase name}}/{{pascalCase name}}.stories.js',
				templateFile: 'templates/component/component.stories.js.hbs',
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
				path: 'src/app/{{moduleName}}/{{dashCase name}}/{{pascalCase name}}.jsx',
				templateFile: 'templates/page/page.jsx.hbs',
			},
			{
				type: 'add',
				path: 'src/app/{{moduleName}}/{{dashCase name}}/{{pascalCase name}}.module.scss',
				templateFile: 'templates/page/page.module.scss.hbs',
			},
			{
				type: 'add',
				path: 'src/app/{{moduleName}}/{{dashCase name}}/page.js',
				templateFile: 'templates/page/page.js.hbs',
			},
		],
	});
};
