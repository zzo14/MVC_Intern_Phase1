import { useState, useMemo } from 'react';

const useSortedPaginatedData = (data, defaultSortColumn) => {
  const [sortColumn, setSortColumn] = useState(defaultSortColumn);
  const [sortDirection, setSortDirection] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortColumn) {
      return data;
    }
    return [...data].sort((a, b) => {
      if (a[sortColumn] < b[sortColumn]) {
        return sortDirection === "ascending" ? -1 : 1;
      }
      if (a[sortColumn] > b[sortColumn]) {
        return sortDirection === "ascending" ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortColumn, sortDirection]);

  // Paginate sorted data
  const paginatedData = useMemo(() => {
    const firstPageIndex = currentPage * pageSize;
    const lastPageIndex = firstPageIndex + pageSize;
    return sortedData.slice(firstPageIndex, lastPageIndex);
  }, [pageSize, currentPage, sortedData]);

 
  const handleSort = (clickedColumn) => {
    if (sortColumn !== clickedColumn) {
      setSortColumn(clickedColumn);
      setSortDirection('ascending');
      return;
    }

    // If the same column is clicked, reverse the sort direction or remove sort
    switch (sortDirection) {
      case 'ascending':
        setSortDirection('descending');
        break;
      case 'descending':
        setSortColumn(null);
        setSortDirection(null);
        break;
      default:
        setSortColumn(clickedColumn);
        setSortDirection('ascending');
    }
  };

return {
  sortedData: paginatedData, currentPage, setCurrentPage, pageSize, setPageSize, handleSort, sortColumn, sortDirection
}
};

export default useSortedPaginatedData;