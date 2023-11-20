import React, { useState, useEffect } from 'react';

function FormatCode({ applydvcd }) {
  const [formattedStatus, setFormattedStatus] = useState(null);

  useEffect(() => {
    // applydvcd가 변경될 때마다 상태를 업데이트
    if (applydvcd === '01') {
      setFormattedStatus('검토중');
    } else if (applydvcd === '02') {
      setFormattedStatus('반려');
    } else {
      setFormattedStatus('승인');
    }
  }, [applydvcd]);

  return formattedStatus;
}

export default FormatCode;