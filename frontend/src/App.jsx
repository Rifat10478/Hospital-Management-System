import { useState } from 'react'
import './App.css'
import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";

import {
    AuthProvider
} from "./context/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

import DoctorList from "./pages/doctors/DoctorList";
import DoctorForm from "./pages/doctors/DoctorForm";
import DoctorDetails from "./pages/doctors/DoctorDetails";


import PatientList from "./pages/patients/PatientList";

import PatientForm from "./pages/patients/PatientForm";

import PatientDetails from "./pages/patients/PatientDetails";


import AppointmentList from "./pages/appointments/AppointmentList";
import AppointmentForm from "./pages/appointments/AppointmentForm";

import PrescriptionList from "./pages/prescriptions/PrescriptionList";
import PrescriptionForm from "./pages/prescriptions/PrescriptionForm";
import PrescriptionDetails from "./pages/prescriptions/PrescriptionDetails";
import PrescriptionEdit from "./pages/prescriptions/PrescriptionEdit";

import MedicineList from "./pages/medicines/MedicineList";
import MedicineForm from "./pages/medicines/MedicineForm";
import MedicineDetails from "./pages/medicines/MedicineDetails";


import BillList from "./pages/bills/BillList";
import BillForm from "./pages/bills/BillForm";


import DepartmentList from "./pages/departments/DepartmentList";
import DepartmentForm from "./pages/departments/DepartmentForm";

