import Chart from "react-apexcharts";
import { useParams } from 'react-router-dom';
import { Container, Card } from 'react-bootstrap';

function VisualDetailApt(){
    const { title } = useParams();
    return(
        <Container>
      <h2 className="mt-3">상세 페이지</h2>
      <Card style={{ width: '18rem' }} className="mt-3">
        <Card.Body>
          <Card.Title>{decodeURIComponent(title)}</Card.Title>
          <Card.Text>
            상세 내용을 여기에 표시합니다.
          </Card.Text>
        </Card.Body>
      </Card>
      	<Chart
        	type="line" 
            series={ [
                { name: "오늘의 기온",
                  data: [19, 26, 20, 9],
                },
                { name: "내일의 기온",
                  data: [30, 26, 34, 10],
                },
                ]} 
            options={{    
                chart : {
                    height: 500,
                    width: 500,                    
                }, 
            }}>
            </Chart>
            </Container>
    );
};

export default VisualDetailApt;