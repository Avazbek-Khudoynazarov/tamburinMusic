import dayjs from 'dayjs';
import { MariaDBConnector } from '../loaders/mariadb-connector';
import { Global } from '../global';

export class DatabaseService {
	private db: MariaDBConnector;

	constructor() {
		this.db = MariaDBConnector.getInstance();
	}

	public async rawQueryWithParams(query: string, params: any[]): Promise<any> {
		const conn = await this.db.getConn();

		try {
			const result = await conn.query(query, params);
			return result;
		} catch (error) {
			console.error('rawQueryWithParams error:', error);
			throw error;
		}
	}



	public async select(tableName: string, conditions: string): Promise<any[]> {
		const conn = await this.db.getConn();
		const query = `SELECT * FROM ${tableName} WHERE ${conditions}`;

		try {
			const result = await conn.query(query);
			return result;
		} catch (error) {
			console.log(error);
			throw error;
		}
	}

	// public async insert(tableName: string, data: Record<string, any>): Promise<any> {
	// 	const conn = await this.db.getConn();
	// 	const keys = Object.keys(data);
	// 	const placeholders = keys.map(() => '?').join(', ');
	// 	const values = keys.map((key) => {
	// 		const value = data[key];
	// 		if (value instanceof Date) {
	// 			return Global.getInstance().getDateTime(value);
	// 		}
	// 		return value;
	// 	});

	// 	const query = `INSERT INTO ${tableName} (${keys.join(', ')}) VALUES (${placeholders})`;

	// 	try {
	// 		const result = await conn.query(query, values);
	// 		if (typeof result.insertId === 'bigint') {
	// 			result.insertId = result.insertId.toString();
	// 		}
	// 		return result;
	// 	} catch (error) {
	// 		console.log(error);
	// 		throw error;
	// 	}
	// }

	public async insert(tableName: string, data: Record<string, any>): Promise<any> {
		const conn = await this.db.getConn();
		const keys = Object.keys(data);
		const placeholders = keys.map(() => '?').join(', ');

		const values = keys.map((key) => {
			const value = data[key];
			// ✅ 날짜 타입이거나 ISO 문자열일 경우 MariaDB에 맞게 변환
			if (
				value instanceof Date ||
				(typeof value === 'string' &&
					/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z?$/.test(value))
			) {
				return dayjs(value).format('YYYY-MM-DD HH:mm:ss');
			}
			return value;
		});

		const query = `INSERT INTO ${tableName} (${keys.join(', ')}) VALUES (${placeholders})`;

		try {
			const result = await conn.query(query, values);
			if (typeof result.insertId === 'bigint') {
				result.insertId = result.insertId.toString();
			}
			return result;
		} catch (error) {
			console.log(error);
			throw error;
		}
	}


	public async update(tableName: string, data: Record<string, any>, conditions: string): Promise<any> {
		const conn = await this.db.getConn();
		const keys = Object.keys(data);
		const updates = keys.map((key) => `${key} = ?`).join(', ');

		const values = keys.map((key) => {
			const value = data[key];
			// ✅ 날짜 타입이거나 ISO 문자열일 경우 MariaDB에 맞게 변환
			if (
				value instanceof Date ||
				(typeof value === 'string' &&
					/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z?$/.test(value))
			) {
				return dayjs(value).format('YYYY-MM-DD HH:mm:ss');
			}
			return value;
		});

		const query = `UPDATE ${tableName} SET ${updates} WHERE ${conditions}`;

		try {
			const result = await conn.query(query, values);
			return result;
		} catch (error) {
			console.log(error);
			throw error;
		}
	}

	// public async update(tableName: string, data: Record<string, any>, conditions: string): Promise<any> {
	// 	const conn = await this.db.getConn();
	// 	const keys = Object.keys(data);
	// 	const updates = keys.map((key) => `${key} = ?`).join(', ');
	// 	const values = keys.map((key) => {
	// 		const value = data[key];
	// 		if (value instanceof Date) {
	// 			return Global.getInstance().getDateTime(value);
	// 		}
	// 		return value;
	// 	});

