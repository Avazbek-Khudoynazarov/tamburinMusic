import { DatabaseService } from '../services/database-service';
import { Instrument } from '../model/instrument';

export class InstrumentService {
	private databaseService = new DatabaseService();

	public async create(data: Instrument): Promise<Instrument> {
		return this.databaseService.insert('instrument', data);
	}
	
	public async update(id: number, data: Partial<Instrument>): Promise<Instrument | undefined> {
		return this.databaseService.update('instrument', data, `id=${id}`);
	}

	public async delete(id: number): Promise<Instrument | undefined> {
		return this.databaseService.update('instrument', { 'is_deleted': 'Y' }, `id=${id}`);
		//물리삭제 return this.databaseService.delete('instrument', `id=${id}`);
	}

	public async count() {
		const count: number = await this.databaseService.rawQuery('SELECT COUNT(*) FROM instrument');
		return count;
	}

	public async findAll(): Promise<Instrument[]> {
		return this.findByCondition('1=1');
	}

	public async findById(id: number): Promise<Instrument | undefined> {
		const results = await this.findByCondition(`instrument.id = ${id}`);
		return results.length ? results[0] : undefined;
	}

	public async findByMemberId(member_id: number): Promise<Instrument[]> {
		return this.findByCondition(`member_id = ${member_id}`);
	}

	public async findWithPagination(condition: string, page: number, count: number): Promise<Instrument[]> {
		const offset = (page - 1) * count;
		return this.findByCondition(condition, count, offset);
	}




	private async findByCondition(condition: string, limit?: number, offset?: number): Promise<Instrument[]> {
		const baseCondition = `is_deleted = 'N'`;
		const finalCondition = condition ? `${baseCondition} AND (${condition})` : baseCondition;
	
		let query = `SELECT * FROM instrument WHERE ${finalCondition} ORDER BY display_order ASC`;

		
		if (limit !== undefined && offset !== undefined) {
			query += ` LIMIT ${limit} OFFSET ${offset}`;
		}
	
		const list: Instrument[] = await this.databaseService.rawQuery(query);
	
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
			return result as Instrument;
		});
	}
}