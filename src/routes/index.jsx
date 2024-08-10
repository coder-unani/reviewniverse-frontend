import { createBrowserRouter } from "react-router-dom";

import MainRoutes from "/src/routes/MainRoutes";
import PrivateRoutes from "/src/routes/PrivateRoutes";

const router = createBrowserRouter([MainRoutes, PrivateRoutes]);

export default router;
