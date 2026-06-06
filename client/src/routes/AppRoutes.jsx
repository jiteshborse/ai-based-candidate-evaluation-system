import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Profile from "../pages/candidate/Profile";
import UploadResume from "../pages/candidate/UploadResume";
import MyResumes from "../pages/candidate/MyResumes";
import BrowseJobs from "../pages/candidate/BrowseJobs";

import Jobs from "../pages/recruiter/Jobs";
import Rankings from "../pages/recruiter/Rankings";
import Analytics from "../pages/recruiter/Analytics";
import Reports from "../pages/recruiter/Reports";
import CandidateComparison from "../pages/recruiter/CandidateComparison";

import Login from
    "../pages/auth/Login";

import Register from
    "../pages/auth/Register";

import Dashboard from
    "../pages/Dashboard";

import Landing from
    "../pages/Landing";

import NotFound from
    "../pages/NotFound";

import ProtectedRoute from
    "./ProtectedRoute";

function AppRoutes() {

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route

                    path="/dashboard"

                    element={

                        <ProtectedRoute>

                            <Dashboard />

                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/upload-resume"
                    element={
                        <ProtectedRoute>
                            <UploadResume />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/jobs"
                    element={
                        <ProtectedRoute>
                            <Jobs />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/rankings"
                    element={
                        <ProtectedRoute>
                            <Rankings />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/analytics"
                    element={
                        <ProtectedRoute>
                            <Analytics />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/reports"
                    element={
                        <ProtectedRoute>
                            <Reports />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/comparison"
                    element={
                        <ProtectedRoute>
                            <CandidateComparison />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/browse-jobs"
                    element={
                        <ProtectedRoute>
                            <BrowseJobs />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/my-resumes"
                    element={
                        <ProtectedRoute>
                            <MyResumes />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/"
                    element={<Landing />}
                />

                <Route
                    path="*"
                    element={<NotFound />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default AppRoutes;