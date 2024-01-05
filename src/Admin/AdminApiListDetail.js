import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FormatDate from '../Format/FormatDate'
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';

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
  const [dataformat, setDataFormat] = useState(null);
  const [apikeyword, setApiKeyword] = useState(null);
  const [sitedvcd, setSiteDvcd] = useState(null);
  const [usedvcd, setUseDvcd] = useState(null);
  const [methodtype, setMethodType] = useState(null);
  const [apiurl, setApiUrl] = useState(null);
  const [selectedUseStatus, setSelectedUseStatus] = useState(null); 
  const [selectedSite, setSelectedSite] = useState(null); 

  const handleSearch = async () => {
    setApiNM('');
    setPrvorg('');
    setApiExpl('');
    setDataFormat('');
    setApiKeyword('');
    setSiteDvcd('');
    setUseDvcd('');
    setMethodType('');
    setApiUrl('');
    setSelectedUseStatus('');
    setSelectedSite('');
    setIsLoading(true);
    try {
        if (apilistid != null) {
            const response = await axios.get('/spring/admin/apilist', {
                params: {
                  apilistid: apilistid
                }
            });
            const data = response.data.data.data[0];
            setSearchResults(data);
            setApiNM(data.apinm || '');
            setPrvorg(data.prvorg || '');
            setApiExpl(data.apiexpl || '');
            setDataFormat(data.dataformat || '');
            setApiKeyword(data.apikeyword || '');
            setSiteDvcd(data.sitedvcd || '');
            setUseDvcd(data.usedvcd || '');
            setMethodType(data.methodtype || '');
            setApiUrl(data.apiurl || '');
            // setApiapplyid(response.data.data.data[0].apiapplyid);

            if(data.sitedvcd) {
              const siteLabel = await getLabelForValue(data.sitedvcd, 'SITE');
              setSelectedSite({ value: data.sitedvcd, label: siteLabel });
            }

            if (data.usedvcd) {
              const useStatusLabel = await getLabelForValue(data.usedvcd, 'USE');
              setSelectedUseStatus({ value: data.usedvcd, label: useStatusLabel });
            }

            console.log(response);
        }
    } catch (error) {
        console.error("Error searching: ", error);
    } finally {
        setIsLoading(false);
    }
};

async function getLabelForValue(value, codeType) {
  const options = await loadOptions('', codeType);  
  const option = options.find(opt => opt.value === value);
  return option ? option.label : '';
}

const loadOptions = async (inputValue, codeType) => {
  try {
    const response = await axios.get('/spring/admin/api/comcode_search', {
      params: {
        code: codeType, 
        codevalue: inputValue  
      }
    });
    return response.data.data.data.map(item => ({
      label: item.codevalue,  
      value: item.codelabel,  
    }));
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];  
  }
};

    const handleSave = async () => {
      try {
        const result = await axios.post('/spring/admin/apilist/save', {
          apilistid: apilistid,
          apinm: apinm,
          prvorg: prvorg,
          apiexpl: apiexpl,
          dataformat: dataformat,
          apikeyword: apikeyword,
          sitedvcd: selectedSite ? selectedSite.value : '',
          usedvcd: selectedUseStatus ? selectedUseStatus.value : '',
          methodtype: methodtype,
          apiurl : apiurl,
          // apiapplyid: selectedApi.value, 
        });
          setApiNM('');
          setPrvorg('');
          setApiExpl('');
          setDataFormat('');
          setApiKeyword('');
          setSiteDvcd('');
          setUseDvcd('');
          setMethodType('');
          setApiUrl('');
          setSelectedUseStatus('');
          setSelectedSite('');
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
        setDataFormat('');
        setApiKeyword('');
        setSiteDvcd('');
        setUseDvcd('');
        setMethodType('');
        setApiUrl('');
        setSelectedUseStatus('');
        setSelectedSite('');
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
                    데이터 형식:
                  </Form.Label>
                  <Col xs={12}>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={dataformat}
                      onChange={(e) => setDataFormat(e.target.value)}
                    />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                  <Form.Label column xs={12}>
                    키워드:
                  </Form.Label>
                  <Col xs={12}>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={apikeyword}
                      onChange={(e) => setApiKeyword(e.target.value)}
                    />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                  <Form.Label column xs={12}>API 사이트:</Form.Label>
                  <Col xs={12}>
                    <AsyncSelect
                      cacheOptions
                      defaultOptions
                      loadOptions={(inputValue) => loadOptions(inputValue, 'SITE')}
                      value={selectedSite}
                      onChange={setSelectedSite}
                      placeholder="API 사이트 검색"
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column xs={12}>사용상태:</Form.Label>
                  <Col xs={12}>
                    <AsyncSelect
                      cacheOptions
                      defaultOptions
                      loadOptions={(inputValue) => loadOptions(inputValue, 'USE')}
                      value={selectedUseStatus}
                      onChange={setSelectedUseStatus}
                      placeholder="사용상태 검색"
                    />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                  <Form.Label column xs={12}>
                    다운가능 메소드:
                  </Form.Label>
                  <Col xs={12}>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={methodtype}
                      onChange={(e) => setMethodType(e.target.value)}
                    />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                  <Form.Label column xs={12}>
                    API 요청 URL:
                  </Form.Label>
                  <Col xs={12}>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={apiurl}
                      onChange={(e) => setApiUrl(e.target.value)}
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