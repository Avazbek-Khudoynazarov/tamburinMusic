import { Router, Request, Response } from 'express';
import { verifyToken } from '../../authorization';
import { MetaService } from '../../services/meta-service';
import { Meta } from '../../model/meta';

const router = Router();

//메타 목록.
// router.use('/list', verifyToken);
router.get('/list', async (request: Request, response: Response) => {
    const metaService = new MetaService();

    try{
        const type: string = request.query.type as string;
        const metaList: Meta[] = await metaService.findByType(type);
        response.status(200).send(metaList);
    }catch(err) {
        response.status(400).send('manage meta list error');
    }
});


// router.use('/updateRows', verifyToken);
router.put('/updateRows', async (request: Request, response: Response) => {
	const metaService = new MetaService();

	try {
		
		const meta: Meta[] = request.body.meta; // 배열로 받아옴
		const result = await metaService.updateRow(meta);
		if (!result) {
			response.status(400).send('manage update meta data error');
			return;
		}

		response.status(200).json('success');
	} catch (err) {
		console.error(err);
		response.status(400).send('manage meta update error');
	}
});



// router.use('/update', verifyToken);
router.put('/update', async (request: Request, response: Response) => {
	const metaService = new MetaService();

	try {
		
		const meta: Meta = request.body.meta;
		let result = await metaService.update(meta.id!, meta);
		if (!result) {
			response.status(400).send('manage not exist meta data');
			return;
		}

		response.status(200).json('success');
	} catch (err) {
		response.status(400).send('manage meta update error');
	}
});



export default router;