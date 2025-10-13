import React, { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import Modal from '@/components/UI/Modal';
import MemberService from '@/services/MemberService';
import { Member } from '@/models/member';

const MemberTable = ({ memberCount, memberList, onRefresh }) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [modalType, setModalType] = useState('');
  const [modalText, setModalText] = useState('');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  function deleteConfirm(member) {
    setSelectedMember(member);
    setModalText('정말 삭제하시겠습니까?');
    setModalType('confirm');
  }

  async function deleteMember() {
    const result = await MemberService.delete(selectedMember?.id ?? 0);
    if (result) {
      onRefresh();
      setModalText('정상적으로 삭제되었습니다.');
      setModalType('info');
    } else {
      setModalText('삭제 도중 오류가 발생하였습니다.');
      setModalType('error');
    }
  }

  function closeModal() {
    setModalText('');
    setModalType('');
  }

  const modifyMember = (member) => {
    navigate('/member/edit', { state: { memberData: member } });
  };

  const handlePageChange = (newPage) => {
    onRefresh(newPage);
    setPage(newPage);
  };

  return (
    <div className="card">
      <div className="card-header">회원 목록</div>
      <div className="divider"></div>
      <table className="table">
        <thead>
          <tr>
            <th>아이디</th>
            <th>닉네임</th>
            <th>휴대폰번호</th>
            <th>가입일</th>
            <th>마케팅 동의</th>
            <th>수정</th>
          </tr>
        </thead>
        <tbody>
          {memberList.map((member) => (
            <tr key={member.id}>
              <td>{member.user_id}</td>
              <td>{member.nickname}</td>
              <td>{member.cellphone}</td>
              <td>{dayjs(member.created_date).format('YYYY-MM-DD HH:mm')}</td>
              <td>{member.agree_marketing === 1 ? '동의' : '미동의'}</td>
              <td>
                <button className="edit-button" onClick={() => modifyMember(member)}>수정</button>
                <button className="delete-button" onClick={() => deleteConfirm(member)}>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        {Array.from({ length: Math.ceil(memberCount / 20) }, (_, index) => (
          <button
            key={index + 1}
            className={`page-button ${page === index + 1 ? 'active' : ''}`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
      {modalType && (
        <Modal
          type={modalType}
          text={modalText}
          onConfirm={deleteMember}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

MemberTable.propTypes = {
  memberList: PropTypes.array.isRequired,
  memberCount: PropTypes.number.isRequired,
  onRefresh: PropTypes.func.isRequired,
};

export default MemberTable;
