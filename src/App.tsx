import './global.css';
import { Table } from './components/Table';
import { ctRoot as peopleData } from './data/random-people-data.json';
import { type People, zPeople } from './schemas/person';
import { ZodError } from 'zod';
import { useState, useEffect } from 'react';

function App() {
  let tableData: People | undefined;

  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    try {
      const validation = zPeople.safeParse(peopleData);
      if (!validation.success) {
        setIsError(true);
        throw new ZodError(validation.error.issues);
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
  }, [tableData]);

  if (isError) {
    return <div>Error loading table data</div>;
  }

  if (tableData) return <Table></Table>;
}

export default App;
