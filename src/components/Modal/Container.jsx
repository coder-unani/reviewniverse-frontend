import { createPortal } from "react-dom";

const ModalContainer = ({ children }) => {
  return createPortal(<>{children}</>, document.getElementById("modal"));
};

export default ModalContainer;
