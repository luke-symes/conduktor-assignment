import './global.css';
import { PersonTable } from './components/PersonTable';
import { ctRoot as peopleData } from './data/random-people-data.json';
import { type PersonPicked, zPeople, zPersonPickedKey } from './schemas/person';
import { useState } from 'react';
import lodash from 'lodash';
import { TableControls } from './components/TableControls';
import { useValidation } from './hooks/useValidation';

function App() {
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { isValid, isError } = useValidation(peopleData, zPeople);

  function handleRowLimitSelectChange(rowLimit: string) {
    setRowsPerPage(Number(rowLimit));
    setCurrentPage(1);
  }

  function handlePageSelectChange(page: string) {
    setCurrentPage(Number(page));
  }

  function getPageNumbers(totalPages: number): number[] {
    const pageNumbers: number[] = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  }

  if (isError) {
    return <div>Error loading table data</div>;
  }

  if (isValid) {
    const tableKeys = zPersonPickedKey.options;
    const allRows: PersonPicked[] = peopleData.map((person) =>
      lodash.pick(person, tableKeys),
    );

    const endRowIndex = currentPage * rowsPerPage;
    const startRowIndex = endRowIndex - rowsPerPage;
    const currentRows = allRows.slice(startRowIndex, endRowIndex);
    const totalPages = allRows.length / rowsPerPage;
    const pageNumbers = getPageNumbers(totalPages);

    return (
      <div className="m-8 text-sm flex flex-col gap-4">
        <TableControls
          rowsPerPage={rowsPerPage}
          currentPage={currentPage}
          pageNumbers={pageNumbers}
          handleRowLimitSelectChange={handleRowLimitSelectChange}
          handlePageSelectChange={handlePageSelectChange}
        />
        <PersonTable keys={tableKeys} rows={currentRows} />
      </div>
    );
  }
}

export default App;
