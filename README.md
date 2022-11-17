# Graffiti

a web app to share, vote and discuss your artwork  
> ## [Nest.js](https://nestjs.com/) | [TypeScript](https://www.typescriptlang.org/) | [MongoDB](https://www.mongodb.com/) | [React.js](https://reactjs.org/) | [MaterialUI](https://mui.com/) | [Vite](https://vitejs.dev/)

## Contents:
1. backend (nestjs, mongoose, typescript) **[Rest API with protected routes]**
2. frontend (reactjs, mui, vite) **[currently in progress]**

---  
## Install 

> ### Running the Backend API

1. Clone the repo  

    ```bash
    git clone https://github.com/ayushbasak/graffiti.git
    ```
2. change directory to backend  

    ```bash
    cd backend
    ```
3. install the node packages
    ```bash
    npm install
    ```
    or
    ```bash
    yarn
    ```

4. create an new `.env` file.  
    Add the following lines
    ```toml
    DB_URI=<YOUR_MONGODB_URI>
    JWT_SECRET=<A_RANDOM_STRING>
    REFRESH_SECRET=<A_RANDOM_STRING>
    ```

5. Start the server
    **Development Mode**
    ```bash
    yarn start:dev
    ```

    **Production Mode**
    ```bash
    yarn start:prod
    ```
---
## Usage  

> ### Backend API

**ImageQueue**  
- `POST /iq` **[Protected]**
    ```json
    {
        "url" : "", [url, must be img format of [png, webp, jpg, jpeg, gif]]
        "content" : "", [max length 200]
        "duration" : "" [number 1 - 1440]
    }
    ```

**Display**
- `GET /display`
- `POST /display/bump` **[Protected]**

**Auth**
- `POST /auth/signup`
    ```json
    {
        "username" : "", [non empty, lowercase, length 8 - 15 characters]
        "password" : "",  [non empty, length 8 - 15 characters]
        "invite" : "" [non empty]
    }
    ```
- `POST /auth/login`
    ```json
    {
        "username" : "", [non empty, lowercase, length 8 - 15 characters]
        "password" : ""  [non empty, length 8 - 15 characters]
    }
    ```
- `GET /auth/logout` **[Protected]**
- `GET /auth/refresh`  **[Protected]**


> ## Frontent
- under development
---
[License](LICENSE.md) | [mail](mailto:ayushbasak0210@gmail.com)
| [basak.app](https://www.basak.app)