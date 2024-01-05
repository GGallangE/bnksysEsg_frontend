import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import AsyncSelect from 'react-select/async';


function ApiKeyDetail(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const [sitenm, setSiteNm] = useState('');
  const [apikey, setApiKey] = useState('');
  const [strdt, setStrdt] = useState('');
  const [edt, setEdt] = useState('');
  const [apiSites, setApiSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState(null);

  useEffect(() => {
    const fetchApiKeyDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get('/spring/admin/api/key', {
          params: { apikeyid: props.selectedItem }
        });
        const data = response.data.data.data[0];
        setSearchResults(response.data.data.data[0]); 
        setSiteNm(data.sitenm || '');
        setApiKey(data.apikey || '');
        setStrdt(data.strdt || '');
        setEdt(data.edt || '');

        if(data.sitenm) {
          setSelectedSite({ label: data.sitenm, value: data.sitedvcd }); 
        }
      } catch (error) {
        console.error("Error", error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (props.selectedItem) {
      fetchApiKeyDetails();
    } else {
      resetFormFields();
    }
  }, [props.selectedItem]);

  const handleSave = async () => {
    setIsLoading(true);

    let payload = {
      apikeyid: props.selectedItem || 0,  
      sitedvcd: selectedSite ? selectedSite.value : '', 
      apikey: apikey,
      strdt: strdt,
      edt: edt
    };

    try {
      const response = await axios.post('/spring/admin/api/key', payload);
      if (response.data.success) {
        alert(response.data.messages.join('\n')); 
      } else {
        alert('Error: ' + response.data.messages.join('\n')); 
      }
    } catch (error) {
      console.error("Error saving API key:", error);
      alert('Failed to save API key: ' + error.message); 
    } finally {
      setIsLoading(false);
      handleClose(); 
    }
  };

  const loadOptions = async (inputValue) => {
    try {
      const response = await axios.get('/spring/admin/api/comcode_search', {
        params: {
          code: 'SITE',  
          codevalue: inputValue  
        }
      });
      return response.data.data.data.map(site => ({
        label: site.codevalue,
        value: site.codelabel,
      }));
    } catch (error) {
      console.error("Error fetching API sites:", error);
      return [];  
    }
  };

  const resetFormFields = () => {
    setSiteNm('');
    setApiKey('');
    setStrdt('');
    setEdt('');
    setSelectedSite('');
  };

  const handleClose = () => {
    resetFormFields();
    props.onHide();
  };

  return (
    <div>
      {isLoading ? (
        <Spinner animation="border" role="status" />
      ) : searchResult ? (
        <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          API KEY 관리
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoading ? (
          <Spinner animation="border" role="status" />
        ) : (
          <Container className="border border-dashed p-3">
            <Form>
              <Form.Group as={Row} className="mb-3">
                  <Form.Label column xs={12}>API 사이트:</Form.Label>
                  <Col xs={12}>
                    <AsyncSelect
                      cacheOptions
                      defaultOptions={apiSites}
                      loadOptions={loadOptions}
                      value={selectedSite}
                      onChange={setSelectedSite}
                      placeholder="API 사이트 검색..."
                    />
                  </Col>
                </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column xs={12}>API KEY:</Form.Label>
                <Col xs={12}>
                  <Form.Control type="text" value={apikey} onChange={e => setApiKey(e.target.value)} />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column xs={12}>KEY 유효기간(시작일):</Form.Label>
                <Col xs={12}>
                  <Form.Control type="text" value={strdt} onChange={e => setStrdt(e.target.value)} />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column xs={12}>KEY 유효기간(종료일):</Form.Label>
                <Col xs={12}>
                  <Form.Control type="text" value={edt} onChange={e => setEdt(e.target.value)} />
                </Col>
              </Form.Group>
            </Form>
          </Container>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleSave}>저장</Button>
        <Button onClick={handleClose}>닫기</Button>
      </Modal.Footer>
    </Modal>
      ) : (
        <div>데이터가 없습니다.</div>
      )}
    </div>
  );
  }

export default ApiKeyDetail;