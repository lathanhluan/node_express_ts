import {GetObjectOutput} from "aws-sdk/clients/s3";
import {AWSError} from "aws-sdk";

const AWS = require('aws-sdk');
AWS.config.update({
    // accessKeyId:'AKIASFGKZVOCZCR5556M',
    // secretAccessKey:'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',
    region: 'us-east-1'
});

const S3 = new  AWS.S3();

interface ReponseBody {
    user_name: string;
    password: string;
}
interface ResponseFromS3 extends Omit<GetObjectOutput,"Body"> {
    Body: ReponseBody
}
const S3FetchFile = {
    getFileFromS3: () => {
        return new Promise<ResponseFromS3>((resolve, reject) => {
            try {
                 const bucketName = 's3storedfile';
                 const objectName = 'account.json';
                 S3.getObject({
                     Bucket: bucketName,
                     Key: objectName
                 }, (err: AWSError, data: GetObjectOutput) => {

                     console.log("type of data get from s3", typeof data);
                     if(err) {
                         reject(err);
                     } else {
                         console.log('Unparsed Fetched object data:', data);
                         const {Body} = data
                         const result = {...data, Body: JSON.parse(Body?.toString()||"")}
                         console.log('Pared Fetched object data:', result);
                         resolve(result);
                     }
                 });
            } catch (e) {
                reject(e);
            }
        });
    }
};

export default S3FetchFile;