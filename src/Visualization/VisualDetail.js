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