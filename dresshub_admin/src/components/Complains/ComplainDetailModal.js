import Modal from 'react-bootstrap/Modal';

export const ComplainDetailModal = props => {
  const resolveStatus = props.details.resolvestatus == "Pending" ? 0 : 1;
  
  const currentStatusColor = resolveStatus == 0 ? 'danger' : 'success';
  const otherStatusColor = resolveStatus == 1 ? 'danger' : 'success';
  const GetState = (state) => {
    return state ? 'Resolved' : 'Pending';
  }
  const UpdateModal = () => {
    props.toggleState()
    props.onHide()
  }
  console.log(props.details)
  return (
    <Modal
      {...props}
      size='md'
      centered
      backdrop='static'
      className='ComplainDetailModal'
    >
      <Modal.Header className='bg-light border-bottom-0'>
        <Modal.Title className='w-100 text-center text-success fs-5'>
          Complain Details
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className='text-center'>
        {(<p className='text-secondary fs-6 mb-0'>Complain ID: {props.details.complainid}</p>)}
        {props.details.orderid ? (<p className='text-secondary fs-6 mb-0'>Order ID: {props.details.orderid}</p>) : null}
        {props.details.name ? (<p className='text-secondary fs-6 mb-0'>Name: {props.details.name}</p>) : ''}
        {props.details.mobile ? (<p className='text-secondary fs-6 mb-0'>Mobile No.: {props.details.mobile}</p>) : ''}
        {props.details.subject ? (<p className='text-secondary fs-6 mb-0'>Subject: {props.details.subject}</p>) : ''}
        {props.details.complain_desc ? (<p className='text-secondary fs-6 mb-0'>Description: {props.details.complain_desc}</p>) : ''}
        {(<p className='text-secondary fs-6 mb-0'>Current Status:  <strong className={`text-${currentStatusColor}`}>{GetState(resolveStatus)}</strong></p>)}
      </Modal.Body>

      <Modal.Footer className='justify-content-center border-top-0 pb-4'>
        {/* <h4>Update- </h4> */}
        {/* <p className='text-primary fs-8 mb-0'>Change Resolve Status to -</p> */}
        <button
          onClick={UpdateModal}
          className={`btn btn-${otherStatusColor} px-4`}
        >
          {GetState(!resolveStatus)}
        </button>

        <button onClick={props.onHide} className='btn btn-outline-dark px-4'>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
};
