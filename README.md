# Lambda AWS Export mysql table into a file csv and put it in a bucket

#### First you need to download the dependency nodemailer

```
npm install
```
Then zip files and directory as below :
- index.js
- package.json
- node-modules

Upload it to AWS and give to your Lambda roles as below :
- Allow: s3:PutObject

Give to your lambda a Cloudwatch Trigger with Cron trigger
- Event type: ObjectCreatedByPut
