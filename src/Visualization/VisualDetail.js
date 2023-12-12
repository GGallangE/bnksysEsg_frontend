import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import VisualDetailApt from './VisualDetailApt';
import Visualization from './Visualization';


const VisualDetail = () => {
  debugger
  const {filename} = useParams();
  const [ content, setContent ] = useState(null);

  useEffect(() => {
    debugger
    setContent(importPage(filename))
    
  //   // 동적으로 파일을 import하여 해당 파일의 내용 가져오기
  //   import(`./${filename}.js`)
  //     .then((module) => {
  //       // import된 모듈에서 필요한 데이터를 추출하여 사용
  //       debugger
          
  //     })
  //     .catch((error) => {
  //       console.error(`Error loading ${filename}.js:`, error);
  //       setContent(`Unable to load ${filename}.js`);
  //     });

      
  }, [filename]);

  return (
    <div>
      <div>;akldfbaebghji;ag</div>
      <div>{content}</div>
      {/* <div><VisualDetailApt/></div> */}
    </div>
  );
};

function importPage(filename){
  debugger
  import(`./${filename}.js`)
  return module.default;
}
export default VisualDetail;