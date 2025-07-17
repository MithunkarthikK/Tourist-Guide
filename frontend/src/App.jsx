import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Place from "./pages/Place";
import PlaceDetails from "./pages/PlaceDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/places" element={<Place />} />
        <Route path="/places/:id" element={<PlaceDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
