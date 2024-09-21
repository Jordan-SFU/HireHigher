import React from "react";
import { BrowserRouter, createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "./pages/home";
import ChatTest from "./pages/chattest";
import Setup from "./pages/setup";
import StartConfirmation from "./pages/start_confirmation";
import "./styles/App.css";

const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <Home />
        },
        {
          path: "/chattest",
          element: <ChatTest />
        },
        {
          path: "/setup",
          element: <Setup />
        },
        {
          path: "/start",
          element: <StartConfirmation />
        }
    ]
);

function App() {
    return (
        <div className="App">
            <RouterProvider router={router} />
        </div>
    );
}

export default App;