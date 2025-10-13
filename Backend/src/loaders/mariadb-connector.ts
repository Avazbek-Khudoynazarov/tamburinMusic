import mariadb from 'mariadb';
import config from '../config';
import Logger from './logger';

export class MariaDBConnector {
    private static instance: MariaDBConnector;
    private conn: any;

    constructor() {

    }

    public static getInstance(): MariaDBConnector {
        if (!MariaDBConnector.instance) {
            MariaDBConnector.instance = new MariaDBConnector();
        }
        return MariaDBConnector.instance;
    }
    
    public connect(): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            const pool = mariadb.createPool({
                host: config.databaseURL, 
                user: config.databaseUserName, 
                password: config.databasePassword, 
                port: parseInt(config.databasePort!),
                database: config.databaseName,
                connectionLimit: 10,
                rowsAsArray: false 
            });

            try{
                this.conn = await pool.getConnection();
                resolve(this.conn);
            }catch(err) {
                console.log(err);
                reject();
            }
        });
    }

    public disconnect(): Promise<any> {
        return this.conn.end();
    }

    public getConn() {
        return this.conn;
    }
}