import { lazy, Suspense, useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { Classes } from '@/models/classes';
import ClassesService from '@/services/ClassesService';
import { CalendarView } from '@/components/UI/Minimal/sections/custom/calendar/view/calendar-view';
import { IClassesItem } from '@/components/UI/Minimal/types/user';
import { ICalendarEvent, ICalendarFilters } from '@/components/UI/Minimal/types/calendar';
import useGlobalStore from '@/stores/globalStore';


function Classrooms() {
	const [visible, setVisible] = useState(false);
	const [classesList, setClassesList] = useState<Classes[]>([]);
	const { member } = useGlobalStore();
	const [events, setEvents] = useState<ICalendarEvent[]>([]);

	async function loadInitialData() {
		let list: Classes[] = [];
	
		if (member && member?.id) { 
			if (member?.type === 10) {
				list = await ClassesService.getByMemberId2(member?.id ?? 0);
				// list = await ClassesService.getByMemberId(member?.id ?? 0);
			} else {
				list = await ClassesService.getByTeacherId(member?.id ?? 0);
			}
		}
		
	
		if (list) {
			
			if (member?.type === 10) {
				const list2 = list.map((item: Classes) => {
					const dateKST = new Date(item.classes_date!); // null이 아닌 경우에만 사용
					const localDateStr = dateKST.toLocaleString('sv-SE', {
						timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
						year: 'numeric',
						month: '2-digit',
						day: '2-digit',
						hour: '2-digit',
						minute: '2-digit',
						hour12: false
					});
					const localDate = new Date(localDateStr);
	
					return {
						...item,
						classes_date: localDate.toISOString()
					};
				});
				
				const newEvents = list2.map((item: Classes) => ({
					id: item.id?.toString(),
					member_id: item.member_id,
					status: item.status,
					title: member?.type === 10 ? `${item.instrument?.name}` : `${item.member?.name}`,
					start: item.classes_date
  ? dayjs(item.classes_date.toString().replaceAll('-', '/')).format()
  : '',

end: item.classes_date
  ? dayjs(item.classes_date.toString().replaceAll('-', '/')).format()
  : '',
					textColor: item.status === 10 ? "#a3a3a3" : item.status === 20 ? "#000000" : "#f44336",
					url: `/classroom/${item.id?.toString()}`,
					color: "",
					allDay: false,
					description: ""
				}));
	
				setEvents(newEvents as ICalendarEvent[]);
				setClassesList(list2);


			} else {
				const newEvents = list.map((item: Classes) => ({
					id: item.id?.toString(),
					member_id: item.member_id,
					status: item.status,
					title: member?.type === 10 ? `${item.instrument?.name}` : `${item.member?.name}`,
					start: item.classes_date
  ? dayjs(item.classes_date.toString().replaceAll('-', '/')).format()
  : '',

end: item.classes_date
  ? dayjs(item.classes_date.toString().replaceAll('-', '/')).format()
  : '',
					textColor: item.status === 10 ? "#a3a3a3" : item.status === 20 ? "#000000" : "#f44336",
					url: `/classroom/${item.id?.toString()}`,
					color: "",
					allDay: false,
					description: ""
				}));
	
				setEvents(newEvents as ICalendarEvent[]);
			}
		}
	
		setVisible(true);
	}
	

	useEffect(() => {
		loadInitialData();
	}, []);



	return (
		<div className={`vh-content-wrap ${visible && 'active'}`}>
			<div className="classroom">
				<h1 className="page-title">내 강의실</h1>
				<div className="vw-inner">
					<CalendarView />

				</div>
			</div>
		</div>
	);
}

export default Classrooms;

