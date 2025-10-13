import dayjs from 'dayjs';

export class Global {
    private static instance: Global;

    static getInstance() {
        if(!Global.instance) {
            Global.instance = new Global();
        }
        return Global.instance;
    }

    getDateTime(dateTime: Date) {
        return dayjs(dateTime).format('YYYY-MM-DD HH:mm:ss');
    }
    
    getPhoneNormalizer(phone: string) {
        let result: string = phone;

        if(result == '') return result;
        
        if(result.indexOf(' ') >= 0) {
            result = phone.split(' ')[1];
        }
        result = result.replace(/-/gi, '');

        if(result.substr(0, 1) != '0') {
            result = '0' + result;
        }
        
        return result;
    }
}