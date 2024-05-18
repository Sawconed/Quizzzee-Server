## 1. To run project:

1. git clone the repo
2. Go to the folder and run **_npm i_**
3. Go to **.env.local** and fill out the infos inside
4. Run **_npm run dev_** to start developing
5. Run **_npm build_** and **_npm start_** for production (optional)

_Disclaimer_: _Try changing MONGO_URI to **127.0.0.1** instead of **localhost** if the connection return error_

## 2. Syntax convention (Follow please :'>>>)

Unless you are working inside **models** folder, please use **pascalNamingStyle** for other files

- The file name contains the name of a noun following by the capitalized and pluralized form of the folder name:

  - _Example:_ ./routes/userRoutes.ts

- Except for the **models** folder will be a singular noun:

  - _Example:_ ./models/User.ts

- If new folder is needed, name its name as the plural form of noun
  - _Example:_ ./types
