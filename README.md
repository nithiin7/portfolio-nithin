# Portfolio Website using Next.js and Contentful

This is a simple portfolio website that showcases projects and skills, built using Next.js and Contentful.

## Technologies Used

**Next.js**: a React framework for building server-side rendered (SSR) web applications.
**Contentful**: a content management platform that allows to manage your website's content in a flexible and scalable way.
**React**: a JavaScript library for building user interfaces.
**BitBucket**: a free static site hosting service that allows you to host your website on BitBucket.

# Getting Started

To get started, you'll need to have Node.js (v20) and npm installed on your computer. You'll also need to create a Contentful account and set up your content model with the necessary fields for the portfolio items.

Clone this repository to your local machine using git clone.

```
git clone git@bitbucket.org:nithin-private/portfolio-nithin.git
```

Install the project dependencies by running npm install.
Create a .env file at the root of the project and add your API keys:

```
NEXT_PUBLIC_SPACE_ID=<your_space_id>
NEXT_PUBLIC_AUTHORIZATION_TOKEN=<your_access_token>

# Supabase (for comments)
NEXT_PUBLIC_SUPABASE_URL=<your_supabase_url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_supabase_anon_key>
```

Run the development server using npm run dev.
Visit http://localhost:3000 to view the website in your browser.

You can customize the website by modifying the components and styles in the src directory. You can also customize the content model in Contentful to add or remove fields for your portfolio items.

# Resources

[Next.js Documentation](https://nextjs.org/docs)

[Contentful Documentation](https://www.contentful.com/developers/docs/)

[React Documentation](https://legacy.reactjs.org/docs/getting-started.html)
