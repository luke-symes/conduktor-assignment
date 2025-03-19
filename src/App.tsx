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
  const [tableData, setTableData] = useState<People>([]);
  const [isError, setIsError] = useState<boolean>(false);
  const [rowLimit, setRowLimit] = useState<number>(10);

  useEffect(() => {
    try {
      const validation = zPeople.safeParse(peopleData);
      if (!validation.success) {
        setIsError(true);
        throw new ZodError(validation.error.issues);
      } else {
        setTableData(peopleData);
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

  if (isError) {
    return <div>Error loading table data</div>;
  }

  if (tableData.length > 0) {
    const tableKeys = zPersonPickedKey.options;
    const allRows: PersonPicked[] = tableData.map((person) =>
      lodash.pick(person, tableKeys),
    );
    const filteredRows = allRows.slice(0, rowLimit);
    return (
      <>
        <label htmlFor="row-limit-select">Row limit:</label>
        <select
          id="row-limit-select"
          name="Row limit"
          value={rowLimit}
          onChange={(event) => setRowLimit(Number(event.target.value))}
        >
          <option value="10">10</option>
          <option value="50">50</option>
          <option value="100">100</option>
          <option value="500">500</option>
        </select>
        <PersonTable keys={tableKeys} rows={filteredRows} />
      </>
    );
  }
}

export default App;
