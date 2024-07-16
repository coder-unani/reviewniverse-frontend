import { createBrowserRouter } from "react-router-dom";

import MainRoutes from "/src/routes/MainRoutes";
import PrivateRoutes from "/src/routes/PrivateRoutes";
import SearchRoutes from "/src/routes/SearchRoutes";

const router = createBrowserRouter([MainRoutes, PrivateRoutes, SearchRoutes]);

export default router;
