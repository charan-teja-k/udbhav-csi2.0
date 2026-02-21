import Homepage from './pages/Home';
import Regestration from "./pages/RegestrationPage"
import React, { useCallback, useState } from 'react'
import ProblemStatement from './pages/ProblemStatement';
import IdeaSubmission from "./pages/IdeaSubmission";
import PptSubmission from "./pages/PptSubmission";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Paymentpage from './pages/paymentpage';
import AdminPage from './pages/AdminPage';
import Preloader from './components/Preloader';
import { AnimatePresence } from 'framer-motion';
import SubmessionsPage from './pages/SubmessionsPage';
export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handlePreloaderComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <BrowserRouter >
    <AnimatePresence mode="wait">
      {isLoading && <Preloader onComplete={handlePreloaderComplete} />}
    </AnimatePresence>
    <Routes >
      <Route element={<Homepage/>} path='/'/>
      <Route element={<Regestration/>} path='/registration'/>
      <Route element={<ProblemStatement/>} path='/statement'/>
      <Route element={<IdeaSubmission/>} path='/idea-submission'/>
      <Route element={<PptSubmission/>} path='/ppt-submission'/>
      <Route element={<Paymentpage/>}  path='/payment'/>
      <Route element={<AdminPage />} path="/admin" />
      <Route element={<SubmessionsPage/>} path="/admin/SubmessionsPage"/>
    </Routes>
    </BrowserRouter>
  )
}