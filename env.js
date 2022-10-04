process.env.NODE_ENV = process.env.NODE_ENV || 'stag';
process.env.HOST = process.env.HOST || 'localhost';
process.env.PORT = 5000;

const oEnv = {};

oEnv.dev = {
    BASE_URL: 'http://localhost:5000/',
    BASE_API_PATH: 'http://localhost:5000/api/v1',
    DB_URL: 'mongodb+srv://shakil:shakil@cluster0.kvp24.mongodb.net/metatank',
    GAME_URL: 'http://localhost:3000/api/v1',
};

oEnv.stag = {
    BASE_URL: 'http://184.73.111.236:5000/',
    BASE_API_PATH: 'http://184.73.111.236:5000/api/v1',
    DB_URL: 'mongodb+srv://metatank:vFK6KAke05sqpLqe@metatank.c0idsfl.mongodb.net/metatank', // metatank:metatank123
    GAME_URL: 'http://localhost:3000/api/v1',
    REDIS_HOST: 'localhost',
    FRONTEND_URL: 'http://184.73.111.236:5001/a',
    SMTP_EMAIL: 'team@metatank.app',
    SMTP_PASS: 'MetaTank#123',
};

oEnv.prod = {
    BASE_URL: 'http://localhost:4000/',
    BASE_API_PATH: 'https://localhost:4000/api/v1',
    DB_URL: 'mongodb+srv://shakil:shakil@cluster0.kvp24.mongodb.net/metatank',
    REDIS_HOST: 'localhost',
    FRONTEND_URL: 'http://localhost/',
    GAME_URL: 'https://localhost:3000/api/v1',
};

process.env.SUPPORT_EMAIL = 'no-reply@metatank.com';
process.env.BASE_URL = oEnv[process.env.NODE_ENV].BASE_URL;
process.env.FRONTEND_URL = oEnv[process.env.NODE_ENV].FRONTEND_URL;
process.env.BASE_API_PATH = oEnv[process.env.NODE_ENV].BASE_API_PATH;
process.env.SMTP_EMAIL = oEnv[process.env.NODE_ENV].SMTP_EMAIL;
process.env.SMTP_PASS = oEnv[process.env.NODE_ENV].SMTP_PASS;
process.env.GAME_URL = oEnv[process.env.NODE_ENV].GAME_URL;
process.env.JWT_SECRET = 'jwt-secret';
process.env.DB_URL = oEnv[process.env.NODE_ENV].DB_URL;
process.env.OTP_VALIDITY = 60 * 1000;
process.env.REDIS_HOST = oEnv[process.env.NODE_ENV].REDIS_HOST;
process.env.REDIS_PORT = '6379';

console.log(process.env.NODE_ENV, process.env.HOST, 'configured');
