import React, { useState, useEffect } from 'react';

function FormatCode({ code, value }) {
  const [formattedStatus, setFormattedStatus] = useState(null);

  useEffect(() => {
    if (code === "apply") {
      setFormattedStatus(getapplyStatus(value));
    } else if (code === "frequency") {
      setFormattedStatus(getFreKorean(value));
    } else if (code === "day") {
      setFormattedStatus(getDayKorean(value));
      console.log(formattedStatus)
    }
  }, [code, value]);

  const getapplyStatus = (value) => {
    if (value === '01') {
      return '검토중';
    } else if (value === '02') {
      return '반려';
    } else {
      return '승인';
    }
  };

  const getFreKorean = (value) => {
    switch (value) {
      case 'monthly':
        return '매달';
      case 'weekly':
        return '매주';
      case 'daily':
        return '매일';
      default:
        return '';
    }
  };

  const getDayKorean = (value) => {
    switch (value) {
      case 'MON':
        return '월';
      case 'TUE':
        return '화';
      case 'WED':
        return '수';
      case 'THU':
        return '목';
      case 'FRI':
        return '금';
      case 'SAT':
        return '토';
      case 'SUN':
        return '일';
      default:
        return '';
    }
  };


  return formattedStatus;
}

export default FormatCode;