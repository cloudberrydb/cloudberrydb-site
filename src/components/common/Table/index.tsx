interface IProps {
  tableColumns: { label: string; prop: string; width?: string | number }[];
  data: any[];
  className?: string;
  style?: React.CSSProperties;
  bodyStyle?: React.CSSProperties;
  headerStyle?: React.CSSProperties;
}
export default function Table(props: IProps) {
  return (
    <div className={props.className} style={props.style}>
      <table>
        <thead style={{ fontWeight: 600, ...props.headerStyle }}>
          <tr>
            {props.tableColumns.map((column) => (
              <th key={column.label} style={{ width: column.width }}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody style={props.bodyStyle}>
          {props.data.map((row, i) => (
            <tr key={i}>
              {props.tableColumns.map((column) => (
                <td key={column.label}>{row[column.prop]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
