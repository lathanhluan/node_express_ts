import http from 'http';
import express, {Express, Request, response, Response} from 'express';
import cors from 'cors';
import {ParamsDictionary} from 'express-serve-static-core';
import dotenv from 'dotenv';
import s3FetchFile from './S3Service/S3FetchFile';
const fetch = require('node-fetch');


dotenv.config();


const app: Express = express();
const port = process.env.PORT;


// app.use(cors());
app.use(express.json());
/** RULES OF OUR API */
app.use((req, res, next) => {
    // set the CORS policy
    res.header('Access-Control-Allow-Origin', '*');
    // set the CORS headers
    res.header('Access-Control-Allow-Headers', 'origin, X-Requested-With,Content-Type,Accept, Authorization');
    // set the CORS method headers
    res.header('Access-Control-Allow-Methods', 'GET, PATCH, DELETE, POST');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, PATCH, DELETE, POST');
        return res.status(200).json({});
    }
    next();
});

app.get('/hello', async (req: Request, res: Response) => {
    console.log('GOI API HOME PAGE S1:');

    const response = await fetch('http://169.254.169.254/latest/meta-data/public-ipv4');
    const data =  await response.text();
    res.send("The public IP server: "+ data);
    // try {
    //     s3FetchFile.getFileFromS3().then((response) => {
    //         console.log('Output:', response.Body);
    //         console.log('username:', response.Body.user_name);
    //         console.log('Pass:',response.Body.password);
    //         res.status(200).send(response.Body);
    //         res.send('Express + TypeScript Server AAA');
    //     }).catch((err) => {
    //         res.send(err.mesage);
    //     });
    // } catch (e: any) {
    //     res.send(e.message);
    // }

});

interface LoginRequest {
    user_name: string;
    password: string;
}
interface LoginResponse {
    success: boolean;
}
app.post('/login',(req: Request<ParamsDictionary,any,LoginRequest>, res: Response<LoginResponse>)=> {
    console.log("ABC");
    console.log(req.body);

    // let username: string = req.body.user_name;
    // let password: string = req.body.password;

    const { user_name:username, password} = req.body;


    s3FetchFile.getFileFromS3()
        .then((response) => {
            const {Body} = response;
            const {user_name: s3Username, password: s3Password} = Body;
            if(username === s3Username && password === s3Password){
                return res.status(200).json({
                    success: true,
                });
            }else{
                return res.status(401).json({
                    success: false,
                });
            }
        })
        .catch((err) => {
            res.send(err.mesage);
        });

    // if (username == s3_user && password == s3_pass) {
    //     return res.status(200).json({
    //         success: true,
    //     });
    // } else {
    //     return res.status(401).json({
    //         success: false,
    //     });
    // }

});



interface Login2Request {
    user_name: string;
    password: string;
}
interface Login2Response {
    success: boolean;
}
app.post('/login2',async (req: Request<ParamsDictionary,any,Login2Request>, res: Response<Login2Response>)=> {
    console.log("ABC");
    console.log(req.body);

    // let username: string = req.body.user_name;
    // let password: string = req.body.password;

    const { user_name:username, password} = req.body;


    const response = await s3FetchFile.getFileFromS3();
    console.log('====== login 2 response from s3', response)
    const {Body} = response
    const {user_name: s3Username, password: s3Password} = Body;
    if(username === s3Username && password === s3Password){
        return res.status(200).json({
            success: true,
        });
    }else{
        return res.status(401).json({
            success: false,
        });
    }
});

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});