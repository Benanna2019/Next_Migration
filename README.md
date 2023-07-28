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

1. For our Database the project is using [Planetscale](https://planetscale.com). Setting up an account is really easy and creating your first database is free.

- When you create a new database remember the password that you set, you will need it for the connection string.
- If you forget your password and get to the step below and cannot find it, you can generate a new password.
- Once you've created your database click go to your dashboard, click on the new database you created and then on the right side you will see a button labeled `Get connnection strings`. Click that and then where it says `Connect With` there is a drop down, make sure you select the `Prisma` option

2. For our local development OAuth information, we are using Github OAuth. To set up OAuth:

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

3. For our NEXT_AUTH_URL and NEXT_AUTH_SECRET,

- The `NEXT_AUTH_URL` value is `http://localhost:3000`
- For our `NEXT_AUTH_SECRET` value, we need to run this command, `openssl rand -base64 32`, in the terminal which will generate a string that you can grab and put into the value

4. Lastly, we need to get our UPLOADTHING_SECRET

- If you do not already have an account, you can go to [uploadthing](https://uploadthing.com)
- Create an account if you do not have one then click Create a new app
- After project creation go to your project page and click on Api Keys in the side nav.
- You can grab your secret key there and paste it into your env file

5. Now we have all the environment variables we need to get started, we need to init prisma and push our schema to the database.

- First run `npx prisma init`
- Then run `npx prisma db push`. This will push our models to our planetscale db

Now that we have everything we need, you can run the development server:

```bash
npm run dev
```

Rather than seed the database we will walk through the project and add data through the forms and api endpoints we have set up.

There are forms at the `/sales/customers` route, `/sales/invoices` routes, and on a `/sales/invoices/[invoiceId]` page you can add deposits for an invoice.

There are a handful of routes that don't have anything on them so feel free to add whatever you would like on those pages

### Example additions to consider adding to pages directory

1.  On the dashboard page, you could take some existing queries we have set up and set up a dashboard based off of the data you add to the database.

2.  There are a few other routes that either break, 404 page, or have nothing on them. Get creative.

3.  This is already set up to update invoice amounts due, deposits made, etc, why not try to integrate stripe?

- For each invoice created, create a payment link, then create a webhook that when payment is submitted, updates the database

4. PDF's are notoriously difficult to setup and annoying

- Will you be the one to solve them?
- Your mission, should you choose to accept it, is to use JSpdf or React PDF in combination with Nextjs api routes to create invoice pdfs that format to a specific style
- It's not fun, that's why it is a mission.

5.  Most practically, the `/sales/deposits` route breaks if you click the link. However, if you are on an individual invoice page and a deposit has been made, if you click on the deposit you get take to that deposit id's page at `/sales/deposits/[depositId]`

- You could create a route for `/sales/deposits` that is the shell for the `/sales/deposits/[depositId]` route
- Look into how routing and layouts are done with customers and invoices pages to see how to utilize the `getLayout` function on pages

6. There are current a few error boundaries implemented just to show how to change them over when we migrate to the app directory.

- If you want to get more granualar with the errors, you can go through and add them on forms, layouts, and id pages
