import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './store/AppContext';
import AppLayout from './layouts/AppLayout';
import Dashboard from './pages/Dashboard';
import Hackathons from './pages/Hackathons';
import Ideas from './pages/Ideas';
import Shortlist from './pages/Shortlist';
import MyApplications from './pages/MyApplications';
import Contributors from './pages/Contributors';
import Trends from './pages/Trends';
import Settings from './pages/Settings';

const App = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="hackathons" element={<Hackathons />} />
            <Route path="ideas" element={<Ideas />} />
            <Route path="shortlist" element={<Shortlist />} />
            <Route path="my-applications" element={<MyApplications />} />
            <Route path="contributors" element={<Contributors />} />
            <Route path="trends" element={<Trends />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
