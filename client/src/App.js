import React from "react";
import {BrowserRouter , Routes, Route } from "react-router-dom";
import { SocketProvider } from "./context/SocketProvider";
import "./stylesheets/styles.css";
import 'react-tooltip/dist/react-tooltip.css'

import HomeScreen from "./screens/Home";
import RoomPage from "./screens/Room";

function App() {
  return (
    <>
      <SocketProvider>
        <BrowserRouter>
          <Routes>
           <Route path="/" element={<HomeScreen />} />
           <Route path="/room/:roomId" element={<RoomPage />} />
          </Routes>
        </BrowserRouter>
      </SocketProvider>
    </>
  );
}

export default App;
