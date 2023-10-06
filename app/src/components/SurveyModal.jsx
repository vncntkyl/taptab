import PropTypes from "prop-types";
import { Modal } from "flowbite-react";
import { modalTheme } from "../functions/CustomThemes";
import SurveyForm from "./SurveyForm";

function SurveyModal({ modal, setModal }) {
  const handleClose = () => {
    setModal({
      toggle: false,
      title: null,
    });
  };
  return (
    modal.toggle && (
      <Modal
        position="center"
        show={modal.toggle}
        dismissible
        onClose={handleClose}
        size="5xl"
        theme={modalTheme}
      >
        <Modal.Header className="border-b-default-dark p-3 px-4 capitalize">
          {modal.title}
        </Modal.Header>
        <Modal.Body>
          <SurveyForm />
        </Modal.Body>
      </Modal>
    )
  );
}

SurveyModal.propTypes = {
  modal: PropTypes.object,
  setModal: PropTypes.func,
};

export default SurveyModal;
