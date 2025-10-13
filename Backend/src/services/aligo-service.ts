import axios from 'axios';
import querystring from 'querystring';
import config from '../config';

export class AligoService {

	public async sendKakao(params:any) {
		try {

            if(process.env.NODE_ENV == 'development') {
                return;
            }

			// if(params.phone && params.phone == '01051321404') {
			// 	params.phone = '01067345725';
			// }

			this.sendAlimTalk(params.code, params.phone, params.content);
			return true;

		} catch (error) {
			console.error('Error : ', error);
			return false;
		}
	}

	public async sendAlimTalk(tplCode: string, receiverPhone: string, message: string) {
        try{
            const userId = config.aligoUserId;
            const sender = config.aligoSender;
            const apiKey = config.aligoApiKey;
            const senderKey = config.aligoSenderKey;
            const testMode = config.aligoTestMode;

            const headerConfig = {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            };

            const response = await axios.post('https://kakaoapi.aligo.in/akv10/alimtalk/send/', querystring.stringify({
                "apikey": apiKey,
                "userid": userId,
                "senderkey": senderKey,
                "tpl_code": tplCode,
                "sender": sender,
                "receiver_1": receiverPhone,
                "subject_1": "",
                "message_1": message,
                "testMode": testMode
            }), headerConfig);

            const result_code = response.data.code;
            if(result_code == 0) { //정상 전송 요청 완료.(API 수신 유무)
			    return true;
            }
            return false;
		} catch (error) {
			console.error('Error : ', error);
			return false;
		}
	}
}