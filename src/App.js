import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./routes/home/Home";
import Register from "./routes/register/Register";
import Login from "./routes/login/Login";
import Index from "./routes/index/Index";
import Game from "./routes/game/Game";
import Devtests from "./routes/__devtests/Devtests";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Index />} />
        <Route path='/app' element={<Home />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path="/game" element={<Game />} />
        <Route path="/__devtests" element={<Devtests />} />
      </Routes>
    </BrowserRouter>
  )  
}

export default App;
