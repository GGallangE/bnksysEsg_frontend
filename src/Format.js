import React from 'react';

function FormatDate({ dateString }){
    
    const year = dateString.slice(0, 4);
    const month = dateString.slice(4, 6);
    const day = dateString.slice(6, 8);

    const formattedDate = `${year}년 ${month}월 ${day}일`;

    return(
        <p>등록날짜: {formattedDate}</p>
    );
}

export default FormatDate;