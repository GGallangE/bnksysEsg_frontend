import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const VisualDetail = () => {
  const { filename } = useParams();
  const [content, setContent] = useState(null);

  useEffect(() => {
    // 동적으로 파일을 import하여 해당 파일의 내용을 가져옵니다.
    import(`./${filename}.js`)
      .then((module) => {
        // import된 모듈에서 필요한 데이터를 추출하여 사용합니다.
        setContent(module.default);
      })
      .catch((error) => {
        console.error(`Error loading ${filename}.js:`, error);
        setContent(`Unable to load ${filename}.js`);
      });
  }, [filename]);

  return (
    <div>
      {/* <h2>{title}</h2> */}
      <div>{content}</div>
    </div>
  );
};

export default VisualDetail;