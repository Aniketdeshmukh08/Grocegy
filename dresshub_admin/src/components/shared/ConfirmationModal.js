import Modal from 'react-bootstrap/Modal';

export const ConfirmationModal = (props) => {
  const isDelete = props.operationType?.toLowerCase() === 'delete';
  const actionColor = isDelete ? 'danger' : 'success';

  return (
    <Modal
      {...props}
      size="md"
      centered
      backdrop="static"
      className="confirmation-modal"
    >
      <Modal.Header className="bg-light border-bottom-0">
        <Modal.Title className="w-100 text-center text-success fs-5">
          Confirmation Required
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="text-center">
        <p className="text-secondary fs-6 mb-0">{props.modalMessage}</p>
        <p className="text-secondary fs-6 mb-0">{props.modalAmmountMsg}</p>
      </Modal.Body>

      <Modal.Footer className="justify-content-center border-top-0 pb-4">
        <button
          onClick={props.onHide}
          className="btn btn-outline-dark px-4"
        >
          Cancel
        </button>

        {props.wantToAddData && (
          <button
            onClick={props.confirmation}
            className={`btn btn-${actionColor} px-4`}
          >
            {props.operationType}
          </button>
        )}
      </Modal.Footer>
    </Modal>
  );
};
