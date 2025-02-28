# NC News Seeding

# Environment Variables Setup

This project requires environment variables to configure the database connections. You need to create the following .env files:

1. .env.development

This file is used for the development database. Create it in the root directory and add:

        PGDATABASE=nc_news

2. .env.test

This file is used for the test database. Create it in the root directory and add:

        PGDATABASE=nc_news_test

# Database Setup

Create both the development and test databases:

npm run setup-dbs

Seed the database (for development only):

npm run seed

Running the Application

# Start the development server:

npm start

Run the tests:

npm run test-seed
npm run seed-dev
