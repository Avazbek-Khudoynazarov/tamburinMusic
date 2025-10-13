import { Router, Request, Response } from 'express';
import { checkToken } from '../authorization';
import { Member } from '../model/member';
import { LiveChat } from '../model/liveChat';
import { MemberService } from '../services/member-service';
import { LiveChatService } from '../services/liveChat-service';

const router = Router();

router.get('/', async (request: Request, response: Response) => {
    response.setHeader("Content-Type", "text/event-stream");
    response.setHeader("Cache-Control", "no-cache");
    response.setHeader("Connection", "keep-alive");
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "GET");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");

    let updatedTime = new Date();

    const jwtToken: string = request.query.token as string;
    const userId: number = checkToken(jwtToken);
                
    const interval = setInterval(async () => {
        try{
            const memberService = new MemberService();
            const liveChatService = new LiveChatService();
    
            const member: Member | undefined = await memberService.findUserById(userId);
            let liveChatList: LiveChat[] = [];
            if(member) {
                if(member.type == 10) { //학생.
                    liveChatList = await liveChatService.findNewMessageByUserId('member', member.id!, updatedTime);
                } else { //강사.
                    liveChatList = await liveChatService.findNewMessageByUserId('teacher', member.id!, updatedTime);
                }
                response.write("data: " + JSON.stringify({
                    'liveChatList': liveChatList,
                }) + "\n\n");
    
                updatedTime = new Date(); //현재 시간으로 업데이트.
            }
        }catch(err) {
            console.log(err);
        }
    }, 1100);
  
    request.on("close", () => {
      clearInterval(interval);
    });
});

export default router;