import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import './styles/theme.css';

import Header from './components/Header';
import Footer from './components/Footer';

// Público
import Inicio from './pages/Inicio';
import Servicios from './pages/Servicios';
import Contacto from './pages/Contacto';
import Planes from './pages/Planes';
import ServicioDetalle from './pages/ServicioDetalle'; 

// Portal Cliente
import ClienteLogin from './pages/clientes/ClienteLogin';
import ClienteProyectos from './pages/clientes/ClienteProyectos';
import ClienteProyectoDetalle from './pages/clientes/ClienteProyectoDetalle';
import ClienteFacturas from './pages/clientes/ClienteFacturas';
import ClienteNuevoTicket from './pages/clientes/ClienteNuevoTicket';
import ClienteDashboard from './pages/clientes/ClienteDashboard';
import ClienteTicketDetalle from './pages/clientes/ClienteTicketDetalle'; // 👈 nuevo import
import { PrivateRoute } from './config/auth';

// Admin
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminClients from './pages/admin/AdminClients';
import AdminClientUsers from './pages/admin/AdminClientUsers';
import AdminProjects from './pages/admin/AdminProjects';
import AdminProjectDetail from './pages/admin/AdminProjectDetail';
import AdminTickets from './pages/admin/AdminTickets';
import AdminTicketDetail from './pages/admin/AdminTicketDetail'; // 👈 nuevo import
import { AdminPrivate } from './config/adminAuth';

function Chrome({ children }) {
  // Oculta Header/Footer en rutas /cliente/* y /admin/*
  const location = useLocation();
  const isCliente = location.pathname.startsWith('/cliente');
  const isAdmin = location.pathname.startsWith('/admin');
  const hideChrome = isCliente || isAdmin;

  return (
    <>
      {!hideChrome && <Header />}
      {children}
      {!hideChrome && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <Chrome>
        <Routes>
          {/* Público */}
          <Route path="/" element={<Navigate to="/inicio" replace />} />
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/planes" element={<Planes />} />
          <Route path="/servicios/:slug" element={<ServicioDetalle />} />

          {/* Portal Cliente */}
          <Route path="/cliente/login" element={<ClienteLogin />} />
          <Route
            path="/cliente"
            element={
              <PrivateRoute>
                <ClienteDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/cliente/proyectos"
            element={
              <PrivateRoute>
                <ClienteProyectos />
              </PrivateRoute>
            }
          />
          <Route
            path="/cliente/proyectos/:id"
            element={
              <PrivateRoute>
                <ClienteProyectoDetalle />
              </PrivateRoute>
            }
          />
          <Route
            path="/cliente/facturas"
            element={
              <PrivateRoute>
                <ClienteFacturas />
              </PrivateRoute>
            }
          />
          <Route
            path="/cliente/tickets/nuevo"
            element={
              <PrivateRoute>
                <ClienteNuevoTicket />
              </PrivateRoute>
            }
          />
          <Route
            path="/cliente/tickets/:id"
            element={
              <PrivateRoute>
                <ClienteTicketDetalle />
              </PrivateRoute>
            }
          />

          {/* Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <AdminPrivate>
                <AdminDashboard />
              </AdminPrivate>
            }
          />
          <Route
            path="/admin/clients"
            element={
              <AdminPrivate>
                <AdminClients />
              </AdminPrivate>
            }
          />
          <Route
            path="/admin/client-users"
            element={
              <AdminPrivate>
                <AdminClientUsers />
              </AdminPrivate>
            }
          />
          <Route
            path="/admin/projects"
            element={
              <AdminPrivate>
                <AdminProjects />
              </AdminPrivate>
            }
          />
          <Route
            path="/admin/projects/:id"
            element={
              <AdminPrivate>
                <AdminProjectDetail />
              </AdminPrivate>
            }
          />
          <Route
            path="/admin/tickets"
            element={
              <AdminPrivate>
                <AdminTickets />
              </AdminPrivate>
            }
          />
          <Route
            path="/admin/tickets/:id"
            element={
              <AdminPrivate>
                <AdminTicketDetail />
              </AdminPrivate>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/inicio" replace />} />
        </Routes>
      </Chrome>
    </Router>
  );
}

export default App;
