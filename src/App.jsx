import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css';
import Login from './Components/Login';
import { createBrowserRouter } from 'react-router-dom';
import ErrorPage from './Components/ErrorPage';
import Dashboard from './Components/Dashboard';
import AdminDashboard from './Components/AdminDashboard';
import SignUp from './Components/SignUp';
import Booking from './Components/Booking';
import { RouterProvider } from 'react-router-dom';
import BookASlotIntro from './Components/BookASlotIntro';

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <BookASlotIntro />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/login",
      element: <Login />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/signup",
      element: <SignUp />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/adminDashboard",
      element: <AdminDashboard />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/booking",
      element: <Booking />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/dashboard",
      element: <Dashboard />,
      errorElement: <ErrorPage />,
    },
  ]);

  return (
    <>
        <RouterProvider router={router} />
    </>
  )
}

export default App
