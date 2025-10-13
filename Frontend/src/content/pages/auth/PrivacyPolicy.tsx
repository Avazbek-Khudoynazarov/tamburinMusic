import React, { useState, useEffect } from 'react';

function PrivacyPolicy() {
	const [visible, setVisible] = useState(false);
	
	async function loadInitialData() {
		setVisible(true);
	}

	useEffect(() => {
		loadInitialData();
	}, []);



	return (
		<div className={`vh-content-wrap ${visible && 'active'}`}>
			<div className="common-page">
				<div className="vw-inner">

					<img src="/images/banner/page/policy.jpg" alt="" className="visual" />

				</div>
			</div>
		</div>

	);
}



export default PrivacyPolicy;
