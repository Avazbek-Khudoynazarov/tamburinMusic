import { DatabaseService } from '../services/database-service';
import { Payments } from '../model/payments';

export class PaymentsService {
	private databaseService = new DatabaseService();
	
	
	public async findAll(options: {
		where?: Record<string, any>;
		orderBy?: { column: string; direction?: 'ASC' | 'DESC' };
		limit?: number;
		offset?: number;
	}): Promise<Payments[]> {
		const { where = {}, orderBy, limit, offset } = options;
	
		let conditions = '1=1';
		const values: any[] = [];
	
		Object.entries(where).forEach(([key, val]) => {
			conditions += ` AND ${key} = ?`;
			values.push(val);
		});
	
		let query = `
			SELECT
				payments.id AS payment_id,
				member.name AS student_name,
				teacher.name AS teacher_name,
				COUNT(classes.id) AS class_count,
				GROUP_CONCAT(DATE_FORMAT(classes.classes_date, ' %y.%m.%d') ORDER BY classes.classes_date) AS class_dates
			FROM payments
				LEFT JOIN member AS member ON payments.member_id = member.id
				LEFT JOIN member AS teacher ON payments.teacher_id = teacher.id
				LEFT JOIN classes ON classes.payments_id = payments.id AND classes.status = 20 -- 수업완료만
			WHERE payments.is_deleted = 'N'
				AND payments.status = 20
				AND ${conditions}
			GROUP BY payments.id, member.name
			HAVING class_count > 0
		`;

		if (orderBy?.column && orderBy?.direction) {
			query += ` ORDER BY (payments.periodic_status = '실패') DESC, ${orderBy.column} ${orderBy.direction}`;
		} else {
			query += ` ORDER BY (payments.periodic_status = '실패') DESC, payments.created_date DESC`;
		}
	
	
		if (limit !== undefined && offset !== undefined) {
			query += ` LIMIT ${limit} OFFSET ${offset}`;
		}
	
		const result = await this.databaseService.rawQueryWithParams(query, values);
	
		return result.map((row: Record<string, any>) => {
			const obj: any = {};
			for (const [key, value] of Object.entries(row)) {
				if (key.includes('.')) {
					const [parent, child] = key.split('.');
					obj[parent] = obj[parent] || {};
					obj[parent][child] = value;
				} else {
					obj[key] = value;
				}
			}
			return obj as Payments;
		});
	}

	public async findCurriculumNameByMemberId(memberId: number, curriculumName: string): Promise<boolean> {
		const result = await this.findByCondition(`payments.member_id = ${memberId} AND curriculum.name = '${curriculumName}' AND payments.curriculum_id = curriculum.id AND payments.status = 20`);
		return result.length ? false : true; //1개월 체험레슨 받은 경우 false 반환.
	}

	public async findByMemberIdAndStatus(member_id: number, status: number): Promise<Payments[]> {
    return this.findByCondition(`payments.member_id = ${member_id} AND payments.status = ${status}`);
  }

	public async findByMemberId(member_id: number): Promise<Payments[]> {
		return this.findByCondition(`payments.member_id = ${member_id}`);
	}

	public async findByTeacherId(teacher_id: number): Promise<Payments[]> {
		return this.findByCondition(`payments.teacher_id = ${teacher_id}`);
	}

	public async create(data: Payments): Promise<Payments> {
		return this.databaseService.insert('payments', data);
	}

	public async createFront(data: Payments): Promise<Payments> {
		return this.databaseService.insert('payments', data);
	}

	public async update(id: number, data: Partial<Payments>): Promise<Payments | undefined> {
		return this.databaseService.update('payments', data, `id=${id}`);
	}

	public async delete(id: number): Promise<Payments | undefined> {
		return this.databaseService.update('payments', { 'is_deleted': 'Y' }, `id=${id}`);
		//물리삭제 return this.databaseService.delete('payments', `id=${id}`);
	}

	public async count() {
		const count: number = await this.databaseService.rawQuery('SELECT COUNT(*) FROM payments');
		return count;
	}

	public async findAll2(): Promise<Payments[]> {
		return this.findByCondition('1=1');
	}

	public async findById(id: number): Promise<Payments | undefined> {
		const results = await this.findByCondition(`payments.id = ${id}`);
		return results.length ? results[0] : undefined;
	}

