import { Router, Request, Response } from 'express';
import { verifyToken } from '../../authorization';
import { AttachmentService } from '../../services/attachment-service';
import { Attachment } from '../../model/attachment';

const router = Router();


router.use('/list', verifyToken);

// 전체 목록
router.get('/list/all', async (request: Request, response: Response) => {
	const attachmentService = new AttachmentService();

	try {
		const entity_type: string = request.query.entity_type as string;
		const entity_id: number = parseInt(request.query.entity_id as string);
		
		let attachmentList;
		if (entity_type && entity_id) {
      attachmentList = await attachmentService.findByEntity(entity_type, Number(entity_id));
    } else {
      attachmentList = await attachmentService.findAll();
    }

		response.status(200).send(attachmentList);
	} catch (err) {
		response.status(400).send('manage attachment list error');
	}
});

// 페이지네이션 목록
router.get('/list', async (request: Request, response: Response) => {
	const attachmentService = new AttachmentService();

	try {
		const page: number = parseInt(request.query.page as string);
		const attachmentList: Attachment[] = await attachmentService.findWithPagination('', page, 20);
		response.status(200).send(attachmentList);
	} catch (err) {
		response.status(400).send('manage attachment list error');
	}
});


router.use('/get', verifyToken);
router.get('/get', async (request: Request, response: Response) => {
	const attachmentService = new AttachmentService();

	try {
		const id: number = parseInt(request.query.id as string);
		const attachment: Attachment | undefined = await attachmentService.findById(id);
		response.status(200).send(attachment);
	} catch (err) {
		response.status(400).send('manage attachment list error');
	}
});

router.use('/create', verifyToken);
router.post('/create', async (request: Request, response: Response) => {
	const attachmentService = new AttachmentService();

	try {
		const type: string = response.locals['type'];
		if (type !== 'admin') {
			response.status(400).send('not authorization');
			return;
		}

		const attachment: Attachment = request.body.attachment;
		let result = await attachmentService.create(attachment);
		if (!result) {
			response.status(400).send('manage create attachment data error');
			return;
		}

		response.status(200).json('success');
	} catch (err) {
		response.status(400).send('manage attachment update error');
	}
});

router.use('/update', verifyToken);
router.put('/update', async (request: Request, response: Response) => {
	const attachmentService = new AttachmentService();

	try {
		const type: string = response.locals['type'];
		if (type !== 'admin') {
			response.status(400).send('not authorization');
			return;
		}

		const attachment: Attachment = request.body.attachment;
		let result = await attachmentService.update(attachment.id!, attachment);
		if (!result) {
			response.status(400).send('manage not exist attachment data');
			return;
		}

		response.status(200).json('success');
	} catch (err) {
		response.status(400).send('manage attachment update error');
	}
});

router.use('/delete', verifyToken);
router.delete('/delete', async (request: Request, response: Response) => {
	const attachmentService = new AttachmentService();

	try {
		const type: string = response.locals['type'];
		if (type !== 'admin') {
			response.status(400).send('not authorization');
			return;
		}

		const deleteId: number = parseInt(request.query.id as string);
		let result = await attachmentService.delete(deleteId);
		if (!result) {
			response.status(400).send('manage not exist attachment data');
			return;
		}

		response.status(200).json('success');
	} catch (err) {
		response.status(400).send('manage attachment delete error');
	}
});

export default router;