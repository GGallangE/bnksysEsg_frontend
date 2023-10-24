import React from 'react';
import { useParams } from 'react-router-dom';

function ResultDetail(props) {
  const apilistid = useParams();

  return (
    <div>
      <p>{apilistid} 맞습니다!</p>
      asdasdsad
    </div>
  );
}

export default ResultDetail;
