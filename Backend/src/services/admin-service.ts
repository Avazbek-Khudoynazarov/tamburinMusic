import { DatabaseService } from '../services/database-service';
import { Admin } from '../model/admin';

export class AdminService {
	private databaseService = new DatabaseService();

	public async register(data: Admin): Promise<Admin> {
		const newData: Admin = await this.databaseService.insert('admin', data);
		return newData;
	}

	public async count() {
		const count: number = await this.databaseService.rawQuery('SELECT COUNT(*) FROM admin');
		return count;
	}

	public async findAdminById(admin_id: string): Promise<Admin | undefined> {
		const list: Admin[] = await this.databaseService.select('admin', `admin_id='${admin_id}'`);
		if (list.length > 0) {
			return list[0];
		}
		return undefined;
	}

	public async find(page: number, count: number): Promise<Admin[]> {
		const list: Admin[] = await this.databaseService.rawQuery(`SELECT * FROM admin ORDER BY created_date DESC LIMIT ${(page - 1) * count}, ${count}`);
		return list;
	}

	public async update(id: number, admin: Admin): Promise<Admin | undefined> {
		const adminData: Admin | undefined = await this.databaseService.update('admin', admin, `id=${id}`);
		return adminData;
	}

	public async delete(id: number) {
		const deleteAdmin = this.databaseService.delete('admin', `id=${id}`);
		return deleteAdmin;
	}
}