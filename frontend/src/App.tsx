import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import AppRoutes from './routes/AppRoutes';

// Landing page is standalone – no MUI ThemeProvider/CssBaseline
// so it won't override our dark CSS variables
const LandingPage = lazy(() => import('./pages/LandingPage'));

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public landing page — fully standalone, no MUI providers */}
        <Route
          path="/"
          element={
            <Suspense fallback={<div style={{ background: '#081811', minHeight: '100vh' }} />}>
              <LandingPage />
            </Suspense>
          }
        />

        {/* All other routes — wrapped with Auth + MUI Theme providers */}
        <Route
          path="/*"
          element={
            <AuthProvider>
              <ThemeProvider>
                <AppRoutes />
              </ThemeProvider>
            </AuthProvider>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
