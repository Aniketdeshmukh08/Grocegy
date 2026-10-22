1) Go to master branch | take latest pull of master, npm install and do health check
2) Update env to prod | comment continuous api call in app.js
3) Build - npm run build
4) zip contents of build folder
5) deploy on server | delete old files, upload and unzip
PROD - https://admin.grocji.com/
DEV - https://grocjiadmin.10hitlist.com
6) PROD ONLY - also cut and keep the zip folder in deployed on local repo
7) revert local changes of env and app.js
8) PROD ONLY - Update changelog and commit to master
9) Test on live
10) Also, check deployment of DB and Back End
11) Raise PR from master to release

master branch - DEV Server
release branch - PROD Server