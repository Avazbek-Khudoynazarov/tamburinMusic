import express, { NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import manageAttachmentRouter from '../routes/manage/manage-attachment-router';
import manageBannerRouter from '../routes/manage/manage-banner-router';
import manageBoardRouter from '../routes/manage/manage-board-router';
import manageBoardReplyRouter from '../routes/manage/manage-boardReply-router';
import manageClassesRouter from '../routes/manage/manage-classes-router';
import manageClassesBoardRouter from '../routes/manage/manage-classesBoard-router';
import manageClassesBoardReplyRouter from '../routes/manage/manage-classesBoardReply-router';
import manageCurriculumRouter from '../routes/manage/manage-curriculum-router';
import manageInstrumentRouter from '../routes/manage/manage-instrument-router';
import manageLiveChatRouter from '../routes/manage/manage-liveChat-router';
import manageMemberRouter from '../routes/manage/manage-member-router';
import manageMetaRouter from '../routes/manage/manage-meta-router';
import managePaymentsRouter from '../routes/manage/manage-payments-router';
import managePeriodicPaymentsRouter from '../routes/manage/manage-periodicPayments-router';
import managePopupRouter from '../routes/manage/manage-popup-router';

import AttachmentRouter from '../routes/frontend/attachment-router';
import BannerRouter from '../routes/frontend/banner-router';
import BoardRouter from '../routes/frontend/board-router';
import BoardReplyRouter from '../routes/frontend/boardReply-router';
import ClassesRouter from '../routes/frontend/classes-router';
import ClassesBoardRouter from '../routes/frontend/classesBoard-router';
import ClassesBoardReplyRouter from '../routes/frontend/classesBoardReply-router';
import CurriculumRouter from '../routes/frontend/curriculum-router';
import InstrumentRouter from '../routes/frontend/instrument-router';
import LiveChatRouter from '../routes/frontend/liveChat-router';
import MemberRouter from '../routes/frontend/member-router';
import MetaRouter from '../routes/frontend/meta-router';
import PaymentsRouter from '../routes/frontend/payments-router';
import PeriodicPaymentsRouter from '../routes/frontend/periodicPayments-router';
import PopupRouter from '../routes/frontend/popup-router';

import webhookRouter from '../routes/webhook-router';
import adminRouter from '../routes/admin-router';
import memberRouter from '../routes/member-router';
import uploadRouter from '../routes/upload-router';
import sseRouter from '../routes/sse-router';
import messageRouter from '../routes/message-router';
import config from '../config';
import Logger from '../loaders/logger';

export default ({ app }: { app: express.Application }) => {
  /**
   * Health Check endpoints
   * @TODO Explain why they are here
   */

   const formatMaker = function (tokens: any, req: any, res: any) {
    return [
      "[REQ]",
      "[" + config.serverNumber + "]",
      "[" + tokens['response-time'](req, res), 'ms]',
      //tokens.res(req, res, 'content-length'), '-',
      tokens['remote-addr'](req, res),
      "[" + tokens['user-agent'](req, res) + "]",
      "[" + req.headers['authorization'] + "]",
      "[" + tokens.method(req, res) + "]",
      "[" + tokens.url(req, res) + "]",
      "[" + tokens.status(req, res) + "]",
      "[" + JSON.stringify(req.body) + "]"
    ].join(' ')
  };

  //morgan http request log.
  const httpLogStream = {
    write: (message: string) => { Logger.http(message); }
  };
  //app.use(morgan('combined', {stream: httpLogStream}));
  //app.use(morgan('combined', {stream: httpLogStream, immediate: true}));
  app.use(morgan(formatMaker, 
    {
      skip: function (request, response) { 
        /*
        if(request.path == "/test") {
          return true;
        }
        */
        //return response.statusCode < 400;
        return false;
      },
      stream: httpLogStream
    }
  ));

  app.get('/status', (req, res) => {
    res.status(200).end();
  });
  app.head('/status', (req, res) => {
    res.status(200).end();
  });

  // Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  // It shows the real origin IP in the heroku or Cloudwatch logs
  //app.enable('trust proxy');

  app.use('/uploads', express.static('uploads'));
  app.use(express.json({ limit: '20mb' })); 
  app.use(express.urlencoded({ limit: '20mb', extended: true }));
  app.use(cors()); //cors를 allow한다.

  //-----------------ROUTES---------------------------
  app.use("/webhook", webhookRouter);
  app.use("/admin", adminRouter);
  app.use("/member", memberRouter);
	app.use("/upload", uploadRouter);
  app.use("/sse", sseRouter);
  app.use("/message", messageRouter);

  app.use("/manage/attachment", manageAttachmentRouter);
  app.use("/manage/banner", manageBannerRouter);
  app.use("/manage/board", manageBoardRouter);
  app.use("/manage/boardreply", manageBoardReplyRouter);
  app.use("/manage/classes", manageClassesRouter);
  app.use("/manage/classesboard", manageClassesBoardRouter);
  app.use("/manage/classesboardreply", manageClassesBoardReplyRouter);
  app.use("/manage/curriculum", manageCurriculumRouter);
  app.use("/manage/instrument", manageInstrumentRouter);
  app.use("/manage/livechat", manageLiveChatRouter);
  app.use("/manage/member", manageMemberRouter);
  app.use("/manage/meta", manageMetaRouter);
  app.use("/manage/payments", managePaymentsRouter);
  app.use("/manage/periodicpayments", managePeriodicPaymentsRouter);
  app.use("/manage/popup", managePopupRouter);

  app.use("/frontend/attachment", AttachmentRouter);
  app.use("/frontend/banner", BannerRouter);
  app.use("/frontend/board", BoardRouter);
  app.use("/frontend/boardreply", BoardReplyRouter);
  app.use("/frontend/classes", ClassesRouter);
  app.use("/frontend/classesboard", ClassesBoardRouter);
  app.use("/frontend/classesboardreply", ClassesBoardReplyRouter);
  app.use("/frontend/curriculum", CurriculumRouter);
  app.use("/frontend/instrument", InstrumentRouter);
  app.use("/frontend/livechat", LiveChatRouter);
  app.use("/frontend/member", MemberRouter);
  app.use("/frontend/meta", MetaRouter);
  app.use("/frontend/payments", PaymentsRouter);
  app.use("/frontend/periodicpayments", PeriodicPaymentsRouter);
  app.use("/frontend/popup", PopupRouter);
  //--------------------------------------------------

  /// catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err: any = new Error('Not Found');
    err['status'] = 404;
    next(err);
  });

  /// error handlers
  app.use((err: any, req: any, res: any, next: NextFunction) => {
    /**
     * Handle 401 thrown by express-jwt library
     */
    if (err.name === 'UnauthorizedError') {
      return res
        .status(err.status)
        .send({ message: err.message })
        .end();
    }
    return next(err);
  });

  app.use((err: any, req: any, res: any, next: NextFunction) => {
    res.error = (statusCode: number, errorMessage: string) => res.status(statusCode).json(errorMessage);

    res.status(err.status || 500);
    res.json({
      errors: {
        message: err.message,
      },
    });
  });
};
