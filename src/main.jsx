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
import Login from './Components/Login';
import { AppProvider } from './context/AppContext';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
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

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
   
  </StrictMode>,
)
