import express from 'express';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { Container } from 'typedi';

import config from './config';
import Logger from './loaders/logger';
import { MariaDBConnector } from './loaders/mariadb-connector';
import expressLoader from './loaders/express';

import { Scheduler } from './scheduler';

export class MainServer {
	private app: any;
	
	constructor() {
		this.app = express();
	}

	async start(): Promise<void> {
		dayjs.extend(utc);
		dayjs.extend(timezone);
		dayjs.tz.setDefault('Asia/Seoul');

		const mariaDBConnector = MariaDBConnector.getInstance();
		await mariaDBConnector.connect();
		console.log("MariaDB connected...");

		const scheduler = new Scheduler();
		scheduler.start();
		console.log("Scheduler running...");

		//싱글톤처럼 쓰기 위해 logger 객체를 보관해놓는다.
		Container.set('logger', Logger);

		//express 기본 세팅.
		expressLoader({ app: this.app });

		const httpServer = this.app.listen(config.port, () => {
			Logger.info(`Server listening on port: ${config.port}`);
		}).on('error', (err : any) => {
			Logger.error(err);
			process.exit(1);
		});
	}
}