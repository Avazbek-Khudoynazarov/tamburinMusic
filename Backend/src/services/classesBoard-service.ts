import { DatabaseService } from '../services/database-service';
import { ClassesBoard } from '../model/classesBoard';

export class ClassesBoardService {
	private databaseService = new DatabaseService();

	public async findByMemberIdTeacherId(member_id: number, teacher_id: number): Promise<ClassesBoard[]> {
		return this.findByCondition(`payments.member_id = ${member_id} AND payments.teacher_id = ${teacher_id}`);
	}

	public async findByPaymentsId(payments_id: number): Promise<ClassesBoard[]> {
		return this.findByCondition(`classes_board.payments_id = ${payments_id}`);
	}

	public async create(data: ClassesBoard): Promise<ClassesBoard> {
		return this.databaseService.insert('classes_board', data);
	}

	public async update(id: number, data: Partial<ClassesBoard>): Promise<ClassesBoard | undefined> {
		return this.databaseService.update('classes_board', data, `classes_board.id=${id}`);
	}

	public async delete(id: number): Promise<ClassesBoard | undefined> {
		return this.databaseService.update('classes_board', { 'classes_board.is_deleted': 'Y' }, `id=${id}`);
		//물리삭제 return this.databaseService.delete('classesboard', `id=${id}`);
	}

	public async count() {
		const count: number = await this.databaseService.rawQuery('SELECT COUNT(*) FROM classes_board');
		return count;
	}

	public async findAll(): Promise<ClassesBoard[]> {
		return this.findByCondition('1=1');
	}

	public async findById(id: number): Promise<ClassesBoard | undefined> {
		const results = await this.findByCondition(`classes_board.id = ${id}`);
		return results.length ? results[0] : undefined;
	}

	public async findByMemberId(member_id: number): Promise<ClassesBoard[]> {
		return this.findByCondition(`member_id = ${member_id}`);
	}

	public async findWithPagination(condition: string, page: number, count: number): Promise<ClassesBoard[]> {
		const offset = (page - 1) * count;
		return this.findByCondition(condition, count, offset);
	}




	private async findByCondition(condition: string, limit?: number, offset?: number): Promise<ClassesBoard[]> {
		const baseCondition = `classes_board.is_deleted = 'N'`;
		const finalCondition = condition ? `${baseCondition} AND (${condition})` : baseCondition;

		let query = `
			SELECT 
				classes_board.*, 
				member.id AS 'member.id', member.user_id AS 'member.user_id', member.name AS 'member.name'
				, teacher.name AS 'teacher.name'
				, student.name AS 'student.name'
				, instrument.name AS 'instrument.name'
				, curriculum.name AS 'curriculum.name'
			FROM classes_board 
				LEFT JOIN member 
				ON classes_board.member_id = member.id
				LEFT JOIN payments
				ON classes_board.payments_id = payments.id
				LEFT JOIN member as teacher
				ON payments.teacher_id = teacher.id
				LEFT JOIN member as student
				ON payments.member_id = student.id
				LEFT JOIN instrument
				ON payments.instrument_id = instrument.id
				LEFT JOIN curriculum
				ON payments.curriculum_id = curriculum.id
			WHERE ${finalCondition}
			ORDER BY classes_board.created_date DESC
		`;
		// let query = `SELECT * FROM classesboard WHERE ${finalCondition} ORDER BY created_date DESC`;


		if (limit !== undefined && offset !== undefined) {
			query += ` LIMIT ${limit} OFFSET ${offset}`;
		}

		const list: ClassesBoard[] = await this.databaseService.rawQuery(query);

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
			return result as ClassesBoard;
		});
	}
}