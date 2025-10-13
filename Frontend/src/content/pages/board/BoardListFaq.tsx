import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Board } from '@/models/board';
import BoardService from '@/services/BoardService';

function BoardListFaq() {
	const [visible, setVisible] = useState(false);
	const [boardList, setBoardList] = useState<Board[]>([]);
	const [activeTab, setActiveTab] = useState('tab1');
	const [openIndexes, setOpenIndexes] = useState<number[]>([]);
	const navigate = useNavigate();
	const [searchInput, setSearchInput] = useState<string>('');
	const [searchQuery, setSearchQuery] = useState<string>('');

	async function loadInitialData() {
		setBoardList(await BoardService.getByType('자주묻는질문'));

		setVisible(true);
	}

	useEffect(() => {
		loadInitialData();
	}, []);


	const toggleFAQ = (index: number) => {
		setOpenIndexes(prev =>
			prev.includes(index)
				? prev.filter(i => i !== index)
				: [...prev, index]
		);
	};

	const filterBoard = (category: string) => {
		return boardList.filter(row =>
			row.category === category &&
			( searchQuery === '' ||
				row.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
				row.content.toLowerCase().includes(searchQuery.toLowerCase())
			)
		);
	}



	return (
		<div className={`vh-content-wrap ${visible && 'active'}`}>
			<div className="board-faq">
				<div className="vw-inner">
					<h1 className="title">탬버린 자주묻는질문</h1>

					<div className="field-row">
						<input type="text" placeholder="원하는 내용의 키워드를 입력해주세요" onChange={(e) => setSearchInput(e.target.value)} />
						<button type="button" onClick={() => setSearchQuery(searchInput)}><img src="/images/icon/btn/btn_search.png" alt="" /></button>
					</div>

					<div className="tabs">
						<div className="btn-cont">
							<button
								onClick={() => setActiveTab('tab1')}
								className={activeTab === 'tab1' ? 'active' : ''}
							>
								수업
							</button>
						</div>
						<div className="btn-cont">
							<button
								onClick={() => setActiveTab('tab2')}
								className={activeTab === 'tab2' ? 'active' : ''}
							>
								선생님
							</button>
						</div>
						<div className="btn-cont">
							<button
								onClick={() => setActiveTab('tab3')}
								className={activeTab === 'tab3' ? 'active' : ''}
							>
								악기
							</button>
						</div>
						<div className="btn-cont">
							<button
								onClick={() => setActiveTab('tab4')}
								className={activeTab === 'tab4' ? 'active' : ''}
							>
								기타
							</button>
						</div>
					</div>

					<div className="tab-content">
						{activeTab === 'tab1' &&
							<ul className="faq-cont">
								{
									filterBoard('수업')
									.map((row, index) => (
										<li>
										<div className="faq-header" onClick={() => toggleFAQ(index)}>
											<h1><span>Q. </span>{row?.subject}</h1>
											<i className={openIndexes.includes(1) ? "fas fa-angle-down" : "fas fa-angle-right"}></i>
										</div>
										<div className={`faq-content ${openIndexes.includes(index) ? 'open' : ''}`}  dangerouslySetInnerHTML={{__html: row?.content}}></div>
									</li>
									))
								}
							</ul>
						}
						{activeTab === 'tab2' &&
							<ul className="faq-cont">
								{
									filterBoard('선생님')
									.map((row, index) => (
										<li>
										<div className="faq-header" onClick={() => toggleFAQ(index)}>
											<h1><span>Q. </span>{row?.subject}</h1>
											<i className={openIndexes.includes(1) ? "fas fa-angle-down" : "fas fa-angle-right"}></i>
										</div>
										<div className={`faq-content ${openIndexes.includes(index) ? 'open' : ''}`}  dangerouslySetInnerHTML={{__html: row?.content}}></div>
									</li>
									))
								}
							</ul>
						}
						{activeTab === 'tab3' &&
							<ul className="faq-cont">
								{
									filterBoard('악기')
									.map((row, index) => (
										<li>
										<div className="faq-header" onClick={() => toggleFAQ(index)}>
											<h1><span>Q. </span>{row?.subject}</h1>
											<i className={openIndexes.includes(1) ? "fas fa-angle-down" : "fas fa-angle-right"}></i>
										</div>
										<div className={`faq-content ${openIndexes.includes(index) ? 'open' : ''}`}  dangerouslySetInnerHTML={{__html: row?.content}}></div>
									</li>
									))
								}
							</ul>
						}
						{activeTab === 'tab4' &&
							<ul className="faq-cont">
								{
									filterBoard('기타')
									.map((row, index) => (
										<li>
										<div className="faq-header" onClick={() => toggleFAQ(index)}>
											<h1><span>Q. </span>{row?.subject}</h1>
											<i className={openIndexes.includes(1) ? "fas fa-angle-down" : "fas fa-angle-right"}></i>
										</div>
										<div className={`faq-content ${openIndexes.includes(index) ? 'open' : ''}`}  dangerouslySetInnerHTML={{__html: row?.content}}></div>
									</li>
									))
								}
							</ul>
						}

					</div>

					<div className="faq-bottom">
						<h1>원하는 내용을 찾지 못하셨다면 카카오톡으로 문의해 주세요.</h1>
						<a href="https://pf.kakao.com/_UPqrb" target="_blank">
							<button type="button"><img src="/images/icon/common/kakao_channel.png" alt="" /> @탬버린 뮤직</button>
						</a>
					</div>

				</div>
			</div>
		</div>
	);
}

export default BoardListFaq;
