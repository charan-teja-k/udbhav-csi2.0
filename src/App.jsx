
import Homepage from './pages/Home';
import Regestration from "./pages/RegestrationPage"
import React from 'react'
import ProblemStatement from './pages/ProblemStatement';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Paymentpage from './pages/paymentpage';
import AdminPage from './pages/AdminPage';
export default function App() {
  return (
    <BrowserRouter >
    <Routes >
      <Route element={<Homepage/>} path='/'/>
      <Route element={<Regestration/>} path='/registration'/>
      <Route element={<ProblemStatement/>} path='/statement'/>
      <Route element={<Paymentpage/>}  path='/payment'/>
      <Route element={<AdminPage/>} path='/admin'/>
    </Routes>
    </BrowserRouter>
  )
}
