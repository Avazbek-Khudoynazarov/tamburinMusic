import dayjs from 'dayjs';
import { DatabaseService } from '../services/database-service';
import { PeriodicPayments } from '../model/periodicPayments';

export class PeriodicPaymentsService {
	private databaseService = new DatabaseService();

	public async create(data: PeriodicPayments): Promise<PeriodicPayments> {
		return this.databaseService.insert('periodic_payments', data);
	}
	
	public async update(id: number, data: Partial<PeriodicPayments>): Promise<PeriodicPayments | undefined> {
		return this.databaseService.update('periodic_payments', data, `id=${id}`);
	}

	public async delete(id: number): Promise<PeriodicPayments | undefined> {
		return this.databaseService.update('periodic_payments', { 'is_deleted': 'Y' }, `id=${id}`);
		//물리삭제 return this.databaseService.delete('periodic_payments', `id=${id}`);
	}

	public async count() {
		const count: number = await this.databaseService.rawQuery('SELECT COUNT(*) FROM periodic_payments');
		return count;
	}

	public async findByDate(startDate: Date, endDate: Date): Promise<PeriodicPayments[]> {
		//const kstStartTime = dayjs(startDate).tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss');
		//const kstEndTime = dayjs(endDate).tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss');
		const kstStartTime = dayjs(startDate).format('YYYY-MM-DD 00:00:00');
		const kstEndTime = dayjs(endDate).format('YYYY-MM-DD 23:59:59');
		return await this.findByCondition(`payment_date BETWEEN '${kstStartTime}' AND '${kstEndTime}' AND portone = 'N'`);
	}


	public async findByPaymentsId(payments_id: number): Promise<PeriodicPayments[]> {
		return this.findByCondition(`periodic_payments.payments_id = ${payments_id}`);
	}
	

	public async findAll(): Promise<PeriodicPayments[]> {
		return this.findByCondition('1=1');
	}

	public async findById(id: number): Promise<PeriodicPayments | undefined> {
		const results = await this.findByCondition(`periodic_payments.id = ${id}`);
		return results.length ? results[0] : undefined;
	}

	public async findByMemberId(member_id: number): Promise<PeriodicPayments[]> {
		return this.findByCondition(`member_id = ${member_id}`);
	}

	public async findWithPagination(condition: string, page: number, count: number): Promise<PeriodicPayments[]> {
		const offset = (page - 1) * count;
		return this.findByCondition(condition, count, offset);
	}




	private async findByCondition(condition: string, limit?: number, offset?: number): Promise<PeriodicPayments[]> {
		const baseCondition = `is_deleted = 'N'`;
		const finalCondition = condition ? `${baseCondition} AND (${condition})` : baseCondition;
	
		let query = `
			SELECT 
				periodic_payments.*, 
				member.id AS 'member.id', member.name AS 'member.name', member.cellphone AS 'member.cellphone' 
			FROM periodic_payments 
			LEFT JOIN member 
			ON member.id = periodic_payments.member_id
			WHERE ${finalCondition}
			ORDER BY periodic_payments.payment_date ASC
		`;
		// let query = `SELECT * FROM periodic_payments WHERE ${finalCondition} ORDER BY created_date DESC`;

		
		if (limit !== undefined && offset !== undefined) {
			query += ` LIMIT ${limit} OFFSET ${offset}`;
		}
	
		const list: PeriodicPayments[] = await this.databaseService.rawQuery(query);
	
		return list.map(row => {
			const result: any = {};
			Object.entries(row).forEach(([key, value]) => {
				if (key.includes('.')) {
					const [parent, child] = key.split('.');
					result[parent] = result[parent] || {};
					result[parent][child] = value;
				} else {
					result[key] = value;
				}
			});
			return result as PeriodicPayments;
		});
	}
}