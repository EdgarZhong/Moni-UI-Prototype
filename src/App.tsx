import { useCallback, useEffect, useState } from 'react';
import MoniHome from '@ui/pages/MoniHome';
import MoniEntry from '@ui/pages/MoniEntry';
import MoniSettings from '@ui/pages/MoniSettings';

type Page = 'home' | 'entry' | 'settings';

/**
 * 原型仓库的应用壳只负责维持与主仓库一致的状态驱动导航。
 * v3 第五章的 Design Scope 导航脚手架当前不启用，因此这里不按 URL
 * 路由拆 scope，只保留产品真实入口之间的页面切换方式。
 */
export default function App() {
  const [activePage, setActivePage] = useState<Page>('home');

  const handleNavigate = useCallback((page: Page) => {
    setActivePage(page);
  }, []);

  useEffect(() => {
    /**
     * 原型在浏览器中也使用主仓库的稳定画布变量。
     * 这样复制过来的表现层代码无需知道自己运行在原型仓库还是主仓库。
     */
    document.documentElement.style.setProperty('--app-root-height', `${window.innerHeight}px`);

    const updateViewportHeight = () => {
      document.documentElement.style.setProperty('--app-root-height', `${window.innerHeight}px`);
    };

    window.addEventListener('resize', updateViewportHeight);
    return () => window.removeEventListener('resize', updateViewportHeight);
  }, []);

  return (
    <>
      {activePage === 'home' ? <MoniHome onNavigate={handleNavigate} /> : null}
      {activePage === 'entry' ? <MoniEntry onNavigate={handleNavigate} /> : null}
      {activePage === 'settings' ? <MoniSettings onNavigate={handleNavigate} /> : null}
    </>
  );
}
