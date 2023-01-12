# Peach-blog

<==========================================>
## Getting Started
git clone https://github.com/Oluwayemissy/Peach-blog.git

cd Peach-blog

- run: npm install to install dependencies, 

- npm run create:migration <migration-table-name>

- npm run create:migration <migration-table-name> --sql-file to add the sql files

- npm run migrate_up runs migration

- npm run migrate_down drops all migrations

- npm run migrate:fresh drops and runs the migration

- Download .env file and put it in the root folder.

- npm run start starts the dev server


<==========================================>

| Name | Description |
| ------------------------ | --------------------------------------------------------------------------------------------- |
| **migrations**           | Contains the migration files  |
| **node_modules**         | Contains all  npm dependencies                                                            |
| **src**                  | Contains all source code                          |
| **src/api**              | Contains queries, middlewares, controllers and routes for all endpoints |
| **src/config**           | Contains application configurations including environment-specific configurations 
| **src/lib**              | Contains common helpers functions and libraries to be used across the app |  
| **src/services**         | Contains send email functions |
| **src**/app.js           | Entry point to express app                                                               |
| database.json            | Contains databases url                                                              |
| package.json 