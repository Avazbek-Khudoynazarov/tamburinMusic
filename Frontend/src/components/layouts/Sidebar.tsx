import { FC, ReactNode } from 'react';
import { Link } from 'react-router-dom';

const Sidebar: FC = () => {
    return (
      <div style={{width: '30rem', display: 'flex', flexDirection: 'column', fontSize: '1.6rem'}}>
        <Link to='/'>홈</Link>
        <Link to='/member'>회원관리</Link>
      </div>
    );
  };
  
  export default Sidebar;
  