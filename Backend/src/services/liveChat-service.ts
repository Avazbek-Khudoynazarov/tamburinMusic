import dayjs from 'dayjs';
import { DatabaseService } from '../services/database-service';
import { LiveChat } from '../model/liveChat';

export class LiveChatService {
	private databaseService = new DatabaseService();

	public async create(data: LiveChat): Promise<LiveChat> {
		return this.databaseService.insert('live_chat', data);
	}
	
	public async update(id: number, data: Partial<LiveChat>): Promise<LiveChat | undefined> {
		return this.databaseService.update('live_chat', data, `id=${id}`);
	}

	public async delete(id: number): Promise<LiveChat | undefined> {
		return this.databaseService.update('live_chat', { 'is_deleted': 'Y' }, `id=${id}`);
		//물리삭제 return this.databaseService.delete('live_chat', `id=${id}`);
	}

	public async count() {
		const count: number = await this.databaseService.rawQuery('SELECT COUNT(*) FROM live_chat');
		return count;
	}

	public async findNewMessageByUserId(type: string, memberId: number, updatedTime: Date): Promise<LiveChat[]> {
		const utcTime = dayjs(updatedTime).format('YYYY-MM-DD HH:mm:ss');

		if(type == 'teacher') {
			return this.findByCondition(`teacher_id = ${memberId} AND live_chat.created_date >= '${utcTime}'`);
		} else {
			return this.findByCondition(`member_id = ${memberId} AND live_chat.created_date >= '${utcTime}'`);
		}
	}


	public async findAll(): Promise<LiveChat[]> {
		return this.findByCondition('1=1');
	}

	public async findById(id: number): Promise<LiveChat | undefined> {
		const results = await this.findByCondition(`live_chat.id = ${id}`);
		return results.length ? results[0] : undefined;
	}

	public async findByMemberId(member_id: number, teacher_id: number): Promise<LiveChat[]> {
		return this.findByCondition(`member_id = ${member_id} AND teacher_id = ${teacher_id}`);
	}

	public async findWithPagination(condition: string, page: number, count: number): Promise<LiveChat[]> {
		const offset = (page - 1) * count;
		return this.findByCondition(condition, count, offset);
	}




	private async findByCondition(condition: string, limit?: number, offset?: number): Promise<LiveChat[]> {
		const finalCondition = condition;
	
		let query = `
			SELECT 
				live_chat.*, 
				student.name as student_name, teacher.name as teacher_name, sender.name as sender_name
			FROM live_chat 
			LEFT JOIN member as student ON student.id = live_chat.member_id 
			LEFT JOIN member as teacher ON teacher.id = live_chat.teacher_id 
			LEFT JOIN member as sender ON sender.id = live_chat.sender_id 
			WHERE ${finalCondition} 
			ORDER BY live_chat.created_date ASC
		`;
		// let query = `SELECT * FROM live_chat WHERE ${finalCondition} ORDER BY created_date`;

		
		if (limit !== undefined && offset !== undefined) {
			query += ` LIMIT ${limit} OFFSET ${offset}`;
		}
	
		const list: LiveChat[] = await this.databaseService.rawQuery(query);
	
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
			return result as LiveChat;
		});
	}
}