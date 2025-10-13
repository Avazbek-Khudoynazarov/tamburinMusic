import { useState, useEffect } from 'react';
import Footer from '@/components/layouts/Footer';

function Dashboard() {
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    //대시보드 내용 요청.

  }

  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <div style={{fontSize: '1.6rem'}}>
        대시보드
      </div>
      <Footer />
    </div>
  );
}

export default Dashboard;
