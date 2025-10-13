import { Router, Request, Response } from 'express';
import { verifyToken } from '../../authorization';
import { ClassesService } from '../../services/classes-service';
import { Classes } from '../../model/classes';

const router = Router();


router.use('/deleteByPaymentsId', verifyToken);
router.delete('/deleteByPaymentsId', async (request: Request, response: Response) => {
	const classesService = new ClassesService();

	try {
		const type: string = response.locals['type'];
		if (type !== 'admin') {
			response.status(400).send('not authorization');
			return;
		}

		const payments_id: number = parseInt(request.query.payments_id as string);
		let result = await classesService.deleteByPaymentsId(payments_id);
		if (!result) {
			response.status(400).send('manage not exist classes data');
			return;
		}

		response.status(200).json('success');
	} catch (err) {
		response.status(400).send('manage classes delete error');
	}
});


router.use('/createRows', verifyToken);
router.post('/createRows', async (request: Request, response: Response) => {
  const classesService = new ClassesService();

  try {
    const type: string = response.locals['type'];
    if (type !== 'admin') {
      response.status(400).send('not authorization');
      return;
    }
    const classes: Classes[] = request.body.classes; // 배열로 받아옴
    const result = await classesService.createRow(classes);
    if (!result) {
      response.status(400).send('manage create classes data error');
      return;
    }

    response.status(200).json('success');
  } catch (err) {
    console.error(err);
    response.status(400).send('manage classes create error');
  }
});


router.use('/updateRows', verifyToken);
router.put('/updateRows', async (request: Request, response: Response) => {
  const classesService = new ClassesService();

  try {
    const type: string = response.locals['type'];
    if (type !== 'admin') {
      response.status(400).send('not authorization');
      return;
    }

    const classes: Classes[] = request.body.classes; // 배열로 받아옴
    const result = await classesService.updateRow(classes);
    if (!result) {
      response.status(400).send('manage update classes data error');
      return;
    }

    response.status(200).json('success');
  } catch (err) {
    console.error(err);
    response.status(400).send('manage classes update error');
  }
});



router.use('/count', verifyToken);
router.get('/count', async (request: Request, response: Response) => {
	const classesService = new ClassesService();

	try {
		const member_id: number = parseInt(request.query.member_id as string);
		const type: string = request.query.type as string;
		let classesList = await classesService.findCountClassesByTeacher(member_id, type);
		const count = classesList[0].completed_class_count;

		response.status(200).send({ completed_class_count: Number(count) });

	} catch (err) {
		response.status(400).send('manage classes list error');
	}
});

router.use('/list', verifyToken);

// 전체 목록
router.get('/list/all', async (request: Request, response: Response) => {
	const classesService = new ClassesService();

	try {
		const payments_id: number = parseInt(request.query.payments_id as string);
		let classesList;


		if(payments_id) {
			classesList = await classesService.findByPaymentsId(payments_id);
		}
		
		else {
			classesList = await classesService.findAll();
		}
		

		response.status(200).send(classesList);
	} catch (err) {
		response.status(400).send('manage classes list error');
	}
});

// 페이지네이션 목록
router.get('/list', async (request: Request, response: Response) => {
	const classesService = new ClassesService();

	try {
		const page: number = parseInt(request.query.page as string);
		const classesList: Classes[] = await classesService.findWithPagination('', page, 20);
		response.status(200).send(classesList);
	} catch (err) {
		response.status(400).send('manage classes list error');
	}
});


router.use('/get', verifyToken);
router.get('/get', async (request: Request, response: Response) => {
	const classesService = new ClassesService();

	try {
		const id: number = parseInt(request.query.id as string);
		const classes: Classes | undefined = await classesService.findById(id);
		response.status(200).send(classes);
	} catch (err) {
		response.status(400).send('manage classes list error');
	}
});

router.use('/create', verifyToken);
router.post('/create', async (request: Request, response: Response) => {
	const classesService = new ClassesService();

	try {
		const type: string = response.locals['type'];
		if (type !== 'admin') {
			response.status(400).send('not authorization');
			return;
		}

		const classes: Classes = request.body.classes;
		let result = await classesService.create(classes);
		if (!result) {
			response.status(400).send('manage create classes data error');
			return;
		}

		response.status(200).json('success');
	} catch (err) {
		response.status(400).send('manage classes update error');
	}
});


router.use('/update', verifyToken);
router.put('/update', async (request: Request, response: Response) => {
	const classesService = new ClassesService();

	try {
		const type: string = response.locals['type'];
		if (type !== 'admin') {
			response.status(400).send('not authorization');
			return;
		}

		const classes: Classes = request.body.classes;
		let result = await classesService.update(classes.id!, classes);
		if (!result) {
			response.status(400).send('manage not exist classes data');
			return;
		}

		response.status(200).json('success');
	} catch (err) {
		response.status(400).send('manage classes update error');
	}
});

router.use('/delete', verifyToken);
router.delete('/delete', async (request: Request, response: Response) => {
	const classesService = new ClassesService();

	try {
		const type: string = response.locals['type'];
		if (type !== 'admin') {
			response.status(400).send('not authorization');
			return;
		}

		const deleteId: number = parseInt(request.query.id as string);
		let result = await classesService.delete(deleteId);
		if (!result) {
			response.status(400).send('manage not exist classes data');
			return;
		}

		response.status(200).json('success');
	} catch (err) {
		response.status(400).send('manage classes delete error');
	}
});

export default router;