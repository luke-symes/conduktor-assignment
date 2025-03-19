interface Props {
  keys: string[];
  rows: unknown[];
}

export function Table({ keys, rows }: Props) {
  return (
    <table className="table-auto">
      <thead>
        <tr>
          {keys.map((key) => {
            return (
              <th className="capitalize" key={key}>
                {key}
              </th>
            );
          })}
        </tr>
      </thead>
    </table>
  );
}
