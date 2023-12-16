import React from "react";
import { About, CounterButton, Home } from "modules/main";
import { BrowserRouter, Link, Routes, Route } from "react-router-dom";

function App() {
    return (
        <div>
            <BrowserRouter>
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/about">About</Link>
                        </li>
                    </ul>
                </nav>

                <Routes>
                    <Route path="/" Component={Home} />
                    <Route path="/about" Component={About} />
                </Routes>
            </BrowserRouter>
            <CounterButton />
        </div>
    );
}

export default App;
