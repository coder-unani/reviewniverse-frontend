import { createBrowserRouter } from "react-router-dom";

import NoHeaderRoutes from "/src/routes/NoHeaderRoutes";
import MainRoutes from "/src/routes/MainRoutes";
import PrivateRoutes from "/src/routes/PrivateRoutes";
import SearchRoutes from "/src/routes/SearchRoutes";

const router = createBrowserRouter([NoHeaderRoutes, MainRoutes, PrivateRoutes, SearchRoutes]);

export default router;
