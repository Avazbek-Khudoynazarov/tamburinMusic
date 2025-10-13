import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AuthService from '@/services/AuthService';
import useGlobalStore from '@/stores/globalStore';


function Admin() {
	const [visible, setVisible] = useState(false);
	const navigate = useNavigate();
	const [message, setMessage] = useState("");
	const { user_id } = useParams();
	const { setAuthenticated, setMember } = useGlobalStore();


	async function loadInitialData() {
		const result = await AuthService.adminLogin(user_id!);
		setMember(result.member);
		setAuthenticated(true);
		navigate("/");
	}


	useEffect(() => {
		loadInitialData();
	}, []);






	return (
		<>		</>
	);
}



export default Admin;
