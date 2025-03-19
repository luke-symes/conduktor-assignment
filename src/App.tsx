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
import { TableControls } from './components/TableControls';

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
