const { version } = require('../package.json');
const dotAws = require('../aws.ignore.json');
const client = require('s3').createClient({
  s3Options: {
    accessKeyId: dotAws.accessKeyId,
    secretAccessKey: dotAws.secretAccessKey,
    region: dotAws.region
  }
});

const uploader = client.uploadDir({
  localDir: require('path').resolve(__dirname, '../_dist/release'),
  s3Params: {
    Bucket: dotAws.bucketName,
    Prefix: `${version}/`
  }
});

uploader.on('error', err => {
  console.error('Unable to sync: ', err.stack);
});
uploader.on('fileUploadEnd', (localFilePath, s3Key) => {
  console.log(`File uploaded (${localFilePath}) -> ${s3Key}`);
});
uploader.on('end', () => {
  console.log('-- Completed OK');
});