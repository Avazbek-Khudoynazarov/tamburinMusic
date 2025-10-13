import { DatabaseService } from '../services/database-service';
import { Member } from '../model/member';

export class MemberService {
	private databaseService = new DatabaseService();

	public async register(data: Member): Promise<Member> {
		const newData: Member = await this.databaseService.insert('member', data);
		return newData;
	}

	public async count() {
		const count: number = await this.databaseService.rawQuery('SELECT COUNT(*) FROM member');
		return count;
	}

	public async findByInfo(userId: string, name: string, cellphone: string): Promise<Member | undefined> {
		const members: Member[] = await this.databaseService.select('member', `userId='${userId}' and name='${name}' and cellphone='${cellphone}'`);
		if (members.length > 0) {
			return members[0];
		}
		return undefined;
	}

	public async findCellphone(cellphone: string): Promise<Member | undefined> {
		const members: Member[] = await this.databaseService.select('member', `cellphone='${cellphone}'`);
		if (members.length > 0) {
			return members[0];
		}
		return undefined;
	}

	public async findUserByCI(ci: string): Promise<Member | undefined> {
		const members: Member[] = await this.databaseService.select('member', `login_ci_data='${ci}'`);
		if (members.length > 0) {
			return members[0];
		}
		return undefined;
	}

	public async findUserByUserId(user_id: string): Promise<Member | undefined> {
		const members: Member[] = await this.databaseService.select('member', `user_id='${user_id}'`);
		if (members.length > 0) {
			return members[0];
		}
		return undefined;
	}

	public async findUserById(id: number): Promise<Member | undefined> {
		const members: Member[] = await this.databaseService.select('member', `id=${id}`);
		if (members.length > 0) {
			return members[0];
		}
		return undefined;
	}

	public async findAll(): Promise<Member[]> {
		const memberList: Member[] = await this.databaseService.rawQuery(`SELECT * FROM member WHERE status != 10 ORDER BY created_date DESC`);
		return memberList;
	}

	public async findTypeAll(type: number): Promise<Member[]> {
		const query = `
			SELECT * 
			FROM member 
			WHERE type = ${type}
			AND status != 10
			ORDER BY created_date DESC
		`;

		// 쿼리 실행
		const memberList: Member[] = await this.databaseService.rawQuery(query);
		return memberList;
	}

	public async find(page: number, count: number): Promise<Member[]> {
		const memberList: Member[] = await this.databaseService.rawQuery(`SELECT * FROM member ORDER BY created_date DESC LIMIT ${(page - 1) * count}, ${count}`);
		return memberList;
	}

	public async update(id: number, member: Member): Promise<Member | undefined> {
		if (typeof member.approve_date === 'string') {
			member.approve_date = new Date(member.approve_date);
		}
		if (typeof member.created_date === 'string') {
			member.created_date = new Date(member.created_date);
		}

		const memberData: Member | undefined = await this.databaseService.update('member', member, `id=${id}`);
		return memberData;
	}

	public async updatePassword(user_id: string, password: string): Promise<Member | undefined> {
		const memberData: Member | undefined = await this.databaseService.update('member', {password: password}, `user_id='${user_id}'`);
		return memberData;
	}

	public async delete(id: number) {
		await this.databaseService.rawQuery(`UPDATE member SET status = 40 WHERE id=${id}`);
		//const deleteUser = this.databaseService.delete('member', `id=${id}`);
		return true;
	}
}