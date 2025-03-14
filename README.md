# **nc-news-be API**

This is a RESTful API built with Node.js and Express that serves data from a PostgreSQL database. The API allows users to retrieve, create, update, and delete articles, comments, topics, and users. It also includes sorting and filtering, and functionalities.

## 🚀 **Hosted Version**

The live version of the API is hosted here:  
[nc-news-be](https://nc-news-be-quja.onrender.com/api)

## 📝 **Summary**

nc-news-be is a backend project that serves as the foundation for a forum-style application (like reddit) . It allows users to:

- View articles and filter by topics.
- View and post comments.
- Update vote counts on articles.
- Delete comments.
- Retrieve user information.

This RESTful API includes error handling for invalid routes, queries, and request formats.

## 💾 **Setup Instructions**

### 1.🔗 **Clone the repository**

git clone https://github.com/younesabd100/nc-news-be.git

### 2.💡**Install dependencies**

- run npm install

  to install the needed package
  npm install

### 3.🔋 **Set up environement Variables**

- Create 2 ".env" file in the root directory

- .env test :

PGDATABASE=nc_news_test

- .env.developement :

PGDATABASE=nc_news

### 4.🌱**Seed the database**

- npm run setup-dbs
- npm run seed

### 5.🏃 **Run tests**

- npm test

## 🧑‍🏫 **Minium Requirement**

- Node.js: v18.0.0 or higher
- Postgres: v14.0.0 or higher
