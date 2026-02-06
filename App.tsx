
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Boxes, 
  Wrench, 
  ClipboardList, 
  Package,
  Menu,
  X,
  Search,
  Sparkles,
  Database,
  ChevronRight,
  MessageSquare,
  Globe,
  History
} from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Tools from './pages/Tools';
import Reports from './pages/Reports';
import AIAssistant from './components/AIAssistant';
import { getDB } from './services/db';
import { AuditType } from './types';

const NavItem = ({ to, icon: Icon, label, active }: { to: string, icon: any, label: string, active: boolean }) => (
  <Link
    to={to}
    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
      active 
        ? 'bg-[#0061CE] text-white shadow-md' 
        : 'text-[#333333] hover:bg-slate-100'
    }`}
  >
    <Icon size={20} />
    <span className={`font-medium ${active ? 'heading-font' : ''}`}>{label}</span>
  </Link>
);

const Sidebar = ({ isOpen, toggle }: { isOpen: boolean, toggle: () => void }) => {
  const location = useLocation();
  const db = getDB();
  const lastImport = db.auditLogs.find(log => log.type === AuditType.IMPORT);
  const lastImportStr = lastImport ? new Date(lastImport.timestamp).toLocaleDateString() : 'None';
  
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={toggle}
        />
      )}
      
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-200 z-50 transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-[#0061CE] p-2 rounded-lg">
                <Package className="text-white" size={24} />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-[#002D56] heading-font">
                SBS Cordova
              </h1>
            </div>
            <button onClick={toggle} className="lg:hidden text-slate-500">
              <X size={24} />
            </button>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            <NavItem to="/" icon={LayoutDashboard} label="Dashboard" active={location.pathname === '/'} />
            <NavItem to="/inventory" icon={Boxes} label="Inventory Mgmt" active={location.pathname === '/inventory'} />
            <NavItem to="/tools" icon={Wrench} label="System Tools" active={location.pathname === '/tools'} />
            <NavItem to="/reports" icon={ClipboardList} label="Audit Reports" active={location.pathname === '/reports'} />
            
            {/* Branding Logo Area */}
            <div className="pt-8 px-4 flex flex-col items-center opacity-90">
              <img 
                src="https://www.silverbayseafoods.com/wp-content/uploads/2021/04/Silver-Bay-Logo-Blue-Text-Trans-Background.png" 
                alt="Silver Bay Seafoods"
                className="w-full h-auto max-w-[160px] hover:scale-105 transition-transform duration-500"
              />
            </div>
          </nav>

          <div className="p-4 border-t border-slate-100">
            <div className="bg-slate-50 rounded-xl p-3 space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <p className="text-[10px] text-[#333333] font-bold uppercase tracking-wider">System Status</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-[9px] text-[#0061CE] font-bold">
                    <History size={10} />
                    <span>Last Import: {lastImportStr}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

const Header = ({ toggleSidebar, toggleAI }: { toggleSidebar: () => void, toggleAI: () => void }) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 fixed top-0 right-0 left-0 lg:left-64 z-30 flex items-center justify-between px-6">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="lg:hidden mr-4 text-slate-500">
          <Menu size={24} />
        </button>
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search catalog..." 
            className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#0061CE] w-64 transition-all"
          />
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <button 
          onClick={toggleAI}
          className="flex items-center space-x-2 px-3 py-1.5 bg-blue-50 text-[#0061CE] rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors text-sm font-semibold heading-font"
        >
          <Sparkles size={16} />
          <span className="hidden sm:inline">Smart AI</span>
        </button>
        <div className="h-8 w-[1px] bg-slate-200 mx-1 hidden sm:block"></div>
        <div className="w-8 h-8 rounded-full bg-[#0061CE] flex items-center justify-center text-white font-bold text-xs shadow-sm">
          JD
        </div>
      </div>
    </header>
  );
};

const App = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  const toggleAI = () => setIsAIOpen(!isAIOpen);

  return (
    <HashRouter>
      <div className="min-h-screen">
        <Sidebar isOpen={isSidebarOpen} toggle={toggleSidebar} />
        <Header toggleSidebar={toggleSidebar} toggleAI={toggleAI} />
        
        <main className="lg:pl-64 pt-16 min-h-screen bg-white">
          <div className="p-6 md:p-8 max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/reports" element={<Reports />} />
            </Routes>
          </div>
        </main>

        <AIAssistant isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
        
        <button 
          onClick={toggleAI}
          className="fixed bottom-6 right-6 lg:hidden w-14 h-14 bg-[#0061CE] text-white rounded-full shadow-2xl flex items-center justify-center z-40 hover:scale-110 transition-transform active:scale-95"
        >
          <MessageSquare size={24} />
        </button>
      </div>
    </HashRouter>
  );
};

export default App;
