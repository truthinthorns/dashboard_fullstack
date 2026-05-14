# Dashboard Fullstack Project

This new repo was created to encapsulate the whole project (frontend, backend, dockerization) instead of having the frontend and backend separate, with no direct way of building their corresponding containers/running both projects at once. Not to mention the absence of MongoDB.

The frontend still needs quite a bit of work.

## Running the projects

To run these projects, you can, of course, run them locally. But this method is slightly more complicated. It would involve looking at the backend README to see what Mongo container you need to install, or installing Mongo on your local computer. Then you'd have to run multiple commands to install packages from both frontend and backend, then two more commands to run both projects. If you want that method, the READMEs in the frontend and backend folders have instructions on how to do so. 

If you want the easier way, assuming you have Docker installed, you can just run `docker compose up -d`. This will bring up the following containers:
- MongoDB
- Mongo Express (port 8081, username/password defined in envs/mongo.env)
- Backend (port 5000)
- Frontend (port 8080)
