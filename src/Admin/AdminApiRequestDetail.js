import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Row, Col, Spinner } from 'react-bootstrap';
import AsyncSelect from 'react-select/async';

function AdminApiRequestDetail(props) {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedApiName, setSelectedApiName] = useState(null);
    const [apiRequestDetail, setApiRequestDetail] = useState({
        apilistid: '',
        rqrditemnm: '',
        rqrdrqstnm: '',
        itemexpl: '',
        sort: ''
    });

    useEffect(() => {
        const fetchApiRequestDetails = async () => {
            if (props.selectedItem) {
                setIsLoading(true);
                try {
                    const response = await axios.get('/spring/admin/api/need_request', {
                        params: { apirqrditemsid: props.selectedItem }
                    });
                    const detailData = response.data.data.data[0] || {};
                    setApiRequestDetail(detailData);

                    if(detailData.apilistid && detailData.apinm){
                        setSelectedApiName({
                            value: detailData.apilistid, 
                            label: detailData.apinm      
                        });
                    }

                } catch (error) {
                    console.error("Error:", error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setApiRequestDetail({
                    apilistid: '',
                    rqrditemnm: '',
                    rqrdrqstnm: '',
                    itemexpl: '',
                    sort: ''
                });
                setSelectedApiName(null); 
            }
        };
        fetchApiRequestDetails();
    }, [props.selectedItem]);


    const loadApiNames = async (inputValue) => {
        try {
            const response = await axios.get('/spring/admin/apilist_search', {
                params: { 
                    string: inputValue, 
                }
            });
            return response.data.data.data.map(api => ({
                label: api.apinm, 
                value: api.apilistid  
            }));
        } catch (error) {
            console.error("Error :", error);
            return [];
        }
    };

    const handleInputChange = (e) => {
        setApiRequestDetail({
            ...apiRequestDetail,
            [e.target.id]: e.target.value 
        });
    };

    const handleApiNameChange = (selectedOption) => {
        setSelectedApiName(selectedOption);
        setApiRequestDetail({
            ...apiRequestDetail,
            apilistid: selectedOption ? selectedOption.value : '' 
        });
    };

    const handleSave = async () => {
        setIsLoading(true);
    
        try {
            const response = await axios.post('/spring/admin/api/need_request', apiRequestDetail);
            if (response.data.success) {
                alert(response.data.messages.join('\n')); 
            } else {
                alert('Error: ' + response.data.messages.join('\n')); 
            }
        } catch (error) {
            console.error("Error saving details:", error);
            alert('저장 실패: ' + error.message);
        } finally {
            setIsLoading(false);
            handleClose(); 
        }
    };
    const handleClose = () => {
        props.onHide();
        setApiRequestDetail({
            apilistid: '',
            rqrditemnm: '',
            rqrdrqstnm: '',
            itemexpl: '',
            sort: ''
        });
        setSelectedApiName(null);
    };

    return (
        <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">API Request Detail</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {isLoading ? (
                    <Spinner animation="border" role="status" />
                ) : (
                    <Form>
                        <Row className="mb-3">
                        <Form.Group as={Col} controlId="apilistid">
                            <Form.Label>API 이름</Form.Label>
                            <AsyncSelect
                                cacheOptions
                                loadOptions={loadApiNames}
                                defaultOptions
                                value={selectedApiName}
                                onChange={handleApiNameChange}  
                                placeholder="API 이름 검색"
                            />
                        </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="rqrditemnm">
                                <Form.Label>필수 항목(한글)</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="필수 항목(한글) 입력해주세요" 
                                    value={apiRequestDetail.rqrditemnm} 
                                    onChange={handleInputChange} 
                                />
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="rqrdrqstnm">
                                <Form.Label>필수 항목(영어)</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="필수 항목(영어) 입력해주세요" 
                                    value={apiRequestDetail.rqrdrqstnm} 
                                    onChange={handleInputChange} 
                                />
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="itemexpl">
                                <Form.Label>설명</Form.Label>
                                <Form.Control 
                                    as="textarea"
                                    placeholder="보내야하는 타입(설명)을 적어주세요" 
                                    value={apiRequestDetail.itemexpl} 
                                    onChange={handleInputChange} 
                                />
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="sort">
                                <Form.Label>정렬</Form.Label>
                                <Form.Control 
                                    type="number" 
                                    placeholder="정렬 순서를 적어주세요" 
                                    value={apiRequestDetail.sort} 
                                    onChange={handleInputChange} 
                                />
                            </Form.Group>
                        </Row>
                    </Form>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>닫기</Button>
                <Button variant="primary" onClick={handleSave}>저장</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default AdminApiRequestDetail;
