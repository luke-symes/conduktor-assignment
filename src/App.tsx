import './global.css';
import { Table } from './components/Table';
import { ctRoot as peopleData } from './data/random-people-data.json';
import { type People, zPeople, zPersonPickedKey } from './schemas/person';
import { ZodError } from 'zod';
import { useState, useEffect } from 'react';
import lodash from 'lodash';

function App() {
  const [tableData, setTableData] = useState<People>([]);
  const [isError, setIsError] = useState<boolean>(false);

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
    const tableRows = tableData.map((person) => lodash.pick(person, tableKeys));
    return <Table keys={tableKeys} rows={tableRows}></Table>;
  }
}

export default App;
