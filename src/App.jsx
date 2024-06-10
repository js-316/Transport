import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {Login} from "@pages";
import AuthLayout from "@layouts/AuthLayout";

function App() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <AuthLayout/>,
            children: [
                {
                    path: "/",
                    element: <Login/>
                }
            ]
        }
    ]);

    return (
        <RouterProvider router={router} />
    )
}

export default App
