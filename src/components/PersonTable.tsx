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
    <tr>
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
        <tr>
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
