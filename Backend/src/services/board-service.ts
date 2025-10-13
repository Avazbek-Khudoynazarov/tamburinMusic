import { DatabaseService } from '../services/database-service';
import { Board } from '../model/board';

export class BoardService {
	private databaseService = new DatabaseService();

	public async findByType(type: string): Promise<Board[]> {
		return this.findByCondition(`board.type = '${type}'`);
	}

	public async create(data: Board): Promise<Board> {
		return this.databaseService.insert('board', data);
	}

	public async update(id: number, data: Partial<Board>): Promise<Board | undefined> {
		return this.databaseService.update('board', data, `id=${id}`);
	}

	public async updateCount(id: number): Promise<Board | undefined> {
		const query = `UPDATE board SET count = count + 1 WHERE id = ${id}`;
		return await this.databaseService.rawQuery(query);
	}

	public async delete(id: number): Promise<Board | undefined> {
		return this.databaseService.update('board', { 'board.is_deleted': 'Y' }, `id=${id}`);
		//물리삭제 return this.databaseService.delete('board', `id=${id}`);
	}

	public async count() {
		const count: number = await this.databaseService.rawQuery('SELECT COUNT(*) FROM board');
		return count;
	}

	public async findAll(): Promise<Board[]> {
		return this.findByCondition('1=1');
	}

	public async findById(id: number): Promise<Board | undefined> {
		const results = await this.findByCondition(`board.id = ${id}`);
		return results.length ? results[0] : undefined;
	}

	public async findByMemberId(member_id: number): Promise<Board[]> {
		return this.findByCondition(`member_id = ${member_id}`);
	}

	public async findWithPagination(condition: string, page: number, count: number): Promise<Board[]> {
		const offset = (page - 1) * count;
		return this.findByCondition(condition, count, offset);
	}




	private async findByCondition(condition: string, limit?: number, offset?: number): Promise<Board[]> {
		const baseCondition = `board.is_deleted = 'N'`;
		const finalCondition = condition ? `${baseCondition} AND (${condition})` : baseCondition;

		let query = `
				SELECT 
					board.*, 
					CASE
						WHEN board.created_by_type = 'admin' THEN admin.name
						WHEN board.created_by_type = 'member' THEN member.name
						ELSE '알 수 없음'
					END AS writer_name,
					CASE
						WHEN board.created_by_type = 'admin' THEN admin.admin_id
						WHEN board.created_by_type = 'member' THEN member.user_id
						ELSE NULL
					END AS writer_id
				FROM board 
				LEFT JOIN admin 
					ON board.admin_id = admin.id
				LEFT JOIN member 
					ON board.member_id = member.id
				WHERE ${finalCondition}
				ORDER BY board.created_date DESC;
		`;
		// let query = `
		// 	SELECT 
		// 		board.*, 
		// 		member.id AS 'member.id', member.user_id AS 'member.user_id', member.name AS 'member.name', member.cellphone AS 'member.cellphone' 
		// 	FROM board 
		// 	LEFT JOIN member 
		// 	ON member.id = board.member_id
		// 	WHERE ${finalCondition}
		// 	ORDER BY board.created_date DESC
		// `;
		// let query = `SELECT * FROM board WHERE ${finalCondition} ORDER BY created_date DESC`;


		if (limit !== undefined && offset !== undefined) {
			query += ` LIMIT ${limit} OFFSET ${offset}`;
		}

		const list: Board[] = await this.databaseService.rawQuery(query);

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
			return result as Board;
		});
	}
}