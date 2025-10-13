import { Router, Request, Response } from 'express';
import { verifyToken } from '../../authorization';
import { BannerService } from '../../services/banner-service';
import { Banner } from '../../model/banner';

const router = Router();



router.use('/deleteByEntityType', verifyToken);
router.delete('/deleteByEntityType', async (request: Request, response: Response) => {
	const bannerService = new BannerService();

	try {
		const type: string = response.locals['type'];
		if (type !== 'admin') {
			response.status(400).send('not authorization');
			return;
		}

		const entity_type: string = request.query.entity_type as string;
		let result = await bannerService.deleteByEntityType(entity_type);
		if (!result) {
			response.status(400).send('manage not exist banner data');
			return;
		}

		response.status(200).json('success');
	} catch (err) {
		response.status(400).send('manage banner delete error');
	}
});




router.use('/createRows', verifyToken);
router.post('/createRows', async (request: Request, response: Response) => {
	const bannerService = new BannerService();

	try {
		const type: string = response.locals['type'];
		if (type !== 'admin') {
			response.status(400).send('not authorization');
			return;
		}
		const banner: Banner[] = request.body.banner; // 배열로 받아옴
		const result = await bannerService.createRow(banner);
		if (!result) {
			response.status(400).send('manage create banner data error');
			return;
		}

		response.status(200).json('success');
	} catch (err) {
		console.error(err);
		response.status(400).send('manage banner create error');
	}
});


router.use('/updateRows', verifyToken);
router.put('/updateRows', async (request: Request, response: Response) => {
	const bannerService = new BannerService();

	try {
		const type: string = response.locals['type'];
		if (type !== 'admin') {
			response.status(400).send('not authorization');
			return;
		}

		const banner: Banner[] = request.body.banner; // 배열로 받아옴
		const result = await bannerService.updateRow(banner);
		if (!result) {
			response.status(400).send('manage update banner data error');
			return;
		}

		response.status(200).json('success');
	} catch (err) {
		console.error(err);
		response.status(400).send('manage banner update error');
	}
});



router.use('/list', verifyToken);

// 전체 목록
router.get('/list/all', async (request: Request, response: Response) => {
	const bannerService = new BannerService();

	try {
		const entity_type: string = request.query.entity_type as string;
		let bannerList;

		if(entity_type) {
			bannerList = await bannerService.findByEntityType(entity_type);
		}
		
		else {
			bannerList = await bannerService.findAll();
		}

		response.status(200).send(bannerList);
	} catch (err) {
		response.status(400).send('manage banner list error');
	}
});

// 페이지네이션 목록
router.get('/list', async (request: Request, response: Response) => {
	const bannerService = new BannerService();

	try {
		const page: number = parseInt(request.query.page as string);
		const bannerList: Banner[] = await bannerService.findWithPagination('', page, 20);
		response.status(200).send(bannerList);
	} catch (err) {
		response.status(400).send('manage banner list error');
	}
});


router.use('/get', verifyToken);
router.get('/get', async (request: Request, response: Response) => {
	const bannerService = new BannerService();

	try {
		const id: number = parseInt(request.query.id as string);
		const banner: Banner | undefined = await bannerService.findById(id);
		response.status(200).send(banner);
	} catch (err) {
		response.status(400).send('manage banner list error');
	}
});

router.use('/create', verifyToken);
router.post('/create', async (request: Request, response: Response) => {
	const bannerService = new BannerService();

	try {
		const type: string = response.locals['type'];
		if (type !== 'admin') {
			response.status(400).send('not authorization');
			return;
		}

		const banner: Banner = request.body.banner;
		let result = await bannerService.create(banner);
		if (!result) {
			response.status(400).send('manage create banner data error');
			return;
		}

		response.status(200).json('success');
	} catch (err) {
		response.status(400).send('manage banner update error');
	}
});

router.use('/update', verifyToken);
router.put('/update', async (request: Request, response: Response) => {
	const bannerService = new BannerService();

	try {
		const type: string = response.locals['type'];
		if (type !== 'admin') {
			response.status(400).send('not authorization');
			return;
		}

		const banner: Banner = request.body.banner;
		let result = await bannerService.update(banner.id!, banner);
		if (!result) {
			response.status(400).send('manage not exist banner data');
			return;
		}

		response.status(200).json('success');
	} catch (err) {
		response.status(400).send('manage banner update error');
	}
});

router.use('/delete', verifyToken);
router.delete('/delete', async (request: Request, response: Response) => {
	const bannerService = new BannerService();

	try {
		const type: string = response.locals['type'];
		if (type !== 'admin') {
			response.status(400).send('not authorization');
			return;
		}

		const deleteId: number = parseInt(request.query.id as string);
		let result = await bannerService.delete(deleteId);
		if (!result) {
			response.status(400).send('manage not exist banner data');
			return;
		}

		response.status(200).json('success');
	} catch (err) {
		response.status(400).send('manage banner delete error');
	}
});

export default router;