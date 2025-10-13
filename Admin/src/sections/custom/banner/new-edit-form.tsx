import { useEffect, useState } from 'react';
import { useRouter } from 'src/routes/hooks';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';
import { Iconify } from 'src/components/iconify';
import { paths } from 'src/routes/paths';
import BannerService from 'src/services/BannerService';
import { CONFIG } from 'src/config-global';
import { toast } from 'src/components/snackbar';
import { IBannerItem } from 'src/types/user';

export function NewEditForm() {
	const router = useRouter();

	const [bannerList, setBannerList] = useState<IBannerItem[]>([]);

	// 파일 상태 관리: 각 배너별로 파일을 관리
	const [selectedFiles, setSelectedFiles] = useState<{ [key: number]: File | string | null }>({});
	const [selectedFileNames, setSelectedFileNames] = useState<{ [key: number]: string }>({});

	// 초기 데이터 로드
	useEffect(() => {
		const loadData = async () => {
			const data: IBannerItem[] = await BannerService.getByEntityType('banner1');
			setBannerList(data);

			// 서버에서 가져온 이미지를 미리보기 위해 파일 상태에 설정
			const files: { [key: number]: string | null } = {};
			const fileNames: { [key: number]: string } = {};

			data.forEach((banner) => {
				if (banner.image_file) {
					// 이미지 URL을 selectedFiles에 직접 할당
					files[banner.id!] = banner.image_file;
					fileNames[banner.id!] = banner.image_file; // 파일 이름
				}
			});

			setSelectedFiles(files);
			setSelectedFileNames(fileNames);
		};

		loadData();
	}, []);

	const handleFileChange = async (fileIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];

		if (file) {
			const MAX_SIZE = 5 * 1024 * 1024;

			if (file.size > MAX_SIZE) {
				alert('파일 크기는 5MB 이하여야 합니다.');
				return;
			}

			// 새로 선택한 파일을 상태에 반영
			setSelectedFiles((prev) => ({ ...prev, [fileIndex]: file }));
			setSelectedFileNames((prev) => ({ ...prev, [fileIndex]: file.name }));
		}
	};

	// 배너 추가
	const addBanner = () => {
		const maxId = bannerList.reduce((max, banner) => Math.max(max, banner.id || 0), 0);

		setBannerList([
			...bannerList,
			{
				id: maxId + 1,
				entity_type: 'banner1',
				image_file: '',
				link_url: '',
				additional_text: JSON.stringify({
					text1: '',
					text2: '',
					text3: '',
					text4: '',
					text5: ''
				}),
			}
		]);
	};

	// 등록 완료 시 배너 목록 생성 및 업로드
	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const newBanners: IBannerItem[] = [];

			// 비동기 작업을 병렬로 처리할 수 있도록 Promise.all 사용
			const uploadPromises = bannerList.map(async (row) => {
				if (row.id) { // row.id가 undefined가 아니어야만 실행되도록 조건 추가
					const formData = new FormData();

					const { id, ...rowWithoutId } = row;


					// 배너마다 개별 파일을 사용
					if (selectedFiles[row.id] && selectedFiles[row.id] instanceof File) {
						formData.append('file', selectedFiles[row.id] as File);

						// 각 이미지 업로드 후 URL 저장
						const result = await BannerService.addAttachment(formData);
						const imageUrl = `${CONFIG.serverUrl}/${result.path.replace(/\\/g, '/')}`;

						const updatedRow: IBannerItem = {
							...rowWithoutId,
							created_date: new Date(),
							image_file: imageUrl,
						};

						newBanners.push(updatedRow);
					} else if (selectedFiles[row.id] && typeof selectedFiles[row.id] === 'string') {
						// 기존에 선택된 이미지는 서버 URL로 저장
						const updatedRow: IBannerItem = {
							...rowWithoutId,
							created_date: new Date(),
							image_file: selectedFiles[row.id] as string,
						};
						newBanners.push(updatedRow);
					} else {
						const updatedRow: IBannerItem = {
							...rowWithoutId,
							created_date: new Date(),
							image_file: '',
						};
						newBanners.push(updatedRow);
					}
				}
			});

			// 모든 업로드가 끝날 때까지 대기
			await Promise.all(uploadPromises);

			// 배너 목록 백엔드로 전송
			await BannerService.deleteByEntityType('banner1');
			const result = await BannerService.createRows(newBanners);

			if (result) {
				toast.success('배너 등록 완료');
				// router.push(paths.banner);
			} else {
				toast.error('배너 등록에 실패했습니다.');
			}
		} catch (error) {
			console.error('오류 발생:', error);
			toast.error('오류가 발생했습니다. 다시 시도해주세요.');
		}
	};

	return (
		<form onSubmit={onSubmit}>
			<Stack spacing={{ xs: 3, md: 3 }} sx={{ mt: 3, mx: 'auto', maxWidth: { xs: 720, xl: 1200 } }}>
				{bannerList.map((banner, index) => {
					const cleanedText = banner.additional_text.replace(/[\n\r]/g, "\\n");
					let additionalText;
					try {
						additionalText = JSON.parse(cleanedText);
					} catch (e) {
						console.error("JSON 파싱 실패:", e);
						additionalText = {}; // 또는 기본값 할당
					}

					return (
						<Card key={banner.id}>
							<CardHeader title={`배너 ${index + 1}`} />
							<Divider />
							<Stack spacing={3} sx={{ p: 3 }}>
								<Box rowGap={3} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}>
									<TextField
										label="악기명"
										name="text1"
										value={additionalText.text1}
										onChange={(e) => {
											additionalText.text1 = e.target.value;
											banner.additional_text = JSON.stringify(additionalText);
											setBannerList([...bannerList]);
										}}
										fullWidth
									/>
									<TextField
										label="강사명"
										name="text2"
										value={additionalText.text2}
										onChange={(e) => {
											additionalText.text2 = e.target.value;
											banner.additional_text = JSON.stringify(additionalText);
											setBannerList([...bannerList]);
										}}
										fullWidth
									/>
									<TextField
										label="소개글1"
										name="text3"
										multiline
										rows={5}
										value={additionalText.text3}
										onChange={(e) => {
											additionalText.text3 = e.target.value;
											banner.additional_text = JSON.stringify(additionalText);
											setBannerList([...bannerList]);
										}}
										fullWidth
									/>
									<TextField
										label="소개글2"
										name="text4"
										multiline
										rows={5}
										value={additionalText.text4}
										onChange={(e) => {
											additionalText.text4 = e.target.value;
											banner.additional_text = JSON.stringify(additionalText);
											setBannerList([...bannerList]);
										}}
										fullWidth
									/>
									<TextField
										label="링크"
										name="text5"
										value={additionalText.text5}
										onChange={(e) => {
											additionalText.text5 = e.target.value;
											banner.additional_text = JSON.stringify(additionalText);
											setBannerList([...bannerList]);
										}}
										fullWidth
									/>

									<Box sx={{ pl: '14px' }}>
										<Typography variant="subtitle2">이미지 선택</Typography>
										<Box>
											<input
												type="file"
												id={`file${index}`}
												style={{ display: 'none' }}
												onChange={(e) => handleFileChange(banner.id!, e)}
											/>
											{selectedFiles[banner.id!] && typeof selectedFiles[banner.id!] === 'string' ? (
												<Box sx={{ mb: 2 }}>
													<img
														src={selectedFiles[banner.id!] as string}
														alt="이미지"
														style={{ maxWidth: '200px', maxHeight: '200px' }}
													/>
												</Box>
											) : selectedFiles[banner.id!] instanceof File ? (
												<Box sx={{ mb: 2 }}>
													<img
														src={URL.createObjectURL(selectedFiles[banner.id!] as File)}
														alt="이미지"
														style={{ maxWidth: '200px', maxHeight: '200px' }}
													/>
												</Box>
											) : null}

											<Stack spacing={2} direction="row" alignItems="center">
												<Button variant="contained" component="label" htmlFor={`file${index}`}>
													파일 선택
												</Button>
												<Typography sx={{ flex: 1 }}>{selectedFileNames[banner.id!] || '선택된 파일 없음'}</Typography>
												{selectedFiles[banner.id!] && (
													<IconButton
														onClick={() => {
															const fileInput = document.getElementById(`file${index}`) as HTMLInputElement;
															if (fileInput) fileInput.value = '';

															setSelectedFiles((prev) => ({ ...prev, [banner.id!]: null }));
															setSelectedFileNames((prev) => ({ ...prev, [banner.id!]: '선택된 파일 없음' }));
														}}
													>
														<Iconify icon="mdi:delete" />
													</IconButton>
												)}
											</Stack>
										</Box>
									</Box>
								</Box>
							</Stack>
						</Card>
					);
				})}
				

				<Stack direction="row" spacing={2} alignItems="center" justifyContent="flex-end" sx={{ mt: 3 }}>
					<Button
						size="large"
						variant="contained"
						onClick={addBanner}
						sx={{
							backgroundColor: '#808080',  // 짙은 회색
							'&:hover': { backgroundColor: '#666666' }, // 더 짙은 회색
						}}
					>
						배너 추가
					</Button>
					<LoadingButton type="submit" variant="contained" size="large">
						등록 완료
					</LoadingButton>
				</Stack>
			</Stack>
		</form>
	);
}
