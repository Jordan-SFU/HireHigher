import { React, useEffect } from "react";
import { BrowserRouter, createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "./pages/home";
import ChatTest from "./pages/chattest";
import Setup from "./pages/setup";
import Interview from "./pages/interview";
import StartConfirmation from "./pages/start_confirmation";
import Results from "./pages/results";
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
            path: "/interview",
            element: <Interview />
        },
        {
          path: "/start",
          element: <StartConfirmation />
        },
        {
          path: "/results",
          element: <Results />
        }
    ]
);

function App() {
      useEffect(() => {
        fetch('18.219.68.51:3000/api/').then(
          (response) => console.log(response)
        );
    }, []);    
    return (
        <div className="App">
            <RouterProvider router={router} />
        </div>
    );
}

export default App;