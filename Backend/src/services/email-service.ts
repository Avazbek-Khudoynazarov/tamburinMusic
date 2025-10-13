import nodemailer from 'nodemailer';
import config from '../config';

import { DatabaseService } from '../services/database-service';
import { Email } from '../model/email';

export class EmailService {
	private databaseService = new DatabaseService();

	public async sendEmail(params: any) {
		try {
			if(process.env.NODE_ENV == 'development') {
                return;
            }
			
			const gmailId = config.gmailId;
			const gmailPassword = config.gmailPassword;
			const gmailSender = config.gmailSender;

			const transporter = nodemailer.createTransport({
				service: 'gmail',
				auth: {
					user: gmailId,
					pass: gmailPassword
				}
			});

			const now = new Date();
			const nowDate = now;

			const year = now.getFullYear();
			const month = String(now.getMonth() + 1).padStart(2, '0');
			const day = String(now.getDate()).padStart(2, '0');
			const hours = String(now.getHours()).padStart(2, '0');
			const minutes = String(now.getMinutes()).padStart(2, '0');
			const seconds = String(now.getSeconds()).padStart(2, '0');
			// 형식에 맞춰 문자열로 조합
			const formattedDate = `${year}년 ${month}월 ${day}일 ${hours}:${minutes}:${seconds}`;

			const futureDate = new Date(now);
			futureDate.setMinutes(now.getMinutes() + 10);


			const mailOptions = {
				from: `탬버린뮤직 <${gmailSender}>`,
				to: params.email,
				subject: params.subject,
				html: params.content
			};


			if (params.type) {
				// 이메일 인증 테이블 등록
				const emailData = {
					user_id: params.email,
					token: params.token,
					type: params.type,
					status: '대기',
					created_at: nowDate,
					expires_at: futureDate,
				}
				this.create(emailData);
			}


			const response = await transporter.sendMail(mailOptions);
			return response;
		} catch (error) {
			console.error('Error : ', error);
			return false;
		}
	}






