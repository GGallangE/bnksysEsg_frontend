import React from 'react';
import Chart from "react-apexcharts";
import { Link } from 'react-router-dom';
import { Card, Container, Row, Col } from 'react-bootstrap';

function Visualization(){
    
    const Item = ({ title, imageUrl, link }) => (
        <Card style={{ width: '18rem', marginBottom: '20px' }}>
          <Link to={link}>
            <Card.Img variant="top" src={imageUrl} alt={title} />
            <Card.Body>
              <Card.Title>{title}</Card.Title>
            </Card.Body>
          </Link>
        </Card>
      );

    
    const data = [
      { title: 'Apt', imageUrl: '', filename: 'VisualDetailApt'},
      { title: 'Item 2', imageUrl: '', filename: 'VisualDetailApt'},
      { title: 'Item 3', imageUrl: '', filename: 'VisualDetailApt'},
      { title: 'Item 4', imageUrl: '', filename: 'VisualDetailApt'},
      // ... 추가적인 아이템들
    ];
      
      
    return(
    <Container>
    <Row>
      {data.map((item, index) => (
        <Col key={index} xs={12} md={6} lg={4}>
          <Item title={item.title} imageUrl={item.imageUrl} link={`/openapi/visualdetail/${encodeURIComponent(item.filename)}`} />
        </Col>
      ))}
    </Row>
  </Container>
    );
};

export default Visualization;