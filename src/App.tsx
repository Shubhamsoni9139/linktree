import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.tsx";
import About from "./pages/About";
import AuthPage from "./pages/AuthPage.tsx";
import Profile from "./pages/profile";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<AuthPage />} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
