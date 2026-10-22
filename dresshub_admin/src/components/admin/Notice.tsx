import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Container, Row, Col, ListGroup } from 'react-bootstrap';

type Notice = {
  notice_name: string;
  start_date: string;
  end_date: string;
  notice_id: any;
  status: number;
  notice_desc: string;
};

const AdminNotice: React.FC = () => {
  const [noticeId, setNoticeId] = useState('');
  const [noticeTopic, setNoticeTopic] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [dueDate, setDueDate] = useState('');
  const [sentNotices, setSentNotices] = useState<Notice[]>([]);
  const [allSentNotices, setAllSentNotices] = useState<Notice[]>([]);
  const [successNotification, setSuccessNotification] = useState(false);
  const [disableNotification, setDisableNotification] =
    useState<boolean>(false);

  const fetchNotices = async () => {
    try {
      const response = await axios.get<Notice[]>(
        process.env.REACT_APP_API_URL + 'notice/allnotices'
      );
      const activeNotices = response.data.filter(notice => notice.status === 1);
      const sortedNotices = response.data.sort(
        (a, b) =>
          new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
      );
      setNotices(response.data);
      setSentNotices(response.data);
      setAllSentNotices([...activeNotices, ...sortedNotices]);
    } catch (error) {
      console.error('Error fetching notices:', error);
    }
  };

  useEffect(() => {
    //console.log('fetching notifications....................')
    fetchNotices();
  }, [disableNotification, successNotification]);

  const sendNoticeToStudent = async () => {
    try {
      if (!noticeTopic.trim() || !dueDate || !noticeContent.trim()) {
        console.warn('Notice message and due date cannot be empty.');
        return;
      }
      const currentDate = new Date().toISOString();
      let obj = {
        notice_name: noticeTopic,
        notice_desc: noticeContent,
        start_date: currentDate,
        end_date: dueDate,
        ui_active: 1,
        user_type: 'student',
        status: 1,
      };
      const response = await axios.post(
        process.env.REACT_APP_API_URL + 'notice/createnotice',
        obj
      );

      setSuccessNotification(true);
      setNoticeTopic('');
      setNoticeContent('');
      setDueDate('');
    } catch (error) {
      console.error('Error sending notice:', error);
    }
  };

  const disableNotice = async (noticeId: number) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}notice/removenotice/${noticeId}`
      );
      setNotices(prevNotices => {
        const updatedNotices = prevNotices.map(n => {
          if (n.notice_id === noticeId) {
            return { ...n, status: 0 };
          }
          return n;
        });
        return updatedNotices;
      });
      setSuccessNotification(true);

      setTimeout(() => {
        setDisableNotification(false);
      }, 3000);
    } catch (error) {
      console.error('Error disabling notice:', error);
    }
  };
  const openNoticeModal = (notice: Notice) => {
    setSelectedNotice(notice);
    setShowModal(true);
  };

  const closeNoticeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <Row>
        <Col md={6}>
          <div>
            <h2>Create Notice</h2>
            <div className='mb-3'>
              <label>Notice ID:</label>
              <input
                type='text'
                value={noticeId}
                onChange={e => setNoticeId(e.target.value)}
              />
            </div>
            <div className='mb-3'>
              <label>Notice Topic:</label>
              <input
                type='text'
                value={noticeTopic}
                onChange={e => setNoticeTopic(e.target.value)}
              />
            </div>
            <div className='mb-3'>
              <label>Notice Content:</label>
              <textarea
                value={noticeContent}
                onChange={e => setNoticeContent(e.target.value)}
                rows={7}
                cols={50}
                style={{ verticalAlign: 'top' }}
              />
            </div>
            <div className='mb-3'>
              <label>Due Date:</label>
              <input
                type='date'
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
              />
            </div>
            <Button variant='primary' onClick={sendNoticeToStudent}>
              Send Notice
            </Button>
            <br></br>
            {successNotification && <p>Notice sent successfully!</p>}
          </div>
        </Col>

        <Col md={6}>
          <div>
            <h2>Manage Sent Notices</h2>
            <div className='notice-list'>
              <ListGroup>
                {notices.map(notice => (
                  <ListGroup.Item key={notice.notice_id}>
                    <p style={{ color: 'black' }}>{notice.notice_name}</p>
                    <Button
                      variant='primary'
                      onClick={() => openNoticeModal(notice)}
                    >
                      View Notice
                    </Button>
                    {notice.status === 1 && (
                      <Button
                        variant='danger'
                        className='ml-2'
                        onClick={() => disableNotice(notice.notice_id)}
                      >
                        Disable Notice
                      </Button>
                    )}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          </div>
        </Col>
      </Row>

      <Modal show={showModal} onHide={closeNoticeModal}>
        <Modal.Header>
          <Modal.Title>{selectedNotice?.notice_name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h6>
            Start Date:{' '}
            {selectedNotice?.start_date &&
              new Date(selectedNotice.start_date).toDateString()}
          </h6>
          <h6>
            End Date:{' '}
            {selectedNotice?.end_date &&
              new Date(selectedNotice.end_date).toDateString()}
          </h6>
          <p style={{ color: 'black' }}>
            Notice: {selectedNotice?.notice_desc}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={closeNoticeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AdminNotice;
