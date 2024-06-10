import { createBrowserRouter } from "react-router-dom";

import MainRoutes from "/src/routes/MainRoutes";
import UserRoutes from "/src/routes/UserRoutes";

const router = createBrowserRouter([MainRoutes, UserRoutes]);

export default router;
