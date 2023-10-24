import React from 'react';
import { useParams } from 'react-router-dom';

function DetailApi_Status() {
  const {apilistid} = useParams();

  return (
    <h3>{apilistid} 맞습니다!</h3>
  );
}

export default DetailApi_Status;
