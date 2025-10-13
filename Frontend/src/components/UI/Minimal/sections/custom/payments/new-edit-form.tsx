import type { IPaymentsItem, IMemberItem, IInstrumentItem, ICurriculumItem, IClassesItem, IMetaItem } from '@/components/UI/Minimal/types/user';

import { z as zod } from 'zod';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import Autocomplete from '@mui/material/Autocomplete';


import { Iconify } from '@/components/UI/Minimal/components/iconify';
import { paths } from '@/components/UI/Minimal/routes/paths';
import { useRouter } from '@/components/UI/Minimal/routes/hooks';

import { fData } from '@/utils/format-number';

import { Label } from '@/components/UI/Minimal/components/label';
import { toast } from '@/components/UI/Minimal/components/snackbar';
import { Form, Field, schemaHelper } from '@/components/UI/Minimal/components/hook-form';

import PaymentsService from '@/services/PaymentsService';
import ClassesService from '@/services/ClassesService';
import MemberService from '@/services/MemberService';
import InstrumentService from '@/services/InstrumentService';
import CurriculumService from '@/services/CurriculumService';
import MetaService from '@/services/MetaService';

import { ListView } from './classesBoard/list-view';
// ----------------------------------------------------------------------

export type NewSchemaType = zod.infer<typeof NewSchema>;
export type EditSchemaType = zod.infer<typeof EditSchema>;


export const NewSchema = zod.object({
	member_id: zod.number(),
	teacher_id: zod.number(),
	instrument_id: zod.number(),
	curriculum_id: zod.number(),
	total_classes: zod.union([zod.string(), zod.number()]).transform((value) => Number(value)),
	remaining_classes: zod.union([zod.string(), zod.number()]).transform((value) => Number(value)),
	instrument_option: zod.union([zod.string(), zod.number()]).transform((value) => Number(value)),
	delivery_address: zod.string().optional(),
	available_time: zod.string().optional(),
	memo: zod.string().optional(),
	teacher_memo: zod.string().optional(),
	classes_price: zod.union([zod.string(), zod.number()]).transform((value) => Number(value)),
	instrument_price: zod.union([zod.string(), zod.number()]).transform((value) => Number(value)),
	monthly_price: zod.union([zod.string(), zod.number()]).transform((value) => Number(value)),
	final_price: zod.union([zod.string(), zod.number()]).transform((value) => Number(value)),
	payment_type: zod.union([zod.string(), zod.number()]).transform((value) => Number(value)),
	periodic_payment: zod.union([zod.string(), zod.number()]).transform((value) => Number(value)),
	billing_key: zod.string().optional(),
	payment_method: zod.string().optional(),
	bank_name: zod.string().optional(),
	bank_account_number: zod.string().optional(),
	bank_account_holder: zod.string().optional(),
	status: zod.union([zod.string(), zod.number()]).transform((value) => Number(value)),
	periodic_status: zod.string().optional(),
	payment_date: zod.date().nullable(),
	pg_pay_no: zod.string().optional(),
	error_log: zod.string().optional(),
	is_deleted: zod.string(),
	created_date: zod.date().optional(),
});

export const EditSchema = NewSchema.extend({ id: zod.number() });

// ----------------------------------------------------------------------

type Props = {
	currentItem?: IPaymentsItem;
	classes_id?: number;
};

