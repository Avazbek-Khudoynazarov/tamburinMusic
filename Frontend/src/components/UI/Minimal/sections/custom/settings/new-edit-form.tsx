import { useCallback, useEffect, useState } from 'react';
import { useRouter } from '@/components/UI/Minimal/routes/hooks';
import { toast } from '@/components/UI/Minimal/components/snackbar';
import MetaService from '@/services/MetaService';
import { IMetaItem } from '@/components/UI/Minimal/types/user';
import { Iconify } from '@/components/UI/Minimal/components/iconify';

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

import * as CONFIG from '@/config';

export function NewEditForm() {
	const router = useRouter();

	// 상태 관리
	const [settingsBanner, setSettingsBanner] = useState<IMetaItem[]>([]);
	const [settingsExchange, setSettingsExchange] = useState<IMetaItem[]>([]);
	const [settingsVideo, setSettingsVideo] = useState<IMetaItem[]>([]);

	const [selectedFiles, setSelectedFiles] = useState<{ [key: number]: File | null }>({
		1: null, 2: null, 3: null,
	});
	const [selectedFileNames, setSelectedFileNames] = useState<{ [key: number]: string }>({
		1: '선택된 파일 없음',
		2: '선택된 파일 없음',
		3: '선택된 파일 없음',
	});

	const [exchangeText, setExchangeText] = useState<string>('');
	const [videoFile, setVideoFile] = useState<File | null>(null);
	const [videoFileName, setVideoFileName] = useState<string>('선택된 파일 없음');


	// 데이터를 로드
	const loadInitialData = useCallback(async () => {
		try {
			const [bannerData, exchangeData, videoData] = await Promise.all([
				MetaService.getList('settingsBanner'),
				MetaService.getList('settingsExchange'),
				MetaService.getList('settingsVideo'),
			]);

			setSettingsBanner(bannerData);
			setSettingsExchange(exchangeData);
			setSettingsVideo(videoData);

			// 로드된 데이터가 있을 경우
			if (bannerData) {
				const updatedFiles: { [key: number]: File | null } = {};  // key: number로 타입을 설정
				const updatedFileNames: { [key: number]: string } = {};  // 파일 이름을 위한 타입 설정

				bannerData.forEach((item: IMetaItem, index: number) => {
					updatedFiles[index + 1] = item.entity_value ? null : null;  // File 객체로 설정하거나 null
					updatedFileNames[index + 1] = item.entity_value || '선택된 파일 없음';  // item에 name이 없으면 '선택된 파일 없음'
				});

				setSelectedFiles(updatedFiles);
				setSelectedFileNames(updatedFileNames);
			}

			if (exchangeData.length > 0) {
				setExchangeText(exchangeData[0].entity_value || ''); // 값이 없으면 빈 문자열
			}

			if (videoData.length > 0) {
				const video = videoData[0];
				setVideoFile(video.entity_value || null);  // file 속성을 대신하는 entity_value 사용
				setVideoFileName(video.entity_value || '선택된 파일 없음');  // 파일이 없으면 기본값
			}
		} catch (error) {
			console.error('데이터 로드 실패:', error);
		}
	}, []);

	// 초기 데이터 로드
	useEffect(() => {
		loadInitialData();
	}, [loadInitialData]);

	// 파일 선택 처리
	const handleFileChange = (fileIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setSelectedFiles(prev => ({ ...prev, [fileIndex]: file }));
			setSelectedFileNames(prev => ({ ...prev, [fileIndex]: file.name }));
		}
	};

	const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setVideoFile(file);
			setVideoFileName(file.name);
		}
	};

	// 수정 버튼 클릭 시 저장 처리
	const handleSave = async () => {
		const updatedMeta: IMetaItem[] = [];

		// settingsBanner 업데이트
		const uploadResults: { [key: number]: string } = {};
		try {
			// 파일 업로드
			const uploadPromises = Object.entries(selectedFiles)
				.filter(([_, file]) => file instanceof File) // File 타입만 업로드
				.map(async ([key, file]) => {
					const formData = new FormData();
					formData.append('file', file as File);
					const result = await MetaService.addAttachment(formData); // MetaService의 파일 업로드 함수 호출
					if (result.filename) {
						uploadResults[Number(key)] = `${import.meta.env.VITE_SERVER_URL}/${result.path.replace(/\\/g, '/')}`;
					}
				});

			// 파일 업로드 완료 후, entity_value 업데이트
			await Promise.all(uploadPromises);

			settingsBanner.forEach((item, index) => {
				// 파일이 선택된 경우에만 업로드된 URL을 사용, 그렇지 않으면 기존 값 유지
				updatedMeta.push({
					...item,
					entity_value: uploadResults[index + 1] || item.entity_value,
				});
			});
		} catch (error) {
			console.error('파일 업로드 에러:', error);
			alert('파일 업로드에 실패했습니다.');
			return;
		}

		// settingsExchange 업데이트
		updatedMeta.push({
			...settingsExchange[0],
			entity_value: exchangeText,
		});

		// settingsVideo 업데이트 (비디오 파일 경로 반영)
		if (videoFile && videoFile instanceof File) {
			const formData = new FormData();
			formData.append('file', videoFile); // 새로 선택된 비디오 파일 업로드
			try {
				const result = await MetaService.addAttachment(formData); // MetaService의 파일 업로드 함수 호출
				if (result.filename) {
					updatedMeta.push({
						...settingsVideo[0],
						entity_value: `${import.meta.env.VITE_SERVER_URL}/${result.path.replace(/\\/g, '/')}`, // 업로드된 비디오 경로
					});
				}
			} catch (error) {
				console.error('비디오 파일 업로드 에러:', error);
				return;
			}
		} else {
			// 비디오 파일이 새로 선택되지 않은 경우, 기존의 video 엔티티 값을 그대로 유지
			updatedMeta.push({
				...settingsVideo[0],
				entity_value: settingsVideo[0].entity_value,
			});
		}

		// 서버에 데이터 저장
		try {
			const result = await MetaService.updateRows(updatedMeta);
			if (result) {
				toast.success('설정이 성공적으로 저장되었습니다.');
				router.push('/settings');
			} else {
				toast.error('저장에 실패했습니다.');
			}
		} catch (error) {
			toast.error('저장 중 오류가 발생했습니다.');
		}
	};


	const title = [
		'메인페이지 PC 이미지',
		'메인페이지 모바일 이미지',
		'회원가입 소개 이미지',
	]

	return (
		<form>
			<Stack spacing={3} sx={{ mt: 3, mx: 'auto', maxWidth: { xs: 720, xl: 1200 } }}>
				<Card>
					<CardHeader title="이미지 설정" />
					<Divider />
					<Stack spacing={3} sx={{ p: 3 }}>
						{settingsBanner.map((item, index) => (
							<Box key={index}>
								<Typography variant="subtitle2" sx={{ mb:2 }}>{title[index]}</Typography>
								<input
									type="file"
									id={`file${index + 1}`}
									style={{ display: 'none' }}
									onChange={(e) => handleFileChange(index + 1, e)}
								/>
								<Stack direction="row" spacing={2} alignItems="center" sx={{ mb:2 }}>
									<Button variant="contained" component="label" htmlFor={`file${index + 1}`}>
										파일 선택
									</Button>
									<IconButton
										onClick={() => {
											const input = document.getElementById(`file${index + 1}`) as HTMLInputElement;
											if (input) input.value = '';
											setSelectedFiles(prev => ({ ...prev, [index + 1]: null }));
											setSelectedFileNames(prev => ({ ...prev, [index + 1]: '선택된 파일 없음' }));
										}}
									>
										<Iconify icon="mdi:delete" />
									</IconButton>
								</Stack>
								{selectedFiles[index + 1] ? (
									<Box sx={{ mb: 2 }}>
										<img
											src={URL.createObjectURL(selectedFiles[index + 1]!)}
											alt={`배너 ${index + 1}`}
											style={{ maxWidth: '200px', maxHeight: '200px' }}
										/>
									</Box>
								) : (
									<img
										src={item.entity_value || selectedFileNames[index + 1]}
										alt={`배너 ${index + 1}`}
										style={{ maxWidth: '200px', maxHeight: '200px' }}
									/>
								)}
							</Box>
						))}
					</Stack>
				</Card>

				<Card>
					<CardHeader title="환율설정" />
					<Divider />
					<Stack spacing={3} sx={{ p: 3 }}>
						<TextField
							label="환율"
							value={exchangeText}
							onChange={(e) => setExchangeText(e.target.value)}
							fullWidth
						/>
					</Stack>
				</Card>


				<Card>
					<CardHeader title="메인페이지 영상" />
					<Divider />
					<Stack spacing={3} sx={{ p: 3 }}>
						<Typography variant="subtitle2">동영상 파일</Typography>
						<input
							type="file"
							id="videoFile"
							style={{ display: 'none' }}
							onChange={handleVideoFileChange}
						/>
						{videoFile ? (
							<Box sx={{ mb: 2 }}>
								<video
									controls
									src={videoFile instanceof File ? URL.createObjectURL(videoFile) : videoFile} // 업로드된 URL을 사용
									style={{ maxWidth: '400px', maxHeight: '400px' }}
								>
									<track default kind="captions" srcLang="en" />
								</video>
							</Box>
						) : (
							// 비디오 파일이 없을 경우 기존 entity_value를 사용
							settingsVideo[0] && settingsVideo[0].entity_value ? (
								<Box sx={{ mb: 2 }}>
									<video
										controls
										src={settingsVideo[0].entity_value} // 기존 비디오 경로를 사용
										style={{ maxWidth: '400px', maxHeight: '400px' }}
									>
										<track default kind="captions" srcLang="en" />
									</video>
								</Box>
							) : (
								<Typography>{videoFileName}</Typography>
							)
						)}
						<Stack direction="row" spacing={2} alignItems="center">
							<Button variant="contained" component="label" htmlFor="videoFile">
								파일 선택
							</Button>
						</Stack>
					</Stack>
				</Card>



				<Stack alignItems="flex-end" sx={{ mt: 3 }}>
					<LoadingButton type="button" variant="contained" size="large" onClick={handleSave}>
						수정 완료
					</LoadingButton>
				</Stack>
			</Stack>
		</form>
	);
}
