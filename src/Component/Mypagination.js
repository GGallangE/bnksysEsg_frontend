// MyApiPagination.js

import React from "react";
import { Pagination, Box } from "@mui/material";

function MyApiPagination(props) {
  const LAST_PAGE =
    props.totalpage % props.pageOption === 0
      ? parseInt(props.totalpage / props.pageOption)
      : parseInt(props.totalpage / props.pageOption) + 1;
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (event, page) => {
    console.log(page);
    setCurrentPage(page);
  };

  useEffect(() => {
    props.handleSearch();
  }, [currentPage]);

  return (
    <Box margin="50px" display="flex" justifyContent="center" mt={3}>
      <Pagination
        page={currentPage}
        count={LAST_PAGE}
        defaultPage={1}
        onChange={handlePageChange}
      />
    </Box>
  );
}

export default MyApiPagination;
