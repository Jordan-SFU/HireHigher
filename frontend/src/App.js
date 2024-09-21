import React from "react";
import { BrowserRouter, createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "./pages/home";
import ChatTest from "./pages/chattest";
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