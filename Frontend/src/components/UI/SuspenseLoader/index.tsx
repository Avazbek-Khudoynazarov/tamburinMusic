import { useEffect } from 'react';
import NProgress from 'nprogress';
import './index.module.css';

function SuspenseLoader() {
  useEffect(() => {
    NProgress.start();

    return () => {
      NProgress.done();
    };
  }, []);

  return (
    <div className="suspense-loader">
      <div className="spinner"></div>
    </div>
  );
}

export default SuspenseLoader;