export function NewEditForm({ currentItem, classes_id }: Props) {
	const router = useRouter();


	// 폼의 초기값을 설정 - currentItem가 있으면 해당 유저의 데이터를 폼에 채우고, 없으면 기본값을 사용
	const defaultValues = useMemo(
		() => ({
			id: currentItem?.id || 0,
			member_id: currentItem?.member_id || 0,
			teacher_id: currentItem?.teacher_id || 0,
			instrument_id: currentItem?.instrument_id || 0,
			curriculum_id: currentItem?.curriculum_id || 0,
			total_classes: currentItem?.total_classes || 0,
			remaining_classes: currentItem?.remaining_classes || 0,
			instrument_option: currentItem?.instrument_option || 0,
			delivery_address: currentItem?.delivery_address || "",
			available_time: currentItem?.available_time || "",
			memo: currentItem?.memo || "",
			teacher_memo: currentItem?.teacher_memo || "",
			classes_price: currentItem?.classes_price || 0,
			instrument_price: currentItem?.instrument_price || 0,
			monthly_price: currentItem?.monthly_price || 0,
			final_price: currentItem?.final_price || 0,
			payment_type: currentItem?.payment_type || 0,
			periodic_payment: currentItem?.periodic_payment || 0,
			billing_key: currentItem?.billing_key || "",
			payment_method: currentItem?.payment_method || "",
			bank_name: currentItem?.bank_name || "",
			bank_account_number: currentItem?.bank_account_number || "",
			bank_account_holder: currentItem?.bank_account_holder || "",
			status: currentItem?.status || 0,
			periodic_status: currentItem?.periodic_status || "",
			payment_date: currentItem?.payment_date ? new Date(currentItem.payment_date) : null,
			pg_pay_no: currentItem?.pg_pay_no || "",
			error_log: currentItem?.error_log || "",
			is_deleted: currentItem?.is_deleted || "N",
			created_date: currentItem?.created_date ? new Date(currentItem.created_date) : new Date(),
		}),
		[currentItem]
	);
	// 유효성 검사 스키마를 동적으로 설정
	const validationSchema = useMemo(() => (currentItem ? EditSchema : NewSchema), [currentItem]);

	// react-hook-form을 사용해 폼을 설정
	const methods = useForm<NewSchemaType | EditSchemaType>({
		mode: 'onSubmit',
		// 등록, 수정에 맞는 폼 유효성 검사 실행
		resolver: zodResolver(validationSchema),
		defaultValues,
	});

	// console.log(methods.formState.errors);


	const {
		setValue,
		reset,
		watch,
		control,
		handleSubmit,
		formState: { isSubmitting },
	} = methods;

	useEffect(() => {
		if (currentItem) {
			reset(defaultValues);
		}
	}, [currentItem, defaultValues, reset]);

	useEffect(() => {
		if (defaultValues.instrument_id) {
			setSelectedInstrumentId(defaultValues.instrument_id);
		}
	}, [defaultValues.instrument_id]);

	const values = watch();


	// 회원 리스트
	const [memberList, setMemberList] = useState<IMemberItem[]>([]);
	// 강사 리스트
	const [teacherList, setTeacherList] = useState<IMemberItem[]>([]);
	// 악기 리스트
	const [instrumentList, setInstrumentList] = useState<IInstrumentItem[]>([]);
	// 커리큘럼 리스트
	const [curriculumList, setCurriculumList] = useState<ICurriculumItem[]>([]);
	// 수업 리스트
	const [classesList, setClassesList] = useState<IClassesItem[]>([]);
	// 수업 로드여부 상태
	const [isInitialLoad, setIsInitialLoad] = useState(false);
	// 수업 Row
	const [classesRow, setClassesRow] = useState<IClassesItem | null>(null);



	// 악기 결제옵션 (10: 악기대여, 20: 개인악기사용, 30: 악기구입)
	const [paymentsInstrumentOption, setPaymentsInstrumentOption] = useState<IMetaItem[]>([]);

	// 결제타입 (10: 국내 결제, 20: 페이팔 결제)
	const [paymentsPaymentType, setPaymentsPaymentType] = useState<IMetaItem[]>([]);

	// 정기결제여부 (10: 일반결제, 20: 정기결제)
	const [paymentsPeriodicPayment, setPaymentsPeriodicPayment] = useState<IMetaItem[]>([]);

	// 결제방법 (card: 신용카드, trans: 실시간계좌이체, vbank: 가상계좌, bank: 무통장입금)
	const [paymentsPaymentMethod, setPaymentsPaymentMethod] = useState<IMetaItem[]>([]);

	// 결제상태 (10: 결제대기, 20: 결제완료, 30: 환불요청, 40: 환불완료)
	const [paymentsStatus, setPaymentsStatus] = useState<IMetaItem[]>([]);

	// 수업횟수 입력 값 상태 관리
	const [totalClasses, setTotalClasses] = useState<string>('');

	const [classList, setClassList] = useState<{ id: number; dateTime: string }[]>([]);


	// 수업스케쥴(캘린더)에서 선택해서 수업을 선택했을 경우 로드
	useEffect(() => {
		if (classes_id) {
			const loadClassRow = async () => {
				try {
					const classData = await ClassesService.get(classes_id);
					setClassesRow(classData);
				} catch (error) {
					console.error("Failed to load class row:", error);
					toast.error("수업 정보를 로드하는 데 실패했습니다.");
				}
			};
			loadClassRow();
		}
	}, [classes_id]);



	const loadInitialData = useCallback(async () => {
		setMemberList(await MemberService.getAllTypeList('10'));
		setTeacherList(await MemberService.getAllTypeList('20'));
		setInstrumentList(await InstrumentService.getAllList());
		setPaymentsInstrumentOption(await MetaService.getList('paymentsInstrumentOption'));
		setPaymentsPaymentType(await MetaService.getList('paymentsPaymentType'));
		setPaymentsPeriodicPayment(await MetaService.getList('paymentsPeriodicPayment'));
		setPaymentsPaymentMethod(await MetaService.getList('paymentsPaymentMethod'));
		setPaymentsStatus(await MetaService.getList('paymentsStatus'));
		if (currentItem && typeof currentItem?.id === 'number') {
			const loadedClasses: IClassesItem[] = await ClassesService.getByPaymentsId(currentItem?.id);

			const formattedClasses = loadedClasses.map((classItem) => ({
				...classItem,
				classes_date: classItem.classes_date ? new Date(classItem.classes_date) : null,
			}));

			setClassesList(formattedClasses);

			if (loadedClasses.length > 0) {
				setIsInitialLoad(true);
			}
		}

	}, [currentItem]);

	// 라디오, 체크박스 데이터 생성 함수
	const createOptions = (metaItems: IMetaItem[]) =>
		metaItems.map((item) => ({
			label: item.entity_value,
			value: item.entity_id,
		}));

	// 라디오, 체크박스 데이터 생성
	const option_paymentsInstrumentOption = createOptions(paymentsInstrumentOption);
	const option_paymentsPaymentType = createOptions(paymentsPaymentType);
	const option_paymentsPeriodicPayment = createOptions(paymentsPeriodicPayment);
	const option_paymentsPaymentMethod = createOptions(paymentsPaymentMethod);
	const option_paymentsStatus = createOptions(paymentsStatus);




	useEffect(() => {
		loadInitialData();
	}, [loadInitialData]);



	// instrument_id 상태 관리
	const [selectedInstrumentId, setSelectedInstrumentId] = useState<number | null>(null);

	// 악기를 선택할 때마다 그에 맞는 커리큘럼을 동적으로 로드
	useEffect(() => {
		const fetchCurriculumList = async () => {
			if (selectedInstrumentId) {
				const list = await CurriculumService.getListByInstrumentIdAll(selectedInstrumentId);
				setCurriculumList(list);
			} else {
				setCurriculumList([]);
			}
		};

		fetchCurriculumList();
	}, [selectedInstrumentId]);



	// 숫자만 입력
	const handleOnlyNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		// 숫자만 입력되도록 설정
		if (!Number.isNaN(Number(value)) && Number(value) >= 0) {
			setTotalClasses(value);
		}
	};

	const repeatOddClasses = (startIndex: number) => {
		setClassesList((prevList) => {
			// 기준 날짜 가져오기
			const baseDateTime = prevList[startIndex]?.classes_date;

			if (!baseDateTime || !(baseDateTime instanceof Date)) {
				toast.error("기본 날짜와 시간이 설정되어 있어야 합니다.");
				return prevList;
			}

			const newList = prevList.map((classItem, index) => {
				// 전체 리스트 기준으로 홀수 인덱스만 날짜를 7일씩 증가
				if (index > startIndex && index % 2 === 0) {
					return {
						...classItem,
						classes_date: new Date(baseDateTime.getTime() + 7 * 24 * 60 * 60 * 1000 * Math.ceil((index - startIndex) / 2)),
					};
				}
				return classItem;
			});

			return newList;
		});
	};

	const repeatEvenClasses = (startIndex: number) => {
		setClassesList((prevList) => {
			// 기준 날짜 가져오기
			const baseDateTime = prevList[startIndex]?.classes_date;

			if (!baseDateTime || !(baseDateTime instanceof Date)) {
				toast.error("기본 날짜와 시간이 설정되어 있어야 합니다.");
				return prevList;
			}

			const newList = prevList.map((classItem, index) => {
				// 전체 리스트 기준으로 짝수 인덱스만 날짜를 7일씩 증가
				if (index > startIndex && index % 2 === 1) {
					return {
						...classItem,
						classes_date: new Date(baseDateTime.getTime() + 7 * 24 * 60 * 60 * 1000 * Math.ceil((index - startIndex) / 2)),
					};
				}
				return classItem;
			});

			return newList;
		});
	};





	// 폼 제출 시 호출 - 수정 API 또는 생성 API를 호출
	const onSubmit = handleSubmit(async (data: NewSchemaType) => {
		try {
			if (currentItem) {
				const result = await PaymentsService.update({
					...data,
					id: currentItem.id,
				});
				if (result === 'success') {
					toast.success('결제 정보가 수정되었습니다.');
					router.push(paths.payments.list);
				} else {
					toast.error('결제 수정에 실패했습니다.');
				}


			} else {
				const result = await PaymentsService.create({
					...methods.getValues(),
				});
				if (result) {
					toast.success('결제 정보가 등록되었습니다.');
					router.push(paths.payments.list);
				} else {
					toast.error('결제 등록에 실패했습니다.');
				}
			}


			reset();
		} catch (error) {
			console.error(error);
			toast.error('오류가 발생했습니다. 다시 시도해주세요.');
		}
	});

	const deletePayments = useCallback(async (id?: number) => {
		if (id) {
			PaymentsService.delete(id).then((value) => {
				toast.success('해당 유저 정보를 삭제하였습니다.');
				router.push(paths.payments.list);
			});
		}
	}, [router]);


	const [selectedMember, setSelectedMember] = useState<IMemberItem | null>(null);




	return (
		<Form methods={methods} onSubmit={onSubmit}>
			<Stack spacing={{ xs: 3, md: 5 }} sx={{ mt: 3, mx: 'auto', maxWidth: { xs: 720, xl: 1200 } }}>
				{/* classes_id가 있을 때만 추가적으로 표시 */}
				{classes_id && classesRow && (
					<>
						<Card>
							<CardHeader title="수업 정보" subheader="" sx={{ mb: 1 }} />
							<Divider />
							<Stack spacing={3} sx={{ p: 3 }}>
								<Box
									rowGap={3}
									columnGap={2}
									display="grid"
									gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }} // 기본은 두 칸
								>
									{/* 수업 날짜 */}
									<Field.Text
										name=""
										label="수업 날짜"
										value={
											classesRow.classes_date
												? new Date(classesRow.classes_date).toLocaleDateString("ko-KR", {
													year: "numeric",
													month: "long",
													day: "numeric",
													hour: "2-digit",
													minute: "2-digit",
												})
												: ""
										}
									/>

									{/* 출석 여부 */}
									<Field.Text
										name=""
										label="출석 여부"
										value={
											classesRow.status === 10 ? "수업전" : classesRow.status === 20 ? "수업완료" : "수업불참"
										}
										InputProps={{ readOnly: true }}
									/>

									{/* 선생님 메모 */}
									<TextField
										name=""
										multiline
										maxRows={10} // 최대 10줄까지 자동 확장
										label="선생님 메모"
										value={currentItem?.teacher_memo || ""}
										InputProps={{ readOnly: true }}
										fullWidth
										sx={{
											gridColumn: "1 / -1", // 전체 열을 차지
											"& .MuiInputBase-root": {
												overflow: "hidden", // 내용 넘침 방지
											},
										}}
									/>
								</Box>
							</Stack>
						</Card>

						<Card>
							<CardHeader title="수업 게시판" subheader="" sx={{ mb: 1 }} />
							<ListView />
						</Card>

					</>

				)}


				<Card>
					<CardHeader title="회원 정보" subheader="" sx={{ mb: 1 }} />
					<Divider />
					<Stack spacing={3} sx={{ p: 3 }}>
						<Box rowGap={3} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }} >


							<Controller
								name="member_id"
								control={control}
								render={({ field }) => (
									<Autocomplete
										options={memberList}
										autoHighlight
										getOptionLabel={(option) => `${option.name} (${option.user_id})`}
										isOptionEqualToValue={(option, value) => option.id === value?.id}
										value={memberList.find((member) => member.id === field.value) || null}
										onChange={(event, newValue) => {
											setSelectedMember(newValue);
											field.onChange(newValue?.id || null);
										}}
										renderInput={(params) => (
											<TextField {...params} label="회원 선택" placeholder="회원 선택" />
										)}
									/>
								)}
							/>

							{currentItem?.member?.cellphone && (
								<Field.Text
									name=""
									label="연락처"
									value={currentItem?.member?.cellphone}
									InputProps={{ readOnly: true }}
								/>
							)}

							{currentItem?.member?.address1 && (
								<Field.Text
									name=""
									label="주소"
									value={`${currentItem?.member?.address1 || ''} ${currentItem?.member?.address2 || ''}`.trim()}
									InputProps={{ readOnly: true }}
								/>
							)}



						</Box>
					</Stack>
				</Card>


				<Card>
					<CardHeader title="수강신청 정보 " subheader="" sx={{ mb: 1 }} />
					<Divider />
					<Stack spacing={3} sx={{ p: 3 }}>
						<Box rowGap={3} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }} >

							<Field.Select
								name="instrument_id"
								size="medium"
								label="수업"
								value={selectedInstrumentId || ''}
								InputLabelProps={{ shrink: true }}
								onChange={(event) => {
									const selectedId = Number(event.target.value);
									setSelectedInstrumentId(selectedId);
									setValue('instrument_id', selectedId);
								}}
							>
								{instrumentList.map((row) => (
									<MenuItem key={row.id} value={row.id}>
										{row.name}
									</MenuItem>
								))}
							</Field.Select>

							<Field.Select name='teacher_id' size="medium" label="선생님" InputLabelProps={{ shrink: true }}>
								{teacherList.map((row) => (
									<MenuItem key={row.id} value={row.id}>{row.name}</MenuItem>
								))}
							</Field.Select>

							<Field.Select name='curriculum_id' size="medium" label="커리큘럼" InputLabelProps={{ shrink: true }}>
								{curriculumList.map((row) => (
									<MenuItem key={row.id} value={row.id}>{row.name} ({row.months}개월)</MenuItem>
								))}
							</Field.Select>

						</Box>
						<Divider />
						<Box rowGap={3} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }} >

							<Field.Text name="classes_price" label="수업 금액" />
							<Field.Text name="instrument_price" label="악기 금액" />
							<Field.Text name="final_price" label="총 결제금액" />
							<Field.Text name="monthly_price" label="월 결제금액" />




						</Box>
						<Divider />
						<Box rowGap={3} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }} >




							<Box sx={{ pl: '14px' }}>
								<Typography variant="subtitle2">결제 타입</Typography>
								<Field.RadioGroup
									row
									name="payment_type"
									options={option_paymentsPaymentType}
									sx={{ gap: 4 }}
								/>
							</Box>


							<Box sx={{ pl: '14px' }}>
								<Typography variant="subtitle2">정기결제 여부</Typography>
								<Field.RadioGroup
									row
									name="periodic_payment"
									options={option_paymentsPeriodicPayment}
									sx={{ gap: 4 }}
								/>
							</Box>


							<Box sx={{ pl: '14px' }}>
								<Typography variant="subtitle2">결제 방법</Typography>
								<Field.RadioGroup
									row
									name="payment_method"
									options={option_paymentsPaymentMethod}
									sx={{ gap: 4 }}
								/>
							</Box>


							<Box sx={{ pl: '14px' }}>
								<Typography variant="subtitle2">결제 상태</Typography>
								<Field.RadioGroup
									row
									name="status"
									options={option_paymentsStatus}
									sx={{ gap: 4 }}
								/>
							</Box>


						</Box>
						<Divider />
						<Box rowGap={3} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }} >


							<Box sx={{ pl: '14px' }}>
								<Typography variant="subtitle2">악기옵션</Typography>
								<Field.RadioGroup
									row
									name="instrument_option"
									options={option_paymentsInstrumentOption}
									sx={{ gap: 4 }}
								/>
							</Box>
							<Field.Text name="delivery_address" label="악기 배송ㅋ" />


						</Box>
						<Divider />
						<Box rowGap={3} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }} >

							<Field.Text name="available_time" label="수업 가능날짜" />
							<Field.Text name="memo" label="참고 항목" />

							<Field.Text
								name="payment_date"
								label="결제일시"
								value={currentItem?.payment_date ? new Date(currentItem?.payment_date).toLocaleDateString('ko-KR', {
									year: 'numeric',
									month: 'long',
									day: 'numeric',
									hour: '2-digit',
									minute: '2-digit'
								}) : ''}
								disabled
							/>

							<Field.Text
								name="created_date"
								label="등록일시"
								value={currentItem?.created_date ? new Date(currentItem.created_date).toLocaleDateString('ko-KR', {
									year: 'numeric',
									month: 'long',
									day: 'numeric',
									hour: '2-digit',
									minute: '2-digit'
								}) : ''}
								disabled
							/>


						</Box>

					</Stack>
				</Card>





				{currentItem && (
					<Card>
						<CardHeader title="수업 스케쥴" subheader="" sx={{ mb: 1 }} />
						<Divider />
						<Stack spacing={3} sx={{ p: 3 }}>

							{/* // 수업 리스트 생성 UI */}
							<Box display="flex" gap={2} alignItems="center">
								<TextField
									type="number"
									label="수업 횟수 입력"
									value={totalClasses}
									onChange={handleOnlyNumber}
								/>
								<Button
									variant="contained"
									onClick={() => {
										const newClasses: IClassesItem[] = Array.from(
											{ length: parseInt(totalClasses, 10) },
											(_, i) => ({
												id: undefined,
												member_id: currentItem?.member_id || 0,
												payments_id: currentItem?.id || 0,
												status: 10,
												classes_date: null, // 초기값 명시
												created_date: new Date(),
											})
										);
										setClassesList(newClasses);
										setIsInitialLoad(false);
									}}
								>
									수업 횟수 등록
								</Button>
							</Box>

							{classesList.length > 0 && (
								<Box component="table" sx={{ width: "100%", borderCollapse: "collapse", mt: 3 }}>
									{/* 테이블 헤더 */}
									<Box component="thead">
										<Box component="tr" sx={{ backgroundColor: "#f5f5f5", borderBottom: "1px solid #ddd" }}>
											<Box component="th" sx={{ padding: "8px", textAlign: "center" }}>No</Box>
											<Box component="th" sx={{ padding: "8px", textAlign: "center" }}>수업 일시</Box>
											<Box component="th" sx={{ padding: "8px", textAlign: "center" }}>출석 여부</Box>
											<Box component="th" sx={{ padding: "8px", textAlign: "center" }}>버튼</Box>
										</Box>
									</Box>

									{/* 테이블 바디 */}
									<Box component="tbody">
										{classesList.map((classItem, index) => (
											<Box
												component="tr"
												key={classItem.id}
												sx={{
													borderBottom: "1px solid #ddd"
												}}
											>
												{/* No */}
												<Box component="td" sx={{ padding: "8px", textAlign: "center" }}>
													{index + 1}
												</Box>
												{/* 수업 날짜 */}
												<Box component="td" sx={{ padding: "8px" }}>
													<TextField
														fullWidth
														type="datetime-local"
														value={
															classItem.classes_date instanceof Date
																? `${classItem.classes_date.getFullYear()}-${String(classItem.classes_date.getMonth() + 1).padStart(2, '0')}-${String(classItem.classes_date.getDate()).padStart(2, '0')}T${String(classItem.classes_date.getHours()).padStart(2, '0')}:${String(classItem.classes_date.getMinutes()).padStart(2, '0')}`
																: ""
														}
														onChange={(e) => {
															const [date, time] = e.target.value.split("T");
															const [year, month, day] = date.split("-").map(Number);
															const [hours, minutes] = time.split(":").map(Number);
															const newDate = new Date(year, month - 1, day, hours, minutes);

															const updatedList = classesList.map((item, idx) =>
																idx === index
																	? { ...item, classes_date: newDate }
																	: item
															);

															setClassesList(updatedList);
														}}
													/>
												</Box>
												{/* 수업 여부 */}
												<Box component="td" sx={{ padding: "8px" }}>
													<Field.Select
														name={`status-${index}`}
														value={classItem.status || 10}
														onChange={(e) => {
															const updatedList = [...classesList];
															updatedList[index].status = Number(e.target.value);
															setClassesList(updatedList);
														}}
													>
														<MenuItem value={10}>수업전</MenuItem>
														<MenuItem value={20}>수업완료</MenuItem>
														<MenuItem value={30}>수업불참</MenuItem>
													</Field.Select>
												</Box>
												{/* 버튼 */}
												<Box component="td" sx={{ padding: "8px", textAlign: "center" }}>
													<Button
														variant="outlined"
														size="small"
														sx={{ mr: 1 }}
														onClick={() => repeatOddClasses(index)}
													>
														홀수회차반복
													</Button>
													<Button
														variant="outlined"
														size="small"
														onClick={() => repeatEvenClasses(index)}
													>
														짝수회차반복
													</Button>
												</Box>
											</Box>
										))}
									</Box>
								</Box>
							)}




							{isInitialLoad ? (
								<Box display="flex" justifyContent="flex-end" mt={2}>
									<LoadingButton
										variant="contained"
										size="large"
										onClick={async () => {
											try {
												const currentDate = new Date();
												const updatedClassesList = classesList.map((classItem) => ({
													...classItem,
													classes_date: classItem.classes_date instanceof Date
														? `${classItem.classes_date.getFullYear()}-${String(classItem.classes_date.getMonth() + 1).padStart(2, '0')}-${String(classItem.classes_date.getDate()).padStart(2, '0')} ${String(classItem.classes_date.getHours()).padStart(2, '0')}:${String(classItem.classes_date.getMinutes()).padStart(2, '0')}:00`
														: null,
													created_date: classItem.created_date || currentDate,
												}));
												const payload = updatedClassesList.map(({ member, teacher, instrument, curriculum,  ...rest }) => rest);

												await ClassesService.updateRows(payload);

												toast.success("수업 정보가 성공적으로 수정되었습니다.");
											} catch (error) {
												toast.error("수정 중 오류가 발생했습니다.");
											}
										}}
									>
										수업 정보 수정
									</LoadingButton>
								</Box>

							) : (
								classesList.length > 0 && (
									<Box display="flex" justifyContent="flex-end" mt={2}>
										<LoadingButton
											variant="contained"
											size="large"
											onClick={async () => {
												try {
													const currentDate = new Date();
													const updatedClassesList = classesList.map((classItem) => ({
														...classItem,
														classes_date: classItem.classes_date instanceof Date
															? `${classItem.classes_date.getFullYear()}-${String(classItem.classes_date.getMonth() + 1).padStart(2, '0')}-${String(classItem.classes_date.getDate()).padStart(2, '0')} ${String(classItem.classes_date.getHours()).padStart(2, '0')}:${String(classItem.classes_date.getMinutes()).padStart(2, '0')}:00`
															: null,
														created_date: currentDate,
													}));

													if (currentItem?.id !== undefined) {
														await ClassesService.deleteByPaymentsId(currentItem.id); // 안전하게 호출
													} else {
														toast.error("유효하지 않은 결제 항목입니다.");
														return;
													}
													await ClassesService.createRows(updatedClassesList);


													// 새로 등록된 데이터를 가져와 업데이트
													const loadedClasses: IClassesItem[] = await ClassesService.getByPaymentsId(currentItem?.id);
													const formattedClasses = loadedClasses.map((classItem) => ({
														...classItem,
														classes_date: classItem.classes_date ? new Date(classItem.classes_date) : null,
													}));
													setClassesList(formattedClasses);
													setIsInitialLoad(true);

													toast.success("수업 정보가 성공적으로 등록되었습니다.");
												} catch (error) {
													toast.error("등록 중 오류가 발생했습니다.");
												}
											}}
										>
											수업 정보 등록
										</LoadingButton>
									</Box>
								)
							)}

							{/* 수업 등록 버튼 */}
							{/* {classesList.length > 0 && currentItem === undefined && (
								
							)} */}


							{/* 수업 수정 버튼 */}



						</Stack>
					</Card>

				)}






				{currentItem?.periodic_payment === 20 && (
					<Card>
						<CardHeader title="정기결제 정보" subheader="" sx={{ mb: 1 }} />
						<Divider />
						<Stack spacing={3} sx={{ p: 3 }}>
							<Box rowGap={3} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }} >


								<Field.Text
									name="created_date"
									label="생성일"
									value={currentItem?.created_date ? new Date(currentItem.created_date).toLocaleDateString('ko-KR', {
										year: 'numeric',
										month: 'long',
										day: 'numeric',
										hour: '2-digit',
										minute: '2-digit'
									}) : ''}
									disabled
								/>

							</Box>

						</Stack>
					</Card>
				)}



				<Stack direction="row" alignItems="flex-end" justifyContent="flex-end" sx={{ mt: 3, gap: '10px' }}>
					<LoadingButton color="inherit" size="large" variant="outlined" onClick={() => router.back()}>
						목록으로
					</LoadingButton>
					<LoadingButton type="submit" variant="contained" size="large">
						{!currentItem ? '등록 완료' : '수정 완료'}
					</LoadingButton>
				</Stack>




			</Stack>
		</Form >
	);
}