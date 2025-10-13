import dotenv from 'dotenv';

const envFound = dotenv.config();
if (envFound.error) {
  throw new Error("Couldn't find .env file");
}

export default {
    name: process.env.NAME,

    //Server Port.
    port: process.env.PORT,

    //Maria DB.
    databaseURL: process.env.MARIADB_HOST,
    databaseUserName: process.env.MARIADB_USERNAME,
    databasePassword: process.env.MARIADB_PASSWORD,
    databasePort: process.env.MARIADB_PORT,
    databaseName: process.env.MARIADB_DATABASE,

    jwtSecretKey: process.env.JWT_SECRET_KEY,

    //for winston logger
    logs: {
      level: process.env.LOG_LEVEL,
    },

    serverNumber: process.env.SERVER_NUM,

    aligoUserId: process.env.ALIGO_USER_ID,
    aligoSender: process.env.ALIGO_SENDER,
    aligoApiKey: process.env.ALIGO_API_KEY,
    aligoSenderKey: process.env.ALIGO_SENDER_KEY,
    aligoTestMode: process.env.ALIGO_TEST_MODE,

    gmailId: process.env.GMAIL_ID,
    gmailPassword: process.env.GMAIL_PASSWORD,
    gmailSender: process.env.GMAIL_SENDER
};