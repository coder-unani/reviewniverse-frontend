import { createPortal } from "react-dom";

const ModalContainer = (props) => {
  const { children } = props;
  return createPortal(<>{children}</>, document.getElementById("modal"));
};

export default ModalContainer;
