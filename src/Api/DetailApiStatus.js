import React, { useEffect, useState, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './DetailApiStatus.css';
import FormatDate from '../Format/FormatDate';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';

function DetailApiStatus() {
  const { apilistid } = useParams();
  const [searchResults, setSearchResults] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ApiInfo = async () => {
      try {
        const response = await axios.get(`/spring/connection/result/${apilistid}`)
        console.log(response);
        setSearchResults(response.data.data[0]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching API details: ", error);
      }
    };

    const ApiUsecase = async () => {
      try {
        const response = await axios.get(`/spring/usecase/apidetail?apilistid=${apilistid}`)
        setSearchResults(response.data.data[0]);
        //setLoading(false);
      } catch (error) {
        console.error("Error fetching API details: ", error);
      }
    };

    ApiInfo();
    //ApiUsecase();
  }, [apilistid]);

  const DynamicComponent = React.lazy(() =>
    import(`./DetailData1`).then((module) => ({
      default: () => <module.default apilistid={apilistid} methodtype={searchResults.methodtype}/>,
    }))
  );
  const boxStyle = {
    border: '2px solid #000',
    padding: '20px',
    borderRadius: '10px',
  };
  return (
    <div style={{ padding: '10px', background: '#d7e7af7a' }}>
      <h3>{searchResults.apiname}</h3>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <div class="wrap-a">
            <div class="wrap-cont">
              <section class="main-content-renewal-wide">
                <div class="box-base">
                  <div class="main-content-renewal01">
                    <textarea id="clip_target" style={{ position: 'absolute', top: '-9999em' }} title="URL복사" tabindex="-1"></textarea>
                    {/* <h1>img</h1> */}
                    {/* <h1 class="side-detail-head"><b>보건</b></h1> */}
                    <strong class="main-content-ctg">
                      <p>{searchResults.prvorg}</p>
                    </strong>
                  </div>
                  <div class="main-content-renewal02">
                    <h1 class="main-content-tit">{searchResults.apinm}
                    </h1>
                    <div class="main-content-txt">
                      <p>{searchResults.apiexpl}</p>
                      <p style={{ fontSize: '13px' }}>등록날짜: <FormatDate dateString={searchResults.apirgdt} /></p>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <p><VisibilityOutlinedIcon /> {searchResults.apiview}</p>
                        <p><FileDownloadOutlinedIcon /> {searchResults.countapiuses}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}

      <Suspense fallback={<div>Loading...</div>}>
        <DynamicComponent />
      </Suspense>
    </div>
  );
}

export default DetailApiStatus;