	// 	const query = `UPDATE ${tableName} SET ${updates} WHERE ${conditions}`;

	// 	try {
	// 		const result = await conn.query(query, values);
	// 		return result;
	// 	} catch (error) {
	// 		console.log(error);
	// 		throw error;
	// 	}
	// }


	// public async insert(tableName: string, data: object): Promise<any> {
	// 	const conn = await this.db.getConn();
	// 	const keys = Object.keys(data).join(', ');
	// 	const values = Object.values(data).map(value => {
	// 		if (value instanceof Date) {
	// 			return `'${Global.getInstance().getDateTime(value)}'`;
	// 		}
	// 		return `'${value}'`;
	// 	}).join(', ');
	// 	const query = `INSERT INTO ${tableName} (${keys}) VALUES (${values})`;

	// 	try {
	// 		const result = await conn.query(query);
	// 		if (typeof result.insertId === 'bigint') {
	// 			result.insertId = result.insertId.toString();
	// 		}
	// 		return result;
	// 	} catch (error) {
	// 		console.log(error);
	// 		throw error;
	// 	}
	// }


	// public async update(tableName: string, data: object, conditions: string): Promise<any> {
	// 	const conn = await this.db.getConn();
	// 	//const updates = Object.entries(data).map(([key, value]) => `${key}='${value}'`).join(', ');
	// 	// const updates = Object.entries(data).map(([key, value]) => {
	// 	//     if(value.toString().includes('-') && value.toString().includes(':') && !isNaN(Date.parse(value))) {
	// 	//         return `${key}='${Global.getInstance().getDateTime(value)}'`;
	// 	//     }else if(value instanceof Array && value.length <= 0) {
	// 	//         return `${key}='[]'`;
	// 	//     }
	// 	//     return `${key}='${value}'`;
	// 	// }).join(', ');
	// 	const updates = Object.entries(data)
	// 		.map(([key, value]) => {
	// 			try {
	// 				// value가 null이나 undefined인 경우 처리
	// 				if (value === null || value === undefined) {
	// 					return `${key}=NULL`;
	// 				}

	// 				// value가 Date 객체인 경우 처리
	// 				if (value instanceof Date) {
	// 					const formattedDate = Global.getInstance().getDateTime(value);
	// 					return `${key}='${formattedDate}'`;
	// 				}

	// 				// value가 문자열이고 날짜 형식인지 확인
	// 				if (
	// 					typeof value === 'string' &&
	// 					value.includes('-') &&
	// 					value.includes(':') &&
	// 					!isNaN(Date.parse(value))
	// 				) {
	// 					const dateValue = new Date(value); // 문자열을 Date 객체로 변환
	// 					const formattedDate = Global.getInstance().getDateTime(dateValue);
	// 					return `${key}='${formattedDate}'`;
	// 				}

	// 				// value가 빈 배열인지 확인
	// 				if (Array.isArray(value) && value.length <= 0) {
	// 					return `${key}='[]'`;
	// 				}

	// 				// 기본 처리
	// 				return `${key}='${value}'`;
	// 			} catch (error) {
	// 				console.error(`Error processing key: ${key}, value: ${value}`, error);
	// 				return `${key}=ERROR`;
	// 			}
	// 		})
	// 		.join(', ');
	// 	const query = `UPDATE ${tableName} SET ${updates} WHERE ${conditions}`;

	// 	try {
	// 		const result = await conn.query(query);
	// 		return result;
	// 	} catch (error) {
	// 		console.log(error);
	// 		throw error;
	// 	}
	// }

	public async delete(tableName: string, conditions: string): Promise<any> {
		const conn = await this.db.getConn();
		const query = `DELETE FROM ${tableName} WHERE ${conditions}`;

		try {
			const result = await conn.query(query);
			return result;
		} catch (error) {
			console.log(error);
			throw error;
		}
	}

	public async rawQuery(query: string): Promise<any> {
		const conn = await this.db.getConn();

		try {
			const result = await conn.query(query);
			return result;
		} catch (error) {
			console.log(error);
			throw error;
		}
	}
}