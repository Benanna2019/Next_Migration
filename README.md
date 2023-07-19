# Next_Migration

This project is a Nextjs example of Kent C Dodd's Frontend Masters Advanced Remix Workshop project.

The aim of this project and course is to take a large project using the traditional Nextjs pages architecture and migrate the full project to use the new app directory architecture.

## Getting Started

First, fork this repo. Once that is complete clone it.

You will need a couple environment variables to be able to run this project effectively. You should have the following variables

- `DATABASE_URL`=
- `OAUTH_CLIENT_ID`=
- `OAUTH_CLIENT_SECRET`=
- `NEXTAUTH_URL`=
- `NEXTAUTH_SECRET`=
- `UPLOADTHING_SECRET`=

For our Database the project is using [Planetscale](https://planetscale.com). Setting up an account is really easy and creating your first database is free.

- When you create a new database remember the password that you set, you will need it for the connection string.
- If you forget your password and get to the step below and cannot find it, you can generate a new password.
- Once you've created your database click go to your dashboard, click on the new database you created and then on the right side you will see a button labeled `Get connnection strings`. Click that and then where it says `Connect With` there is a drop down, make sure you select the `Prisma` option

For our local development OAuth information, we are using Github OAuth. To set up OAuth:

- go to github
- select settings
- at the bottom of settings you will see `Developer Settings`. Select that
- then select `'OAuth Apps'`
- click the button that says `'New OAuth App'`
- You will be asked to provide `Application Name`, `Homepage URL`, and `Authorization callback URL`
  - For application name choose any that you would like.
  - For Homepage URL put `http://localhost:3000`
  - For the Authorization callback URL we can put `http://localhost:3000/api/auth/callback/github`
- Click `Register Application` and on the next screen you will see a `CLIENT_ID` and there will be no `CLIENT_SECRET` yet.
  - Grab the `CLIENT_ID` and add it to the `OAUTH_CLIENT_ID` environment variable
  - Next generate the `CLIENT_SECRET` and then grab that value and add it to the `OAUTH_CLIENT_SECRET` environment variable

For our NEXT_AUTH_URL and NEXT_AUTH_SECRET,

- The `NEXT_AUTH_URL` value is `http://localhost:3000`
- For our `NEXT_AUTH_SECRET` value, we need to run this command, `openssl rand -base64 32`, in the terminal which will generate a string that you can grab and put into the value

Now we have all the environment variables we need to get started, we need to init prisma and push our schema to the database.

- First run `npx prisma init`
- Then run `npx prisma db push`. This will push our models to our planetscale db

Now that we have everything we need, you can run the development server:

```bash
npm run dev
```

There are many routes that result in a 404 or just an empty page. Start by going clicking on `Sales` in the sidebar navigation.

You will be promted to login and this will utilize our Github OAuth app that we just setup. After you login and are redirected click `Sales`. Then click on `Customers`.

On this page you will be able to create a new customer and start creating entries in the database.

And so we begin....