function App() {

    return (
        <BrowserRouter>

            <AuthProvider>

                <Routes>

                    {/* PUBLIC ROUTES */}

                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    <Route
                        path="/register"
                        element={<Register />}
                    />


                    {/* PROTECTED ROUTES */}

                    <Route
                        path="/dashboard"
                        element={

                            <ProtectedRoute>

                                <Layout>

                                    <Dashboard />

                                </Layout>

                            </ProtectedRoute>

                        }
                    />

                    <Route
                        path="/doctors"
                        element={
                            <ProtectedRoute
                                roles={[
                                    "admin",
                                    "receptionist",
                                    "doctor"
                                ]}
                            >
                                <Layout>
                                    <DoctorList />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />


                    <Route
                        path="/doctors/add"
                        element={
                            <ProtectedRoute
                                roles={[
                                    "admin",
                                    "receptionist"
                                ]}
                            >
                                <Layout>
                                    <DoctorForm />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />


                    <Route
                        path="/doctors/:id"
                        element={
                            <ProtectedRoute
                                roles={[
                                    "admin",
                                    "receptionist",
                                    "doctor"
                                ]}
                            >
                                <Layout>
                                    <DoctorDetails />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />


                    <Route
                        path="/doctors/:id/edit"
                        element={
                            <ProtectedRoute
                                roles={[
                                    "admin",
                                    "receptionist"
                                ]}
                            >
                                <Layout>
                                    <DoctorForm />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/patients"
                        element={

                            <ProtectedRoute
                                roles={[
                                    "admin",
                                    "receptionist",
                                    "doctor"
                                ]}
                            >

                                <Layout>

                                    <PatientList />

                                </Layout>

                            </ProtectedRoute>

                        }
                    />


                    <Route
                        path="/patients/add"
                        element={

                            <ProtectedRoute
                                roles={[
                                    "admin",
                                    "receptionist"
                                ]}
                            >

                                <Layout>

                                    <PatientForm />

                                </Layout>

                            </ProtectedRoute>

                        }
                    />


                    <Route
                        path="/patients/:id"
                        element={

                            <ProtectedRoute
                                roles={[
                                    "admin",
                                    "receptionist",
                                    "doctor"
                                ]}
                            >

                                <Layout>

                                    <PatientDetails />

                                </Layout>

                            </ProtectedRoute>

                        }
                    />


                    <Route
                        path="/patients/:id/edit"
                        element={

                            <ProtectedRoute
                                roles={[
                                    "admin",
                                    "receptionist"
                                ]}
                            >

                                <Layout>

                                    <PatientForm />

                                </Layout>

                            </ProtectedRoute>

                        }
                    />

                    <Route
                        path="/appointments"
                        element={
                            <ProtectedRoute
                                roles={[
                                    "admin",
                                    "receptionist",
                                    "doctor",
                                    "patient"
                                ]}
                            >
                                <Layout>
                                    <AppointmentList />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />


                    <Route
                        path="/appointments/add"
                        element={
                            <ProtectedRoute
                                roles={[
                                    "admin",
                                    "receptionist",
                                    "patient"
                                ]}
                            >
                                <Layout>
                                    <AppointmentForm />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />


                    <Route
                        path="/appointments/:id/edit"
                        element={
                            <ProtectedRoute
                                roles={[
                                    "admin",
                                    "receptionist"
                                ]}
                            >
                                <Layout>
                                    <AppointmentForm />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/prescriptions"
                        element={
                            <ProtectedRoute
                                roles={[
                                    "admin",
                                    "doctor",
                                    "receptionist",
                                    "patient"
                                ]}
                            >
                                <Layout>
                                    <PrescriptionList />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />


                    <Route
                        path="/prescriptions/add"
                        element={
                            <ProtectedRoute
                                roles={[
                                    "admin",
                                    "doctor"
                                ]}
                            >
                                <Layout>
                                    <PrescriptionForm />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />


                    <Route
                        path="/prescriptions/:id"
                        element={
                            <ProtectedRoute
                                roles={[
                                    "admin",
                                    "doctor",
                                    "receptionist",
                                    "patient"
                                ]}
                            >
                                <Layout>
                                    <PrescriptionDetails />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />


                    <Route
                        path="/prescriptions/:id/edit"
                        element={
                            <ProtectedRoute
                                roles={[
                                    "admin",
                                    "doctor"
                                ]}
                            >
                                <Layout>
                                    <PrescriptionEdit />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />





                    <Route
                        path="/medicines"
                        element={
                            <ProtectedRoute
                                roles={[
                                    "admin",
                                    "doctor"
                                ]}
                            >
                                <Layout>
                                    <MedicineList />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />


                    <Route
                        path="/medicines/add"
                        element={
                            <ProtectedRoute
                                roles={[
                                    "admin"
                                ]}
                            >
                                <Layout>
                                    <MedicineForm />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />


                    <Route
                        path="/medicines/:id"
                        element={
                            <ProtectedRoute
                                roles={[
                                    "admin",
                                    "doctor"
                                ]}
                            >
                                <Layout>
                                    <MedicineDetails />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />


                    <Route
                        path="/medicines/:id/edit"
                        element={
                            <ProtectedRoute
                                roles={[
                                    "admin"
                                ]}
                            >
                                <Layout>
                                    <MedicineForm />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />



                    <Route
                        path="/bills"
                        element={
                            <ProtectedRoute>
                                <Layout>
                                    <BillList />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />


                    <Route
                        path="/bills/add"
                        element={
                            <ProtectedRoute
                                roles={[
                                    "admin",
                                    "receptionist"
                                ]}
                            >
                                <Layout>
                                    <BillForm />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />


                    <Route
                        path="/bills/:id/edit"
                        element={
                            <ProtectedRoute
                                roles={[
                                    "admin",
                                    "receptionist"
                                ]}
                            >
                                <Layout>
                                    <BillForm />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />




                    <Route
                        path="/departments"
                        element={
                            <ProtectedRoute
                                roles={[
                                    "admin",
                                    "receptionist"
                                ]}
                            >
                                <Layout>
                                    <DepartmentList />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />


                    <Route
                        path="/departments/add"
                        element={
                            <ProtectedRoute
                                roles={[
                                    "admin",
                                    "receptionist"
                                ]}
                            >
                                <Layout>
                                    <DepartmentForm />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />


                    <Route
                        path="/departments/:id/edit"
                        element={
                            <ProtectedRoute
                                roles={[
                                    "admin",
                                    "receptionist"
                                ]}
                            >
                                <Layout>
                                    <DepartmentForm />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />


                    {/* DEFAULT ROUTE */}

                    <Route
                        path="*"
                        element={
                            <Login />
                        }
                    />

                </Routes>

            </AuthProvider>

        </BrowserRouter>
    );
}


export default App;