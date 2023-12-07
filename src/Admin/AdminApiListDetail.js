import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FormatDate from '../Format/FormatDate'
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import Select from 'react-select';


function AdminApiListDetail(props) {
  const [searchResult, setSearchResults] = useState([]);
  const apilistid = props.selectedItem;
  const [isLoading, setIsLoading] = useState(true);
  const [searchApiName, setSearchApiName] = useState([]);
  const [selectedApi, setSelectedApi] = useState(null);

  const [apinm, setApiNM] = useState(null);
  const [prvorg, setPrvorg] = useState(null);
  const [apiexpl, setApiExpl] = useState(null);
  const [apiapplyid, setApiapplyid] = useState(null);
  const [applynm, setApplyNm] = useState('');

  const handleSearch = async () => {
    setApiNM('');
    setPrvorg('');
    setApiExpl('');
    setIsLoading(true);
    try {
        if (apilistid != null) {
            const response = await axios.get('/spring/admin/apilist', {
                params: {
                  apilistid: apilistid
                }
            });
            setSearchResults(response.data.data.data[0]);
            setApiNM(response.data.data.data[0].apinm || '');
            setPrvorg(response.data.data.data[0].prvorg || '');
            setApiExpl(response.data.data.data[0].apiexpl || '');
            // setApiapplyid(response.data.data.data[0].apiapplyid);
            console.log(response);
        }
    } catch (error) {
        console.error("Error searching: ", error);
    } finally {
        setIsLoading(false);
    }
};

    const handleSave = async () => {
      try {
        const result = await axios.post('/spring/admin/apilist/save', {
          apilistid: apilistid,
          apinm: apinm,
          prvorg: prvorg,
          apiexpl: apiexpl,
          apiapplyid: selectedApi.value, 
        });
        alert('API 목록이 저장되었습니다.');
      } catch (error) {
        console.log(error);
      }
      props.onHide();
    };  

    const handleApiNameSearch = async (apiName) => {
      try {
        const response = await axios.get('/spring/admin/apiapplylist_byname', {
          params: {
            applynm: apiName,
          },
        });
        console.log(response);
        setSearchApiName(response.data.data.data.map(apply => ({
          value: apply.apiapplyid,  
          label: apply.applynm,
        })));
      } catch (error) {
        console.error("Error searching API names: ", error);
      }
    };

    const handleClose = () => {
        props.onHide();
        setApiNM('');
        setPrvorg('');
        setApiExpl('');
      };
      
  useEffect(() => {
    setIsLoading(true);
    handleSearch();
  }, [apilistid]);

  useEffect(() => {
    handleApiNameSearch(applynm);
  }, [applynm]);


  return (
    <div>
      {isLoading ? (
        <Spinner animation="border" role="status" />
      ) : searchResult ? (
        <Modal
          {...props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              API 신청 상세 관리
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container className="border border-dashed p-3">
              <Form>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column xs={12}>
                    API 이름:
                  </Form.Label>
                  <Col xs={12}>
                    <Form.Control
                      type="text"
                      value={apinm}
                      onChange={(e) => setApiNM(e.target.value)}
                    />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                  <Form.Label column xs={12}>
                    제공기관:
                  </Form.Label>
                  <Col xs={12}>
                    <Form.Control
                      type="text"
                      value={prvorg}
                      onChange={(e) => setPrvorg(e.target.value)}
                    />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                  <Form.Label column xs={12}>
                    API 설명:
                  </Form.Label>
                  <Col xs={12}>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={apiexpl}
                      onChange={(e) => setApiExpl(e.target.value)}
                    />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                  <Form.Label column xs={12}>
                    신청 API 이름:
                  </Form.Label>
                  <Col xs={12}>
                    <Select
                      value={selectedApi}
                      onChange={(option) => {
                        setSelectedApi(option);
                        handleApiNameSearch(option.value);
                      }}
                      options={searchApiName}
                    />
                  </Col>
                </Form.Group>
              </Form>
            </Container>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleSave}>Save</Button>
            <Button onClick={handleClose}>Close</Button>
          </Modal.Footer>
        </Modal>
      ) : (
        <div>데이터가 없습니다.</div>
      )}
    </div>
  );
  }

export default AdminApiListDetail;