	public async sendEmail2(recieverEmail: string, type: string) {
		try {
			const gmailId = config.gmailId;
			const gmailPassword = config.gmailPassword;
			const gmailSender = config.gmailSender;
			let subject;
			let content;

			const transporter = nodemailer.createTransport({
				service: 'gmail',
				auth: {
					user: gmailId,
					pass: gmailPassword
				}
			});

			const now = new Date();
			const nowDate = now;

			const year = now.getFullYear();
			const month = String(now.getMonth() + 1).padStart(2, '0');
			const day = String(now.getDate()).padStart(2, '0');
			const hours = String(now.getHours()).padStart(2, '0');
			const minutes = String(now.getMinutes()).padStart(2, '0');
			const seconds = String(now.getSeconds()).padStart(2, '0');
			// 형식에 맞춰 문자열로 조합
			const formattedDate = `${year}년 ${month}월 ${day}일 ${hours}:${minutes}:${seconds}`;

			const futureDate = new Date(now);
			futureDate.setMinutes(now.getMinutes() + 10);


			const randomSixDigitNumber = Math.floor(Math.random() * 900000) + 100000;

			if (type === '회원가입') {
				subject = '[탬버린뮤직] 회원가입 인증번호 안내 메일입니다.';
				content = `<table align="center" width="780px" border="0" cellpadding="0" cellspacing="0">
	<tbody>
	<tr>
		<td style="background:#fff; padding:30px 0 40px 30px; border-top:1px solid #b6b6b6; border-left:1px solid #b6b6b6; border-right:1px solid #b6b6b6; font-family:dotum, sans-serif; line-height:22px; color:#666;">
			 안녕하세요. 탬버린 뮤직 입니다. <br>
			<span style="color:#d00000;">탬버린 뮤직(tamburinmusic.com)</span>의 안전한 이용을 위해 이메일 인증을 진행합니다. <br>
			<br>
			아래 인증번호를 <span style="color:#f26522;font-weight:bold">입력하여</span> 인증을 완료해 주세요. <br>
			개인정보보호를 위해 발송된 <span style="color:#f26522;font-weight:bold">인증번호는 10분간 유효</span>합니다.
		</td>
	</tr>
	<tr>
		<td style=" background:#fff; padding-left:30px; border-left:1px solid #b6b6b6; border-right:1px solid #b6b6b6;">
			<table width="718" border="0" cellspacing="0" cellpadding="0" summary="인증번호 안내">
			<tbody>
			<tr>
				<td height="3" colspan="2" style="background:#333;">
				</td>
			</tr>
			<tr>
				<td align="center" width="150" height="38" style="background:#f7f7f7;font-family:dotum, sans-serif; font-size:12px; color:#111; font-weight:bold">
					인증번호
				</td>
				<td style="padding-left:20px; font-family:dotum, sans-serif; font-size:15px; color:#111; font-weight:bold">
					${randomSixDigitNumber}
				</td>
			</tr>
			<tr>
				<td height="1" colspan="2" style="background:#d2d2d2;">
				</td>
			</tr>
			<tr>
				<td align="center" height="38" style="background:#f7f7f7;font-family:dotum, sans-serif; font-size:12px; color:#111;font-weight:bold">
					발급시간
				</td>
				<td style="padding-left:20px; font-family:dotum, sans-serif; font-size:12px; color:#d00000;font-weight:bold">
					${formattedDate}
				</td>
			</tr>
			<tr>
				<td height="2" colspan="2" style="background:#d2d2d2;">
				</td>
			</tr>
			</tbody>
			</table>
		</td>
	</tr>
	<tr>
		<td style="background:#fff; padding:40px 0 20px 30px; border-left:1px solid #b6b6b6; border-right:1px solid #b6b6b6;border-bottom:1px solid #b6b6b6;  font-family:dotum, sans-serif; font-size:11px; color:#333; line-height:22px; ">
			 본 메일은 발신전용으로 회신되지 않습니다. 
		</td>
	</tr>
	</tbody>
	<!--footer-->
	</table>`;

			} else if (type === '비밀번호찾기') {
				subject = '[탬버린뮤직] 비밀번호 찾기 인증번호 안내 메일입니다.';
				content = `<table align="center" width="780px" border="0" cellpadding="0" cellspacing="0">
	<tbody>
	<tr>
		<td style="background:#fff; padding:30px 0 40px 30px; border-top:1px solid #b6b6b6; border-left:1px solid #b6b6b6; border-right:1px solid #b6b6b6; font-family:dotum, sans-serif; line-height:22px; color:#666;">
			 안녕하세요. 탬버린 뮤직 입니다. <br>
			<span style="color:#d00000;">탬버린 뮤직(tamburinmusic.com)</span>의 안전한 이용을 위해 이메일 인증을 진행합니다. <br>
			<br>
			아래 인증번호를 <span style="color:#f26522;font-weight:bold">입력하여</span> 인증을 완료해 주세요. <br>
			개인정보보호를 위해 발송된 <span style="color:#f26522;font-weight:bold">인증번호는 10분간 유효</span>합니다.
		</td>
	</tr>
	<tr>
		<td style=" background:#fff; padding-left:30px; border-left:1px solid #b6b6b6; border-right:1px solid #b6b6b6;">
			<table width="718" border="0" cellspacing="0" cellpadding="0" summary="인증번호 안내">
			<tbody>
			<tr>
				<td height="3" colspan="2" style="background:#333;">
				</td>
			</tr>
			<tr>
				<td align="center" width="150" height="38" style="background:#f7f7f7;font-family:dotum, sans-serif; font-size:12px; color:#111; font-weight:bold">
					인증번호
				</td>
				<td style="padding-left:20px; font-family:dotum, sans-serif; font-size:15px; color:#111; font-weight:bold">
					${randomSixDigitNumber}
				</td>
			</tr>
			<tr>
				<td height="1" colspan="2" style="background:#d2d2d2;">
				</td>
			</tr>
			<tr>
				<td align="center" height="38" style="background:#f7f7f7;font-family:dotum, sans-serif; font-size:12px; color:#111;font-weight:bold">
					발급시간
				</td>
				<td style="padding-left:20px; font-family:dotum, sans-serif; font-size:12px; color:#d00000;font-weight:bold">
					${formattedDate}
				</td>
			</tr>
			<tr>
				<td height="2" colspan="2" style="background:#d2d2d2;">
				</td>
			</tr>
			</tbody>
			</table>
		</td>
	</tr>
	<tr>
		<td style="background:#fff; padding:40px 0 20px 30px; border-left:1px solid #b6b6b6; border-right:1px solid #b6b6b6;border-bottom:1px solid #b6b6b6;  font-family:dotum, sans-serif; font-size:11px; color:#333; line-height:22px; ">
			 본 메일은 발신전용으로 회신되지 않습니다. 
		</td>
	</tr>
	</tbody>
	<!--footer-->
	</table>`;

			}

			const mailOptions = {
				from: `탬버린뮤직 <${gmailSender}>`,
				to: recieverEmail,
				subject: subject,
				html: content
			};

			// 이메일 인증 테이블 등록
			const emailData = {
				user_id: recieverEmail,
				token: randomSixDigitNumber.toString(),
				type,
				status: '대기',
				created_at: nowDate,
				expires_at: futureDate,
			}
			this.create(emailData);

			const response = await transporter.sendMail(mailOptions);
			return response;
		} catch (error) {
			console.error('Error : ', error);
			return false;
		}
	}


	public async create(data: Email): Promise<Email> {
		if(data.token == undefined) {
			data.token = '';
		}
		return this.databaseService.insert('email_verification', data);
	}

	public async update(id: number, data: Partial<Email>): Promise<Email | undefined> {
		if(data.token == undefined) {
			data.token = '';
		}
		
		if (typeof data.created_at === 'string') {
			data.created_at = new Date(data.created_at);
		}
		if (typeof data.expires_at === 'string') {
			data.expires_at = new Date(data.expires_at);
		}
		return this.databaseService.update('email_verification', data, `id=${id}`);
	}

	public async delete(id: number): Promise<Email | undefined> {
		return this.databaseService.delete('email_verification', `id=${id}`);
	}

	public async findByUserId(user_id: string, token: string): Promise<Email[]> {
		// return this.findByCondition(`user_id = '${user_id}' and token = '${token}' AND expires_at > NOW()`);
		return this.findByCondition(`
			user_id = '${user_id}' 
			and token = '${token}' 
			AND DATE_ADD(expires_at, INTERVAL 9 HOUR) > NOW()
		`);
		
	}

	public async findByUserIdStatus(user_id: string, token: string, status: string): Promise<Email[]> {
		return this.findByCondition(`user_id = '${user_id}' and token = '${token}' and status = '${status}'`);
	}




	private async findByCondition(condition: string, limit?: number, offset?: number): Promise<Email[]> {
		let query = `SELECT * FROM email_verification WHERE ${condition} ORDER BY created_at DESC`;

		console.log(query);

		if (limit !== undefined && offset !== undefined) {
			query += ` LIMIT ${limit} OFFSET ${offset}`;
		}

		const list: Email[] = await this.databaseService.rawQuery(query);

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
			return result as Email;
		});
	}

}