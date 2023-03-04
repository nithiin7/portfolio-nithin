module.exports = function (plop) {
	// controller generator
	plop.setGenerator('component', {
		description: 'For creating a new component',
		prompts: [
			{
				type: 'input',
				name: 'name',
				message: 'Enter the name of component :',
			},
			{
				type: 'list',
				name: 'dir',
				message: 'Enter the type of component :',
				choices: ['utilities', 'pages', 'layouts'],
			},
		],
		actions: [
			{
				type: 'add',
				path: 'src/components/{{dir}}/{{pascalCase name}}/{{name}}.jsx',
				templateFile: 'templates/Components/Component.jsx.hbs',
			},
			{
				type: 'add',
				path: 'src/components/{{dir}}/{{pascalCase name}}/index.js',
				templateFile: 'templates/Components/index.js.hbs',
			},
			{
				type: 'add',
				path: 'src/components/{{dir}}/{{pascalCase name}}/{{name}}.module.scss',
				templateFile: 'templates/Components/Component.module.scss.hbs',
			},
		],
	});
};
