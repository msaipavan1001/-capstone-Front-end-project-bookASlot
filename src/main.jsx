import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App';
import Booking from './Components/Booking';
import './index.css';
import { RouterProvider, createBrowserRouter  } from 'react-router-dom';
import ErrorPage from './Components/ErrorPage';
import Dashboard from './Components/Dashboard';
import AdminDashboard from './Components/AdminDashboard';
import SignUp from './Components/SignUp';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
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

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
