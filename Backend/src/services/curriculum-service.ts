import { DatabaseService } from '../services/database-service';
import { Curriculum } from '../model/curriculum';

export class CurriculumService {
	private databaseService = new DatabaseService();

	public async create(data: Curriculum): Promise<Curriculum> {
		return this.databaseService.insert('curriculum', data);
	}

	public async update(id: number, data: Partial<Curriculum>): Promise<Curriculum | undefined> {
		return this.databaseService.update('curriculum', data, `id=${id}`);
	}

	public async delete(id: number): Promise<Curriculum | undefined> {
		return this.databaseService.update('curriculum', { 'is_deleted': 'Y' }, `id=${id}`);
		//물리삭제 return this.databaseService.delete('curriculum', `id=${id}`);
	}

	public async count() {
		const count: number = await this.databaseService.rawQuery('SELECT COUNT(*) FROM curriculum');
		return count;
	}

	public async findAll(): Promise<Curriculum[]> {
		return this.findByCondition('1=1');
	}

	public async findBy1month(instrument_id: number): Promise<Curriculum[]> {
		return this.findByCondition(`curriculum.instrument_id = ${instrument_id} AND curriculum.name = '1개월 체험레슨'`);
	}

	public async findMonthByInstrumentIdAll(instrument_id: number): Promise<Curriculum[]> {
		return this.findMonthByCondition(`instrument_id = ${instrument_id} AND name != '1개월 체험레슨'`);
	}

	public async findByInstrumentIdMonthAll(instrument_id: number, months: number): Promise<Curriculum[]> {
		return this.findByCondition(`curriculum.instrument_id = ${instrument_id} and curriculum.months = ${months} AND curriculum.name != '1개월 체험레슨'`);
	}

	public async findByInstrumentIdAll(instrument_id: number): Promise<Curriculum[]> {
		return this.findByCondition(`instrument_id = ${instrument_id}`);
	}


	public async findById(id: number): Promise<Curriculum | undefined> {
		const results = await this.findByCondition(`curriculum.id = ${id}`);
		return results.length ? results[0] : undefined;
	}

	public async findByMemberId(member_id: number): Promise<Curriculum[]> {
		return this.findByCondition(`member_id = ${member_id}`);
	}

	public async findWithPagination(condition: string, page: number, count: number): Promise<Curriculum[]> {
		const offset = (page - 1) * count;
		return this.findByCondition(condition, count, offset);
	}




	private async findByCondition(condition: string, limit?: number, offset?: number): Promise<Curriculum[]> {
		const baseCondition = `curriculum.is_deleted = 'N'`;
		const finalCondition = condition ? `${baseCondition} AND (${condition})` : baseCondition;

		let query = `
			SELECT 
				curriculum.*, 
				instrument.id AS 'instrument.id', instrument.name AS 'instrument.name'
			FROM curriculum 
			LEFT JOIN instrument 
			ON curriculum.instrument_id = instrument.id
			WHERE ${finalCondition}
			ORDER BY curriculum.total_classes ASC
			`;
		// ORDER BY curriculum.created_date DESC
		// let query = `SELECT * FROM curriculum WHERE ${finalCondition} ORDER BY created_date DESC`;


		if (limit !== undefined && offset !== undefined) {
			query += ` LIMIT ${limit} OFFSET ${offset}`;
		}

		const list: Curriculum[] = await this.databaseService.rawQuery(query);

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
			return result as Curriculum;
		});
	}

	

	private async findMonthByCondition(condition: string, limit?: number, offset?: number): Promise<Curriculum[]> {
		const baseCondition = `curriculum.is_deleted = 'N'`;
		const finalCondition = condition ? `${baseCondition} AND (${condition})` : baseCondition;

		let query = `SELECT distinct(months), image_file, id FROM curriculum WHERE ${finalCondition} GROUP BY months ORDER BY months DESC`;

		if (limit !== undefined && offset !== undefined) {
			query += ` LIMIT ${limit} OFFSET ${offset}`;
		}

		const list: Curriculum[] = await this.databaseService.rawQuery(query);

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
			return result as Curriculum;
		});
	}


}