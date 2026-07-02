import type { PropDef } from '../registry/types';

export function PropsTable({ props }: { props: PropDef[] }) {
  return (
    <div className="props-table-wrap">
      <table className="props-table">
        <thead>
          <tr>
            <th scope="col">Prop</th>
            <th scope="col">Type</th>
            <th scope="col">Default</th>
            <th scope="col">Description</th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop) => (
            <tr key={prop.name}>
              <td>
                <code className="props-name">{prop.name}</code>
              </td>
              <td>
                <code className="props-type">{prop.type}</code>
              </td>
              <td>{prop.defaultValue ? <code className="props-type">{prop.defaultValue}</code> : '—'}</td>
              <td>{prop.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
