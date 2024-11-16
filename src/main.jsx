import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import { App } from './App.jsx'
import ElectionFormList from './ElectionFormList.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path='/elecciones/listado' element={<ElectionFormList/>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
