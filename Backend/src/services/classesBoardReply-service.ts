import { DatabaseService } from '../services/database-service';
import { ClassesBoardReply } from '../model/classesBoardReply';

export class ClassesBoardReplyService {
	private databaseService = new DatabaseService();

	public async findByClassesBoardId(classesBoardReply: number): Promise<ClassesBoardReply[]> {
		return this.findByCondition(`classes_board_id = ${classesBoardReply}`);
	}

	public async create(data: ClassesBoardReply): Promise<ClassesBoardReply> {
		return this.databaseService.insert('classes_board_reply', data);
	}

	public async update(id: number, data: Partial<ClassesBoardReply>): Promise<ClassesBoardReply | undefined> {
		return this.databaseService.update('classes_board_reply', data, `id=${id}`);
	}

	public async delete(id: number): Promise<ClassesBoardReply | undefined> {
		return this.databaseService.update('classes_board_reply', { 'classes_board_reply.is_deleted': 'Y' }, `id=${id}`);
		//물리삭제 return this.databaseService.delete('classes_board_reply', `id=${id}`);
	}

	public async count() {
		const count: number = await this.databaseService.rawQuery('SELECT COUNT(*) FROM classes_board_reply');
		return count;
	}

	public async findAll(): Promise<ClassesBoardReply[]> {
		return this.findByCondition('1=1');
	}

	public async findById(id: number): Promise<ClassesBoardReply | undefined> {
		const results = await this.findByCondition(`classes_board_reply.id = ${id}`);
		return results.length ? results[0] : undefined;
	}

	public async findByMemberId(member_id: number): Promise<ClassesBoardReply[]> {
		return this.findByCondition(`member_id = ${member_id}`);
	}

	public async findWithPagination(condition: string, page: number, count: number): Promise<ClassesBoardReply[]> {
		const offset = (page - 1) * count;
		return this.findByCondition(condition, count, offset);
	}




	private async findByCondition(condition: string, limit?: number, offset?: number): Promise<ClassesBoardReply[]> {
		const baseCondition = `classes_board_reply.is_deleted = 'N'`;
		const finalCondition = condition ? `${baseCondition} AND (${condition})` : baseCondition;

		let query = `
			SELECT 
				classes_board_reply.*, 
				member.id AS 'member.id', member.user_id AS 'member.user_id', member.name AS 'member.name', member.cellphone AS 'member.cellphone' 
			FROM classes_board_reply 
			LEFT JOIN member 
			ON member.id = classes_board_reply.member_id
			WHERE ${finalCondition}
			ORDER BY classes_board_reply.created_date ASC
		`;
		// let query = `SELECT * FROM classes_board_reply WHERE ${finalCondition} ORDER BY created_date DESC`;


		if (limit !== undefined && offset !== undefined) {
			query += ` LIMIT ${limit} OFFSET ${offset}`;
		}

		const list: ClassesBoardReply[] = await this.databaseService.rawQuery(query);

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
			return result as ClassesBoardReply;
		});
	}
}