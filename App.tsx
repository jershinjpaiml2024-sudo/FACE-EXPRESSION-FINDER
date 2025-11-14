
import React, { useState, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { OptimizationPlanner } from './components/OptimizationPlanner';
import { DeviceControl } from './components/DeviceControl';
import { Reports } from './components/Reports';
import type { UserRole, View } from './types';
import { USER_ROLES } from './constants';
import { buildings, devices } from './data/mockData';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('Admin');
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const handleViewChange = (view: View) => {
    if (view === 'device-control' && currentUserRole !== 'Admin') {
      alert('Access Denied: Only Admins can control devices.');
      return;
    }
    setCurrentView(view);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard userRole={currentUserRole} />;
      case 'optimization-planner':
        return <OptimizationPlanner userRole={currentUserRole} />;
      case 'device-control':
        return <DeviceControl devices={devices} />;
      case 'reports':
        return <Reports />;
      default:
        return <Dashboard userRole={currentUserRole} />;
    }
  };

  const availableViews = useMemo(() => {
    const allViews: View[] = ['dashboard', 'optimization-planner', 'device-control', 'reports'];
    if (currentUserRole === 'Student') return ['dashboard'];
    if (currentUserRole === 'Faculty/Staff') return ['dashboard', 'optimization-planner'];
    return allViews;
  }, [currentUserRole]);


  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Sidebar 
        currentView={currentView} 
        onViewChange={handleViewChange} 
        userRole={currentUserRole}
        isOpen={isSidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <Header 
          currentUserRole={currentUserRole} 
          setCurrentUserRole={setCurrentUserRole}
          userRoles={USER_ROLES}
          toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
