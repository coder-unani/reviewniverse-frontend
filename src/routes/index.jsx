import { createBrowserRouter } from "react-router-dom";

import MainRoutes from "/src/routes/MainRoutes";
import SearchRoutes from "/src/routes/SearchRoutes";
import UserRoutes from "/src/routes/UserRoutes";

const router = createBrowserRouter([MainRoutes, SearchRoutes, UserRoutes]);

export default router;
