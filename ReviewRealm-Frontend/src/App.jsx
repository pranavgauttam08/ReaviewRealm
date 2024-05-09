import "./App.css";
import { Route, Routes, Navigate } from "react-router-dom";

// Component Imports
import NavbarComponent from "./components/NavbarComponent";
import HomePage from "./Pages/Home/HomePage";
import AboutPage from "./Pages/Home/AboutPage";
import Generate from "./Pages/Services/Generate";
import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";
import FooterComponent from "./components/FooterComponent";
import NotFoundPage from "./Pages/NotFoundPage";

// Protected Component
function ProtectedRoute({ element }) {
  const isAuthenticated = localStorage.getItem("jwt");
  return isAuthenticated ? element : <Navigate to="/login" />;
}

function App() {
  return (
    <div className="App h-screen sm:w-full">
      <NavbarComponent />

      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/about" element={<AboutPage />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route
          path="/generate"
          element={<ProtectedRoute element={<Generate />} />}
        />
        /* <Route path="/*" element={<NotFoundPage />}></Route> */
      </Routes>
      <FooterComponent />
    </div>
  );
}

export default App;
{
  /* <Route path="/movie/:movie_id" element={<MoviePage />}></Route> */
}
{
  /* <Route path="/profile/:profile_id" element={<ProfilePage />}></Route> */
}
{
  /* <Route path="/register" element={<RegisterPage />}></Route> */
}
{
  /* <Route path="/search" element={<SearchedMoviesPage />}></Route> */
}
{
}
