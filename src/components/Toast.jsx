import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const showToast = (message) => {
  toast(message);
};

export const showInfoToast = (message) => {
  toast.info(message);
};

export const showSuccessToast = (message) => {
  toast.success(message);
};

export const showWarningToast = (message) => {
  toast.warn(message);
};

export const showErrorToast = (message) => {
  toast.error(message);
};

export const ToastWrapper = () => (
  <ToastContainer
    // position="top-center"
    position="bottom-center"
    autoClose={2000}
    hideProgressBar={true}
    pauseOnFocusLoss={false}
    theme="light"
    // theme="colored"
    transition={Slide}
    limit={1}
  />
);
