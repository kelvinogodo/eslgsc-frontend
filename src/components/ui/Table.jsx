import clsx from 'clsx';

const Table = ({ children, className, ...props }) => {
  return (
    <div className="overflow-x-auto">
      <table className={clsx('min-w-full divide-y divide-gov-gray-200', className)} {...props}>
        {children}
      </table>
    </div>
  );
};

const TableHead = ({ children, className, ...props }) => {
  return (
    <thead className={clsx('bg-gov-gray-50', className)} {...props}>
      {children}
    </thead>
  );
};

const TableBody = ({ children, className, ...props }) => {
  return (
    <tbody className={clsx('bg-white divide-y divide-gov-gray-200', className)} {...props}>
      {children}
    </tbody>
  );
};

const TableRow = ({ children, className, ...props }) => {
  return (
    <tr className={clsx('hover:bg-gov-gray-50 transition-colors', className)} {...props}>
      {children}
    </tr>
  );
};

const TableHeaderCell = ({ children, className, ...props }) => {
  return (
    <th className={clsx('table-head', className)} {...props}>
      {children}
    </th>
  );
};

const TableCell = ({ children, className, ...props }) => {
  return (
    <td className={clsx('table-cell', className)} {...props}>
      {children}
    </td>
  );
};

Table.Head = TableHead;
Table.Body = TableBody;
Table.Row = TableRow;
Table.HeaderCell = TableHeaderCell;
Table.Cell = TableCell;

export default Table;
