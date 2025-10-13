import { DatabaseService } from '../services/database-service';
import { Banner } from '../model/banner';

export class BannerService {
	private databaseService = new DatabaseService();

	public async findByEntityType(entity_type: string): Promise<Banner[]> {
		return this.findByCondition(`entity_type = '${entity_type}'`);
	}


	public async deleteByEntityType(entity_type: string): Promise<Banner | undefined> {
		return this.databaseService.delete('banner', `entity_type='${entity_type}'`);
	}


	public async createRow(banner: Banner[]): Promise<boolean> {
		try {
			for (const classItem of banner) {
				await this.databaseService.insert('banner', classItem);
			}
			return true;
		} catch (error) {
			console.error('Error in createRow:', error);
			return false;
		}
	}

	// 개별 Row 업데이트
	public async updateRow(banner: Banner[]): Promise<boolean> {
		try {
			for (const classItem of banner) {
				const { id, ...updateData } = classItem; // id를 조건으로 제외하고 나머지 데이터를 업데이트
				if (!id) {
					console.error('Missing ID for update');
					continue;
				}
				await this.databaseService.update('banner', updateData, `id=${id}`);
			}
			return true;
		} catch (error) {
			console.error('Error in updateRow:', error);
			return false;
		}
	}




	public async create(data: Banner): Promise<Banner> {
		return this.databaseService.insert('banner', data);
	}

	public async update(id: number, data: Partial<Banner>): Promise<Banner | undefined> {
		return this.databaseService.update('banner', data, `id=${id}`);
	}

	public async delete(id: number): Promise<Banner | undefined> {
		return this.databaseService.update('banner', { 'is_deleted': 'Y' }, `id=${id}`);
		//물리삭제 return this.databaseService.delete('banner', `id=${id}`);
	}

	public async count() {
		const count: number = await this.databaseService.rawQuery('SELECT COUNT(*) FROM banner');
		return count;
	}

	public async findAll(): Promise<Banner[]> {
		return this.findByCondition('1=1');
	}

	public async findById(id: number): Promise<Banner | undefined> {
		const results = await this.findByCondition(`banner.id = ${id}`);
		return results.length ? results[0] : undefined;
	}

	public async findByMemberId(member_id: number): Promise<Banner[]> {
		return this.findByCondition(`member_id = ${member_id}`);
	}

	public async findWithPagination(condition: string, page: number, count: number): Promise<Banner[]> {
		const offset = (page - 1) * count;
		return this.findByCondition(condition, count, offset);
	}




	private async findByCondition(condition: string, limit?: number, offset?: number): Promise<Banner[]> {
		const baseCondition = ``;
		const finalCondition = condition ? `(${condition})` : baseCondition;

		let query = `SELECT * FROM banner WHERE ${finalCondition} ORDER BY created_date ASC`;


		if (limit !== undefined && offset !== undefined) {
			query += ` LIMIT ${limit} OFFSET ${offset}`;
		}

		const list: Banner[] = await this.databaseService.rawQuery(query);

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
			return result as Banner;
		});
	}
}