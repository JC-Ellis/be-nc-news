# NC News Seeding

### To run this project, you need to create two .env files in the root directory.

1. Create a file in the root directory named **.env.development**

2. Inside this file type (or copy paste): **PGDATABASE = nc_news**

3. Create a file in the root directory named **.env.test**

4. Inside this file type (or copy paste): **PGDATABASE = nc_news_test**

 You should now be able to run **npm run test-seed** and **npm run seed-dev** in the terminal.