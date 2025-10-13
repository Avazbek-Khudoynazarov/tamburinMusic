import { DatabaseService } from '../services/database-service';
import { Popup } from '../model/popup';

export class PopupService {
	private databaseService = new DatabaseService();

	public async create(data: Popup): Promise<Popup> {
		return this.databaseService.insert('popup', data);
	}
	
	public async update(id: number, data: Partial<Popup>): Promise<Popup | undefined> {
		return this.databaseService.update('popup', data, `id=${id}`);
	}

	public async delete(id: number): Promise<Popup | undefined> {
		return this.databaseService.update('popup', { 'is_deleted': 'Y' }, `id=${id}`);
		//물리삭제 return this.databaseService.delete('popup', `id=${id}`);
	}

	public async count() {
		const count: number = await this.databaseService.rawQuery('SELECT COUNT(*) FROM popup');
		return count;
	}

	public async findAll(): Promise<Popup[]> {
		return this.findByCondition('1=1');
	}

	public async findToday(): Promise<Popup[]> {
		return this.findByCondition('CURDATE() BETWEEN start_date AND end_date');
	}

	public async findById(id: number): Promise<Popup | undefined> {
		const results = await this.findByCondition(`popup.id = ${id}`);
		return results.length ? results[0] : undefined;
	}

	public async findByMemberId(member_id: number): Promise<Popup[]> {
		return this.findByCondition(`member_id = ${member_id}`);
	}

	public async findWithPagination(condition: string, page: number, count: number): Promise<Popup[]> {
		const offset = (page - 1) * count;
		return this.findByCondition(condition, count, offset);
	}




	private async findByCondition(condition: string, limit?: number, offset?: number): Promise<Popup[]> {
		const baseCondition = `is_deleted = 'N'`;
		const finalCondition = condition ? `${baseCondition} AND (${condition})` : baseCondition;
	
		let query = `SELECT * FROM popup WHERE ${finalCondition} ORDER BY created_date ASC`;

		
		if (limit !== undefined && offset !== undefined) {
			query += ` LIMIT ${limit} OFFSET ${offset}`;
		}
	
		const list: Popup[] = await this.databaseService.rawQuery(query);
	
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
			return result as Popup;
		});
	}
}