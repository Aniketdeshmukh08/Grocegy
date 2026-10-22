1. Go to master branch
2. Take latest pull of master, npm install Health Check on Local
3. PROD ONLY - update db to prod
4. deploy on server (delete old files, upload) - node modules and all updated files
--run npm install if node modules foldewr not replaced
PROD - api.grocji.com
DEV - devgrocjiapi.skilletix.com
5. PROD ONLY - revert local changes of db.js
6. PROD ONLY - update changelog and commit to master
7. test on live
8. Also, check deployment of DB and Front End
9. Raise PR from master to release

master branch - DEV Server
release branch - PROD Server