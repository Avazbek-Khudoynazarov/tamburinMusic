import { DatabaseService } from '../services/database-service';
import { Meta } from '../model/meta';

export class MetaService {
  private databaseService = new DatabaseService();


	public async updateRow(meta: Meta[]): Promise<boolean> {
			try {
				for (const classItem of meta) {
					const { id, ...updateData } = classItem; // id를 조건으로 제외하고 나머지 데이터를 업데이트
					if (!id) {
						console.error('Missing ID for update');
						continue;
					}
					await this.databaseService.update('meta', updateData, `id=${id}`);
				}
				return true;
			} catch (error) {
				console.error('Error in updateRow:', error);
				return false;
			}
		}
	

	public async update(id: number, data: Partial<Meta>): Promise<Meta | undefined> {
		return this.databaseService.update('meta', data, `id=${id}`);
	}


  public async findByType(type: string): Promise<Meta[]> {
		const list: Meta[] = await this.databaseService.select('meta', `entity_type='${type}'`);
		return list;
}


  public async register(data: Meta): Promise<Meta> {
      const newData: Meta = await this.databaseService.insert('admin', data);
      return newData;
  }
  
  public async count() {
      const count: number = await this.databaseService.rawQuery('SELECT COUNT(*) FROM admin');
      return count;
  }


  public async delete(id: number) {
    const deleteAdmin = this.databaseService.delete('admin', `id=${id}`);
    return deleteAdmin;
  }
}