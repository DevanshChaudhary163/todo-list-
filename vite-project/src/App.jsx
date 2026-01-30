import "./App.css";
import Home from "../pages/home";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <main className="main-content">
      <Routes>
        <Route path="/" element={<Home />}></Route>
      </Routes>
    </main>
  );
}

export default App;
