import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Row, Col, Spinner } from 'react-bootstrap';
import AsyncSelect from 'react-select/async';

function AdminApiResponseDetail(props) {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedApiName, setSelectedApiName] = useState(null);
    const [apiResponseDetail, setApiResponseDetail] = useState({
        apilistid: '',
        krnm: '',
        ennm: ''
    });

    useEffect(() => {
        const fetchApiResponseDetails = async () => {
            if (props.selectedItem) {
                setIsLoading(true);
                try {
                    const response = await axios.get('/spring/admin/api/need_response', {
                        params: { apirsqeitemsid: props.selectedItem }
                    });
                    const detailData = response.data.data.data[0] || {};
                    setApiResponseDetail(detailData);

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
                setApiResponseDetail({
                    apilistid: '',
                    krnm: '',
                    ennm: ''
                });
                setSelectedApiName(null); 
            }
        };
        fetchApiResponseDetails();
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
        setApiResponseDetail({
            ...apiResponseDetail,
            [e.target.id]: e.target.value 
        });
    };

    const handleApiNameChange = (selectedOption) => {
        setSelectedApiName(selectedOption);
        setApiResponseDetail({
            ...apiResponseDetail,
            apilistid: selectedOption ? selectedOption.value : '' 
        });
    };

    const handleSave = async () => {
        setIsLoading(true);
    
        try {
            const response = await axios.post('/spring/admin/api/need_response', apiResponseDetail);
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
        setApiResponseDetail({
            apilistid: '',
            krnm: '',
            ennm: ''
        });
        setSelectedApiName(null);
    };

    return (
        <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">API Response Detail</Modal.Title>
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
                            <Form.Group as={Col} controlId="krnm">
                                <Form.Label>한글명</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="한글명을 입력해주세요" 
                                    value={apiResponseDetail.krnm} 
                                    onChange={handleInputChange} 
                                />
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="ennm">
                                <Form.Label>영문명</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="영문명을 입력해주세요" 
                                    value={apiResponseDetail.ennm} 
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

export default AdminApiResponseDetail;
