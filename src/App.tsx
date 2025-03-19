import './global.css';
import { PersonTable } from './components/PersonTable';
import { ctRoot as peopleData } from './data/random-people-data.json';
import {
  type People,
  type PersonPicked,
  zPeople,
  zPersonPickedKey,
} from './schemas/person';
import { ZodError } from 'zod';
import { useState, useEffect } from 'react';
import lodash from 'lodash';

function App() {
  const [isError, setIsError] = useState<boolean>(false);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [validPeopleData, setValidPeopleData] = useState<People | undefined>(
    undefined,
  );

  useEffect(() => {
    try {
      const validation = zPeople.safeParse(peopleData);
      if (!validation.success) {
        setIsError(true);
        throw new ZodError(validation.error.issues);
      } else {
        const validPeopleData = validation.data;
        setValidPeopleData(validPeopleData);
      }
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        console.error('Zod Error validating people data:', error.issues);
      } else if (error instanceof Error) {
        console.error('Error validating people data', error.message);
      } else {
        console.error('Unknown error validating people data', error);
      }
    }
  }, []);

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

  if (validPeopleData && validPeopleData.length > 0) {
    const tableKeys = zPersonPickedKey.options;
    const allRows: PersonPicked[] = validPeopleData.map((person) =>
      lodash.pick(person, tableKeys),
    );

    const endRowIndex = currentPage * rowsPerPage;
    const startRowIndex = endRowIndex - rowsPerPage;
    const currentRows = allRows.slice(startRowIndex, endRowIndex);
    const totalPages = allRows.length / rowsPerPage;
    const pageNumbers = getPageNumbers(totalPages);

    return (
      <div className="m-8 text-sm">
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
        <PersonTable keys={tableKeys} rows={currentRows} />
      </div>
    );
  }
}

export default App;
