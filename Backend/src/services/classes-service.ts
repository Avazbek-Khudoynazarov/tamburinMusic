import { DatabaseService } from '../services/database-service';
import { Classes } from '../model/classes';

export class ClassesService {
	private databaseService = new DatabaseService();

	
	public async findByEnd(): Promise<Classes[]> {
		let query = `
			WITH RankedClasses AS (
    SELECT 
        c.id,
        c.member_id,
        c.payments_id,
        c.status,
        c.classes_date,
        c.created_date,
        ROW_NUMBER() OVER (PARTITION BY c.payments_id ORDER BY c.classes_date DESC) AS rn
    FROM classes c
)
SELECT 
    c.*,
    m.name AS 'member.name', 
    m.user_id AS 'member.user_id', 
    m.cellphone AS 'member.cellphone', 
    m.notification_type AS 'member.notification_type',
    t.id AS 'teacher.id', 
    t.name AS 'teacher.name', 
    t.user_id AS 'teacher.user_id', 
    t.cellphone AS 'teacher.cellphone',
    p.classes_link AS 'payments.classes_link',
    i.name AS 'instrument.name',
    cur.name AS 'curriculum.name'
FROM RankedClasses c
JOIN payments p ON c.payments_id = p.id
LEFT JOIN member m ON p.member_id = m.id
LEFT JOIN member t ON p.teacher_id = t.id
LEFT JOIN instrument i ON p.instrument_id = i.id
LEFT JOIN curriculum cur ON p.curriculum_id = cur.id
WHERE c.rn = 1
  AND DATE(c.classes_date) = DATE(CONVERT_TZ(NOW(), @@session.time_zone, 'Asia/Seoul'));

		`;


		const list: Classes[] = await this.databaseService.rawQuery(query);

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
			return result as Classes;
		});

	
	
	}
	
	public async findByToday(): Promise<Classes[]> {
		// KST 기준 현재 날짜로 비교 (classes_date는 이미 KST로 저장됨)
		return this.findByCondition(`DATE(classes_date) = DATE(CONVERT_TZ(NOW(), @@session.time_zone, 'Asia/Seoul')) AND payments.is_deleted = 'N'`);
	}
	
	public async findBy5M(): Promise<Classes[]> {
		// KST 기준 5분 후 시간으로 비교 (classes_date는 이미 KST로 저장됨)
		return this.findByCondition(`DATE_FORMAT(classes_date, '%Y-%m-%d %H:%i') = DATE_FORMAT(CONVERT_TZ(DATE_ADD(NOW(), INTERVAL 5 MINUTE), @@session.time_zone, 'Asia/Seoul'), '%Y-%m-%d %H:%i')`);
	}


	public async findByPaymentsId(payments_id: number): Promise<Classes[]> {
		return this.findByCondition(`payments_id = ${payments_id}`);
	}

	public async deleteByPaymentsId(payments_id: number): Promise<Classes | undefined> {
		return this.databaseService.delete('classes', `payments_id=${payments_id}`);
	}



	public async createRow(classes: Classes[]): Promise<boolean> {
		try {
			for (const classItem of classes) {
				await this.databaseService.insert('classes', classItem);
			}
			return true;
		} catch (error) {
			console.error('Error in createRow:', error);
			return false;
		}
	}

	// 개별 Row 업데이트
	public async updateRow(classes: Classes[]): Promise<boolean> {
		try {
			for (const classItem of classes) {
				const { id, ...updateData } = classItem; // id를 조건으로 제외하고 나머지 데이터를 업데이트
				if (!id) {
					await this.databaseService.insert('classes', updateData);
				} else {
					await this.databaseService.update('classes', updateData, `id=${id}`);
				}
			}
			return true;
		} catch (error) {
			console.error('Error in updateRow:', error);
			return false;
		}
	}



	public async create(data: Classes): Promise<Classes> {
		return this.databaseService.insert('classes', data);
	}

	public async update(id: number, data: Partial<Classes>): Promise<Classes | undefined> {
		return this.databaseService.update('classes', data, `id=${id}`);
	}

	public async delete(id: number): Promise<Classes | undefined> {
		// return this.databaseService.update('classes', { 'is_deleted': 'Y' }, `id=${id}`);
		return this.databaseService.delete('classes', `id=${id}`);
	}

	public async count() {
		const count: number = await this.databaseService.rawQuery('SELECT COUNT(*) FROM classes');
		return count;
	}

	public async findAll(): Promise<Classes[]> {
		return this.findByCondition('payments.status = 20 AND payments.is_deleted = "N"');
	}

	public async findById(id: number): Promise<Classes | undefined> {
		const results = await this.findByCondition(`classes.id = ${id}`);
		return results.length ? results[0] : undefined;
	}

	public async findByMemberId(member_id: number): Promise<Classes[]> {
		return this.findByCondition(`classes.member_id = ${member_id} AND payments.status = 20`);
	}

	public async findByTeacherId(teacher_id: number): Promise<Classes[]> {
		return this.findByCondition(`payments.teacher_id = ${teacher_id} AND payments.status = 20`);
	}

	public async findWithPagination(condition: string, page: number, count: number): Promise<Classes[]> {
		const offset = (page - 1) * count;
		return this.findByCondition(condition, count, offset);
	}

	public async findCountClassesByTeacher(member_id: number, type: string): Promise<Classes[] | any> {
		let query = `
			SELECT COUNT(*) AS completed_class_count
			FROM payments p
			JOIN classes c ON p.id = c.payments_id
			WHERE p.teacher_id = ${member_id}
				AND c.status = 20
		`;

		if (type == 'YEAR') {
			query += ` AND c.classes_date BETWEEN DATE_FORMAT(CURDATE(), '%Y-01-01') AND DATE_FORMAT(CURDATE(), '%Y-12-31')`;
		} else if (type == 'MONTH') {
			query += ` AND c.classes_date BETWEEN DATE_FORMAT(CURDATE(), '%Y-%m-01') AND LAST_DAY(CURDATE())`;
		} else if (type == 'LASTMONTH') {
			query += ` AND c.classes_date BETWEEN DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-01')
																		AND LAST_DAY(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))`;
		}


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
			return result as Classes;
		});

	}


	private async findByCondition(condition: string, limit?: number, offset?: number): Promise<Classes[]> {
		const baseCondition = ``;
		const finalCondition = condition ? `(${condition})` : baseCondition;

		let query = `
			SELECT 
				classes.*,
				member.name AS 'member.name', member.user_id AS 'member.user_id', member.cellphone AS 'member.cellphone', member.notification_type AS 'member.notification_type',
				teacher.id AS 'teacher.id', teacher.name AS 'teacher.name', teacher.user_id AS 'teacher.user_id', teacher.cellphone AS 'teacher.cellphone',
				payments.classes_link AS 'payments.classes_link',
				instrument.name AS 'instrument.name',
				curriculum.name AS 'curriculum.name'
			FROM classes
			LEFT JOIN payments ON classes.payments_id = payments.id
			LEFT JOIN member AS member ON payments.member_id = member.id
			LEFT JOIN member AS teacher ON payments.teacher_id = teacher.id
			LEFT JOIN instrument ON payments.instrument_id = instrument.id
			LEFT JOIN curriculum ON payments.curriculum_id = curriculum.id
			WHERE ${finalCondition}
			ORDER BY classes.classes_date ASC
		`;

		if (limit !== undefined && offset !== undefined) {
			query += ` LIMIT ${limit} OFFSET ${offset}`;
		}

		const list: Classes[] = await this.databaseService.rawQuery(query);

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
			return result as Classes;
		});
	}

}