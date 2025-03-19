import { type PersonPickedKey, type PersonPicked } from '../schemas/person';

interface TableProps {
  keys: PersonPickedKey[];
  rows: PersonPicked[];
}

interface RowProps {
  data: PersonPicked;
}

function Row({ data }: RowProps) {
  const values = Object.values(data);
  return (
    <tr className="border-gray-200 border-2">
      {values.map((value, index) => (
        <td className="p-2" key={index}>
          {String(value)}
        </td>
      ))}
    </tr>
  );
}

export function PersonTable({ keys, rows }: TableProps) {
  return (
    <table className="table-auto">
      <thead>
        <tr className="bg-gray-200 border-gray-200 border-2">
          {keys.map((key) => {
            return (
              <th className="capitalize p-2" key={key}>
                {key}
              </th>
            );
          })}
        </tr>
      </thead>

      <tbody>
        {rows.map((row, index) => {
          return <Row data={row} key={index} />;
        })}
      </tbody>
    </table>
  );
}
