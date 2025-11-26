import { Router, Request, Response } from 'express';
import { verifyToken } from '../authorization';
import { S3StorageService } from '../services/s3-service';
import multerS3 from 'multer-s3';
import multer from 'multer';
import dayjs from 'dayjs';
import fs from 'fs';

const router = Router();

// AWS S3 Storage Service
const storageService = new S3StorageService();

// S3 File Upload Configuration
const upload_s3 = multer({
    storage: multerS3({
        s3: storageService.GetS3Client(),
        bucket: storageService.getBucketName(),
        key: function (req: Request, file, cb) {
            let folder: string = req.path.substring(1).split('/')[1];
            var destFile = folder + '/' + folder + '_[' + dayjs().format('YYYY-MM-DD') + ']_' + dayjs().format('HH_mm_ss') + '_' + file.originalname;
            cb(null, destFile);
        },
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
    }),
    limits: {
        files: 15,
        fileSize: 1024 * 1024 * 20, //20MB
    }
});

// S3 파일 업로드
router.use('/data/:folder', verifyToken);
router.post('/data/:folder', upload_s3.single('file'), async (request: Request, response: Response) => {
    // #swagger.tags = ['upload']
    try {
        if (!request.file) {
            return response.status(400).send('파일이 업로드되지 않았습니다.');
        }

        // S3에 업로드된 파일 정보
        const s3File = request.file as any;
        const fileUrl = s3File.location; // S3 파일 URL
        const fileKey = s3File.key; // S3 파일 키

        if (!fileUrl || !fileKey) {
            throw new Error('파일 정보가 올바르지 않습니다.');
        }

        response.status(200).send({
            filename: fileKey,
            url: fileUrl,
            path: fileUrl
        });
    } catch (error) {
        console.error('파일 업로드 에러:', error);
        response.status(500).send('파일 업로드 중 오류가 발생했습니다.');
    }
});


// ==================== LOCAL STORAGE (DISABLED) ====================
// Uncomment below to switch back to local file storage
// const upload_local = multer({
//     storage: multer.diskStorage({
//         destination: function (req, file, cb) {
// 						let folder: string = req.path.substring(1).split('/')[1];
// 						const uploadPath = `uploads/${folder}/`;
//
//             // 폴더가 없으면 생성
//             if (!fs.existsSync(uploadPath)) {
//                 fs.mkdirSync(uploadPath, { recursive: true }); // 재귀적으로 경로 생성
//             }
//
//             cb(null, uploadPath);
//         },
//         filename: function (req, file, cb) {
//             let folder: string = req.path.substring(1).split('/')[1];
//             cb(null, folder + '_[' + dayjs().format('YYYY-MM-DD') + ']_' + dayjs().format('HH_mm_ss') + '_' + file.originalname);
//         }
//     }),
//     limits: {
//         files: 15,
//         fileSize: 1024 * 1024 * 20, //20MB
//     }
// });
//
// //로컬 파일 업로드
// router.use('/data/:folder', verifyToken);
// router.post('/data/:folder', upload_local.single('file'), async (request: Request, response: Response) => {
//     // #swagger.tags = ['upload']
//     try {
//         if (!request.file) {
//             return response.status(400).send('파일이 업로드되지 않았습니다.');
//         }
//
//         // request.file이 undefined가 아닌 것을 확인한 후에 접근
//         const filePath = request.file.path;
//         const fileName = request.file.filename;
//
//         if (!filePath || !fileName) {
//             throw new Error('파일 정보가 올바르지 않습니다.');
//         }
//
//         response.status(200).send({
//             filename: fileName,
//             path: filePath
//         });
//     } catch (error) {
//         console.error('파일 업로드 에러:', error);
//         response.status(500).send('파일 업로드 중 오류가 발생했습니다.');
//     }
// });
// ==================== END LOCAL STORAGE ====================

// const s3upload_images = multer({ 
//     storage: multerS3({
//         s3: storageService.GetS3Client(),
//         bucket: 'tamburin-store', //버킷 이름.
//         key: function(req: Request, file, cb){
//             let folder: string = req.path.substring(1).split('/')[1]; //맨 앞의 '/' 제거.(ex: /images/user => images/user)
//             var destFile = 'images/' + folder + '/[' + dayjs().format('YYYY-MM-DD') + ']' + '/' + dayjs().format('HH_mm_ss') + '_' + file.originalname;
//             cb(null, destFile );
//         },
//         acl: 'public-read', //객체 읽기 권한.
//     }), 
//     limits: {
//         files: 15,
//         fileSize: 1024 * 1024 * 20, //20MB.
//     }
// });

// //파일 업로드.
// router.use('/image/:folder', verifyToken);
// router.post('/image/:folder', s3upload_images.single('file'), async (request: Request, response: Response) => {
//     // #swagger.tags = ['upload']
//     response.send((request.file as any).key);
// });

// //파일 삭제.
// router.use('/image', verifyToken);
// router.delete('/image', async (request: Request, response: Response) => {
//     // #swagger.tags = ['upload']
//     let file: string = request.query.filename as string; //맨 앞의 '/' 제거.(ex: /images/user => images/user)

//     if(file == '') {
//         response.status(200).send('success');
//         return;
//     }
    
//     const result = await storageService.deleteObject(file);
//     if(result) {
//         response.status(200).send('success');
//     }else{
//         response.status(400).send('image delete failed');
//     }
// });

// //폴더 삭제.
// router.use('/folder', verifyToken);
// router.delete('/folder', async (request: Request, response: Response) => {
//     // #swagger.tags = ['upload']
//     let folder: string = request.query.folder as string; //맨 앞의 '/' 제거.(ex: /images/user => images/user)
    
//     const result = await storageService.deleteContainer(folder, null);
//     if(result) {
//         response.status(200).send('success');
//     }else{
//         response.status(400).send('image folder delete failed');
//     }
// });

// //presigned url 요청.
// router.use('/pre/image', verifyToken);
// router.post('/pre/image', async (request: Request, response: Response) => {
//     // #swagger.tags = ['upload']
//     const url: string = await storageService.getSingedPutUrl(request.body.folder, request.body.fileName, 60 * 5); //5 minutes
//     response.send(url);
// });

// //presigned url 요청.(non-auth)
// //router.use('/pre/image_user', verifyToken);
// router.post('/pre/image_user', async (request: Request, response: Response) => {
//     // #swagger.tags = ['upload']
//     const url: string = await storageService.getSingedPutUrl("user", request.body.fileName, 60 * 1); //1 minutes
//     response.send(url);
// });

export default router;