import { Sidebar } from '@/components/layout/Sidebar';
import { TodayPage } from '@/features/today/TodayPage';
import { useCRMStore } from '@/store';
import { useEffect } from 'react';

function App() {
  const theme = useCRMStore((state) => state.uiState.theme);

  useEffect(() => {
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="flex h-screen bg-lavender-50 dark:bg-slate-950">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 ml-64 overflow-auto">
        <div className="p-8 max-w-7xl mx-auto">
          <TodayPage />
        </div>
      </main>
    </div>
  );
}

export default App;
