interface Props {
  rowsPerPage: number;
  currentPage: number;
  pageNumbers: number[];
  handleRowLimitSelectChange: (value: string) => void;
  handlePageSelectChange: (value: string) => void;
}

export function TableControls({
  rowsPerPage,
  currentPage,
  pageNumbers,
  handleRowLimitSelectChange,
  handlePageSelectChange,
}: Props) {
  return (
    <>
      <label htmlFor="row-limit-select">Row limit:</label>
      <select
        id="row-limit-select"
        name="Row limit"
        value={rowsPerPage}
        onChange={(event) => handleRowLimitSelectChange(event.target.value)}
      >
        <option value="10">10</option>
        <option value="50">50</option>
        <option value="100">100</option>
        <option value="500">500</option>
      </select>
      <label htmlFor="page-select">Page:</label>
      <select
        id="page-select"
        name="Page"
        value={currentPage}
        onChange={(event) => handlePageSelectChange(event.target.value)}
      >
        {pageNumbers.map((pageNumber, index) => {
          return (
            <option key={index} value={String(pageNumber)}>
              {pageNumber}
            </option>
          );
        })}
      </select>
    </>
  );
}
