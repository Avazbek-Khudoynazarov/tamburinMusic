import { DatabaseService } from '../services/database-service';
import { BoardReply } from '../model/boardReply';

export class BoardReplyService {
	private databaseService = new DatabaseService();

	public async create(data: BoardReply): Promise<BoardReply> {
		return this.databaseService.insert('boardreply', data);
	}
	
	public async update(id: number, data: Partial<BoardReply>): Promise<BoardReply | undefined> {
		return this.databaseService.update('boardreply', data, `id=${id}`);
	}

	public async delete(id: number): Promise<BoardReply | undefined> {
		return this.databaseService.update('boardreply', { 'is_deleted': 'Y' }, `id=${id}`);
		//물리삭제 return this.databaseService.delete('boardreply', `id=${id}`);
	}

	public async count() {
		const count: number = await this.databaseService.rawQuery('SELECT COUNT(*) FROM boardreply');
		return count;
	}

	public async findAll(): Promise<BoardReply[]> {
		return this.findByCondition('1=1');
	}

	public async findById(id: number): Promise<BoardReply | undefined> {
		const results = await this.findByCondition(`boardreply.id = ${id}`);
		return results.length ? results[0] : undefined;
	}

	public async findByMemberId(member_id: number): Promise<BoardReply[]> {
		return this.findByCondition(`member_id = ${member_id}`);
	}

	public async findWithPagination(condition: string, page: number, count: number): Promise<BoardReply[]> {
		const offset = (page - 1) * count;
		return this.findByCondition(condition, count, offset);
	}




	private async findByCondition(condition: string, limit?: number, offset?: number): Promise<BoardReply[]> {
		const baseCondition = `is_deleted = 'N'`;
		const finalCondition = condition ? `${baseCondition} AND (${condition})` : baseCondition;
	
		let query = `
			SELECT 
				boardreply.*, 
				member.id AS 'member.id', member.name AS 'member.name', member.cellphone AS 'member.cellphone' 
			FROM boardreply 
			LEFT JOIN member 
			ON member.id = boardreply.member_id
			WHERE ${finalCondition}
			ORDER BY boardreply.created_date DESC
		`;
		// let query = `SELECT * FROM boardreply WHERE ${finalCondition} ORDER BY created_date DESC`;

		
		if (limit !== undefined && offset !== undefined) {
			query += ` LIMIT ${limit} OFFSET ${offset}`;
		}
	
		const list: BoardReply[] = await this.databaseService.rawQuery(query);
	
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
			return result as BoardReply;
		});
	}
}