import { DatabaseService } from '../services/database-service';
import { Attachment } from '../model/attachment';

export class AttachmentService {
	private databaseService = new DatabaseService();


	public async findByEntity(entity_type: string, entity_id: number): Promise<Attachment[]> {
		return this.findByCondition(`entity_type = '${entity_type}' and entity_id = ${entity_id}`);
	}
	






	public async create(data: Attachment): Promise<Attachment> {
		return this.databaseService.insert('attachment', data);
	}
	
	public async update(id: number, data: Partial<Attachment>): Promise<Attachment | undefined> {
		return this.databaseService.update('attachment', data, `id=${id}`);
	}

	public async delete(id: number): Promise<Attachment | undefined> {
		return this.databaseService.delete('attachment', `id=${id}`);
	}

	public async count() {
		const count: number = await this.databaseService.rawQuery('SELECT COUNT(*) FROM attachment');
		return count;
	}

	public async findAll(): Promise<Attachment[]> {
		return this.findByCondition('1=1');
	}

	public async findById(id: number): Promise<Attachment | undefined> {
		const results = await this.findByCondition(`attachment.id = ${id}`);
		return results.length ? results[0] : undefined;
	}

	public async findByMemberId(member_id: number): Promise<Attachment[]> {
		return this.findByCondition(`member_id = ${member_id}`);
	}

	public async findWithPagination(condition: string, page: number, count: number): Promise<Attachment[]> {
		const offset = (page - 1) * count;
		return this.findByCondition(condition, count, offset);
	}




	private async findByCondition(condition: string, limit?: number, offset?: number): Promise<Attachment[]> {
		const baseCondition = ``;
		const finalCondition = condition ? `(${condition})` : baseCondition;
	
		let query = `SELECT * FROM attachment WHERE ${finalCondition} ORDER BY created_date DESC`;

		
		if (limit !== undefined && offset !== undefined) {
			query += ` LIMIT ${limit} OFFSET ${offset}`;
		}
	
		const list: Attachment[] = await this.databaseService.rawQuery(query);
	
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
			return result as Attachment;
		});
	}
}