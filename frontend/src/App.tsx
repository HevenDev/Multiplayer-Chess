import { BrowserRouter, Routes, Route } from "react-router-dom";
import {Game} from "./screens/Game";
import {Landing} from "./screens/Landing";

function App() {
  return (
    <div className="bg-slate-950 h-screen">
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/game" element={<Game />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App
