import { useState, useEffect } from 'react';
import MemberService from '@/services/MemberService';

function NotFound() {
	useEffect(() => {
		loadData();
	}, []);

	async function loadData() {
		// 홈 내용 요청

	}

	return (
		<>
			<h1 style={{textAlign:'center', margin:'200px 0'}}>없는 페이지 입니다.</h1>
			{/* <div>
				<div className="field_input">
					<input type="text" name="a" />
					<input type="text" name="b" placeholder='주소' readOnly />
					<textarea name="c" ></textarea>
				</div>
			</div>

			<div>
				<div className="checkbox check-type-01">
					<input type="radio" name="type01" />
					<label>
						<span>신용카드</span>
					</label>
				</div>
				<div className="checkbox check-type-01">
					<input type="radio" name="type01" />
					<label>
						<span>무통장</span>
					</label>
				</div>
			</div>

			<div>
				<button type="submit" className="btn btn_primary">submit</button>
			</div> */}
		</>
	);
}

export default NotFound;
