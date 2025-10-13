import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import Modal from '@/components/UI/Modal';
import { Member } from '@/models/member';
import * as config from '@/config';
import { imageCompress } from '@/utils/util';
import MemberService from '@/services/MemberService';

function MemberEdit() {
  const location = useLocation();
  const memberData = location.state['memberData'];
  const [member, setMember] = useState(memberData);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalText, setModalText] = useState('');

  function closeModal() {
    setModalOpen(false);
    setModalText('');
  }

  async function saveData() {
    if (member.user_id === '') {
      setModalText('아이디가 입력되지 않았습니다.');
      setModalOpen(true);
      return;
    }

    const result = await MemberService.update(member);
    if (result) {
      setModalText('정상적으로 저장되었습니다.');
      setModalOpen(true);
    }
  }

  async function onUploadFile(e) {
    if (!e.target.files) return;

    for (let i = 0; i < e.target.files.length; i++) {
      const data = new FormData();

      const compressImage = await imageCompress(e.target.files[i]);
      data.append('file', compressImage!);

      const result = await MemberService.addAttachment(data);
      if (result) {
        setMember({ ...member, image_file: result });
      }
    }
  }

  return (
    <>
      <div className="container">
        <div className="card">
          <div className="header">
            <h2>기본 정보</h2>
            <button className="save-button" onClick={saveData}>저장</button>
          </div>
          <div className="divider"></div>
          <div className="content">
            <div className="form-group">
              <label>아이디</label>
              <input
                type="text"
                value={member.user_id}
                onChange={(e) => setMember({ ...member, user_id: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>휴대폰번호</label>
              <input
                type="text"
                value={member.cellphone}
                onChange={(e) => setMember({ ...member, cellphone: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>이미지</label>
              <div className="image-upload">
                {member.image_file !== '' ? (
                  <img
                    alt=""
                    src={`${import.meta.env.VITE_STORE_SERVER_ADDRESS}/${member.image_file}`}
                    width={100}
                    height={100}
                  />
                ) : (
                  <span>이미지 없음</span>
                )}
                <label className="upload-button">
                  <input type="file" hidden onChange={(e) => onUploadFile(e)} />
                  찾아보기
                </label>
              </div>
            </div>

            <div className="form-group">
              <label>가입일</label>
              <div>{dayjs(member.created_date).format('YYYY-MM-DD HH:mm:ss')}</div>
            </div>
          </div>
        </div>

        {modalOpen && (
          <Modal type="info" text={modalText} onClose={closeModal} />
        )}
      </div>
    </>
  );
}

export default MemberEdit;
