import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BlankPage } from './components/BlankPage';
import { ProtectedOrdererRoute } from './components/ProtectedOrdererRoute';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={<BlankPage message="En desarrollo" />} 
        />
        <Route 
          path="/orderer" 
          element={<ProtectedOrdererRoute />} 
        />
        <Route 
          path="*" 
          element={<BlankPage message="Página no encontrada" />} 
        />
      </Routes>
    </Router>
  );
}