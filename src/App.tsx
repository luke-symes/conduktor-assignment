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
  const [rowLimit, setRowLimit] = useState<number>(10);
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
        setValidPeopleData(validation.data);
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
    setRowLimit(Number(rowLimit));
  }

  function handlePageSelectChange(page: string) {
    setCurrentPage(Number(page));
  }

  if (isError) {
    return <div>Error loading table data</div>;
  }

  if (validPeopleData && validPeopleData.length > 0) {
    const tableKeys = zPersonPickedKey.options;
    const allRows: PersonPicked[] = validPeopleData.map((person) =>
      lodash.pick(person, tableKeys),
    );
    const filteredRows = allRows.slice(0, rowLimit);

    const visibleRows = filteredRows;

    const totalPages = allRows.length / visibleRows.length;
    const pageNumbers: number[] = [];

    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    return (
      <>
        <label htmlFor="row-limit-select">Row limit:</label>
        <select
          id="row-limit-select"
          name="Row limit"
          value={rowLimit}
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
        <PersonTable keys={tableKeys} rows={visibleRows} />
      </>
    );
  }
}

export default App;
