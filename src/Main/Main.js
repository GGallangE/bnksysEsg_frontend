import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import { Col, Form, Row, Container, ListGroup, Card } from 'react-bootstrap';
import './Main.css';

function Main(){
    
    return(
        <Container>
        <Row className = "justify-content-md-center">
          <Col md = "auto">
            <Form.Group className = "mb-3" controlId = "formGridAddress1">
              <Form.Control style = {{ margin: '150px 0px', width: '500px' }} placeholder = "검색어를 입력하세요" />
            </Form.Group>
          </Col>
          <Col md = "auto">
            <Button style = {{margin: '150px 0px'}} variant = "primary" type = "submit">
              Submit
            </Button>
          </Col>
        </Row>
        <Row className = "justify-content-md-center">
          <Col md = "auto">
            <Card className = "list-card">
            <Card.Body>
            <Card.Title>공지사항</Card.Title>
            <ListGroup className = "list-style">
                <ListGroup.Item><a href="#" className = "link-style"><span className="number-background">1</span> 휴폐업조회</a></ListGroup.Item>
                <ListGroup.Item><a href="#" className = "link-style">2. 사업자조회</a></ListGroup.Item>
                <ListGroup.Item><a href="#" className = "link-style">링크</a></ListGroup.Item>
                <ListGroup.Item><a href="#" className = "link-style">링크</a></ListGroup.Item>
                <ListGroup.Item><a href="#" className = "link-style">링크</a></ListGroup.Item>
            </ListGroup>
            </Card.Body>
            </Card>
          </Col>
          <Col md = "auto">
          <Card className = "list-card">
          <Card.Body>
          <Card.Title>인기데이터</Card.Title>
            <ListGroup className = "list-style">
                <ListGroup.Item><a href="#" className = "link-style">링크</a></ListGroup.Item>
                <ListGroup.Item><a href="#" className = "link-style">링크</a></ListGroup.Item>
                <ListGroup.Item><a href="#" className = "link-style">링크</a></ListGroup.Item>
                <ListGroup.Item><a href="#" className = "link-style">링크</a></ListGroup.Item>
                <ListGroup.Item><a href="#" className = "link-style">링크</a></ListGroup.Item>
            </ListGroup>
            </Card.Body>
            </Card>
          </Col>
          <Col md = "auto">
          <Card className = "list-card">
          <Card.Body>
          <Card.Title>최신데이터</Card.Title>
            <ListGroup className = "list-style">
                <ListGroup.Item><a href="#" className = "link-style">링크</a></ListGroup.Item>
                <ListGroup.Item><a href="#" className = "link-style">링크</a></ListGroup.Item>
                <ListGroup.Item><a href="#" className = "link-style">링크</a></ListGroup.Item>
                <ListGroup.Item><a href="#" className = "link-style">링크</a></ListGroup.Item>
                <ListGroup.Item><a href="#" className = "link-style">링크</a></ListGroup.Item>
            </ListGroup>
            </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
};

export default Main;