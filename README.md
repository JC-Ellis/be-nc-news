 # NC News API

## Live Demo
To see a demo of the project, visit:  
**[NC News API - Hosted Version](https://be-nc-news-btqn.onrender.com/api/)**

### 🔹 **Installation**
Follow these steps to set up the project locally:

#### **Clone this repository:**

git clone: https://github.com/JC-Ellis/be-nc-news.git

cd be-nc-news

#### Install Dependencies
1. In the terminal run: **npm install**

#### Create the .env files

2. Create a file in the root directory named **.env.development**

3. Inside this file type (or copy paste): **PGDATABASE = nc_news**

4. Create a file in the root directory named **.env.test**

5. Inside this file type (or copy paste): **PGDATABASE = nc_news_test**

#### To create the databases

6. In the terminal run: **npm run setup-dbs**

#### To seed databases

7. To seed the development database run **npm run seed-dev** in the terminal

8. The test database will seed automatically everytime you run **npm test**

### Running tests

Now, to check everything is working correctly run: **npm test**

To start the API locally, run: **npm start**
(The server will be running at :**http://localhost:9090**)

---

## Available Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| **GET** | `/api` | A root endpoint returning available endpoints and request/response examples |
| **GET** | `/api/topics` | Retrieve a list of topics |
| **GET** | `/api/articles` | Retrieve a list of all articles |
| **GET** | `/api/articles/:article_id` | Retrieve an article by its ID |
| **PATCH** | `/api/articles/:article_id` | Update an article by its ID |
| **GET** | `/api/articles/:article_id/comments` | Retrieve comments for a specific article |
| **POST** | `/api/articles/:article_id/comments` | Create a new comment on an article |
| **DELETE** | `/api/comments/:comment_id` | Delete a comment by its ID |
| **GET** | `/api/users/` | Retrieve a list of all users |
---