	public async findWithPagination(condition: string, page: number, count: number): Promise<Payments[]> {
		const offset = (page - 1) * count;
		return this.findByCondition(condition, count, offset);
	}


	public async findCalculateAll(classesStatus: number[], startDate: string, endDate: string, searchType: string, searchText: string): Promise<any[]> {
		let classesStatusQuery = '';
		if(classesStatus.length >= 1) {
			classesStatusQuery = ' AND (';
			for(let i = 0; i < classesStatus.length; i++) {
				if(i != 0) {
					classesStatusQuery += ' OR ';
				}
				classesStatusQuery += `classes.status = ${classesStatus[i]}`;
			}
			classesStatusQuery += ') ';
		}

		let searchTextQuery = '';
		if(searchType === 'member.teacher_name' && searchText !== '') {
			searchTextQuery = ` AND teacher.name LIKE '%${searchText}%'`;
		}

		// GROUP_CONCAT(DATE_FORMAT(classes.classes_date, ' %y.%m.%d') ORDER BY classes.classes_date) AS class_dates
		let query = `
			SELECT
    payments.id AS payment_id,
    member.name AS student_name,
    teacher.name AS teacher_name,
    COUNT(classes.id) AS class_count,
    GROUP_CONCAT(DATE_FORMAT(CONVERT_TZ(classes.classes_date, '+00:00', '+09:00'), '%y.%m.%d') ORDER BY classes.classes_date) AS class_dates
FROM payments
    LEFT JOIN member AS member ON payments.member_id = member.id
    LEFT JOIN member AS teacher ON payments.teacher_id = teacher.id
    LEFT JOIN classes ON classes.payments_id = payments.id ${classesStatusQuery} -- 수업 상태별 필터링
WHERE payments.is_deleted = 'N'
    AND payments.status = 20
    ${startDate ? `AND classes.classes_date >= '${startDate} 00:00:00'` : ''}
    ${endDate ? `AND classes.classes_date <= '${endDate} 23:59:59'` : ''}
    ${searchTextQuery}
GROUP BY payments.id, member.name
HAVING class_count > 0
ORDER BY
    (payments.periodic_status = '실패') DESC,
    payments.created_date DESC
			`;
			
			/*
			수업여부 조건: classes.status
			수업 시작일, 종료일 조건: classes.classes_date
			강사명 조건: teacher.name
			 */

		const list = await this.databaseService.rawQuery(query);

		return list.map((row: Record<string, any>) => {
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
			return result as Payments;
		});
	}



	private async findByCondition(condition: string, limit?: number, offset?: number): Promise<Payments[]> {
		const baseCondition = `payments.is_deleted = 'N'`;
		const finalCondition = condition ? `${baseCondition} AND (${condition})` : baseCondition;

		let query = `
			SELECT 
				payments.*, 
				member.id AS 'member.id', member.user_id AS 'member.user_id', member.name AS 'member.name', member.address1 AS 'member.address1', member.address2 AS 'member.address2', member.cellphone AS 'member.cellphone', member.gender AS 'member.gender', member.parent_name AS 'member.parent_name', member.parent_cellphone AS 'member.parent_cellphone'
				, teacher.name AS 'teacher.name'
				, instrument.name AS 'instrument.name'
				, curriculum.name AS 'curriculum.name', curriculum.months AS 'curriculum.months', curriculum.total_classes AS 'curriculum.total_classes'
			FROM payments 
				LEFT JOIN member 
				ON payments.member_id = member.id
				LEFT JOIN member as teacher
				ON payments.teacher_id = teacher.id
				LEFT JOIN instrument
				ON payments.instrument_id = instrument.id
				LEFT JOIN curriculum
				ON payments.curriculum_id = curriculum.id
			WHERE ${finalCondition}
			ORDER BY (payments.periodic_status = '실패') DESC,
  		payments.created_date DESC
			`;
		// ORDER BY payments.created_date DESC
		// let query = `SELECT * FROM payments WHERE ${finalCondition} ORDER BY created_date DESC`;

		// console.log(query);

		if (limit !== undefined && offset !== undefined) {
			query += ` LIMIT ${limit} OFFSET ${offset}`;
		}

		const list: Payments[] = await this.databaseService.rawQuery(query);

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
			return result as Payments;
		});
	}
}