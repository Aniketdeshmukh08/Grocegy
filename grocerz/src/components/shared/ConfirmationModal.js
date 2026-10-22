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
            contentClassName="rounded-4 border-0 overflow-hidden"
        >
            <Modal.Header className="bg-light border-bottom-0">
                <Modal.Title className="w-100 text-center text-success" style={{ fontSize: '24px' }}>
                    {props.title || 'Confirmation Required'}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body className="text-center py-4">
                <p className="text-secondary mb-0" style={{ fontSize: '18px' }}>{props.modalMessage}</p>
                <p className="text-secondary mb-0" style={{ fontSize: '18px' }}>{props.modalAmmountMsg}</p>
            </Modal.Body>

            <Modal.Footer className="justify-content-center border-top-0 pb-4 mt-3">
                {!props.hideCancel && (
                    <button
                        type="button"
                        onClick={props.onHide}
                        className="btn btn-outline-dark"
                        style={{ fontSize: '18px', padding: '8px 24px' }}
                    >
                        {props.cancelText || 'Cancel'}
                    </button>
                )}

                {props.wantToAddData && (
                    <button
                        type="button"
                        onClick={props.confirmation}
                        className={`btn btn-${actionColor}`}
                        style={{ fontSize: '18px', padding: '8px 24px' }}
                    >
                        {props.operationType}
                    </button>
                )}
            </Modal.Footer>
        </Modal>
    );
};
