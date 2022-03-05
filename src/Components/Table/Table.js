import React, { useEffect, useState } from "react";
import { Table, FormControl } from 'react-bootstrap';
import { ArrowBarRight, ArrowBarLeft, ArrowDownUp, ArrowDown, ArrowUp } from 'react-bootstrap-icons';

const MyTable = ({ columns, rows, defaultSort, child, childProp, tableProps, dataId }) => {
    const [childRows, setChildRows] = useState([]);
    const [rowId, setRowId] = useState(null);
    const [sortingDirection, setSortingDirection] = useState(defaultSort || new Array(columns.length));
    const [sortedRows, setSortedRows] = useState(rows);
    const [filters, setFilters] = useState(new Array(columns.length));
    const [filtredRows, setFiltredRows] = useState(rows);
    const handleRowClick = (id) => {
        if (rowId === id) setRowId(null)
        else {
            setRowId(id);
            setChildRows(filtredRows.find(el => el[dataId] === id)[childProp])
        }
    }
    const handleSort = (index) => {
        let _sortingDirection = sortingDirection[index];
        if (_sortingDirection === undefined) _sortingDirection = -1;
        _sortingDirection = -1 * _sortingDirection;
        let sorted = [];
        if ("string" === typeof rows[0][columns[index].key]) {
            sorted = [...sortedRows].sort((a, b) => _sortingDirection * a[columns[index].key].localeCompare(b[columns[index].key]));
        }
        else {
            sorted = [...sortedRows].sort((a, b) => _sortingDirection * (a[columns[index].key] - b[columns[index].key]));
        }
        let sortingDirectionArray = [...sortingDirection];
        sortingDirectionArray[index] = _sortingDirection;
        setSortingDirection(sortingDirectionArray);
        setSortedRows(sorted);
    }
    const handleFilterChange = (text, index) => {
        let _filters = [...filters];
        _filters[index] = text;
        setFilters(_filters);
    }
    useEffect(() => {
        let filtred = [];
        filtred = [...sortedRows].filter(el => {
            let match = true;
            columns.forEach((col, key) => {
                if (filters[key] !== "" && filters[key] !== undefined) {
                    match = match && String(el[col.key]).toLocaleLowerCase().includes(filters[key].toLocaleLowerCase());
                }
            });
            return match;
        })
        setFiltredRows(filtred);
    }, [filters, sortedRows, columns]);
    useEffect(() => {
        if (defaultSort && (defaultSort.includes(1) || defaultSort.includes(-1))) {
            const index = defaultSort.findIndex(el => Math.abs(el) == 1);
            console.log(index);
            if (index >= 0) handleSort(index);
        }
    }, [])

    return (
        <Table striped bordered hover size="sm" responsive {...tableProps}>
            <tbody>
                <tr>
                    {child ? <th></th> : null}
                    {columns.map((col, index) => (
                        <th key={index}>
                            <div className="d-flex" role="button" onClick={() => handleSort(index)}>
                                <div className="mx-1">{sortingDirection[index] ? (sortingDirection[index] === 1 ? <ArrowDown /> : <ArrowUp />) : <ArrowDownUp />}</div>
                                {col.name}
                            </div>
                        </th>
                    ))}
                </tr>
                <tr>
                    {child ? <th></th> : null}
                    {columns.map((col, index) => (
                        <td key={index}>
                            <FormControl placeholder="" onChange={(e) => handleFilterChange(e.target.value, index)} />
                        </td>
                    ))}
                </tr>
                {filtredRows.map((row, index) =>
                (
                    <React.Fragment key={index}>
                        <tr>
                            {child ? <td onClick={() => handleRowClick(row[dataId])}>{rowId === row[dataId] && React.isValidElement(child) ? <ArrowBarLeft role="button" /> : <ArrowBarRight role="button" />}</td> : null}
                            {columns.map((col, index) =>
                            (
                                <td key={index}>{row[col.key]}</td>
                            ))}
                        </tr>
                        {rowId === row[dataId] && React.isValidElement(child) ?
                            (
                                <tr>
                                    <td colSpan={columns.length + 1}>
                                        <div className="mx-1 my-2 py-2">
                                            {React.cloneElement(child, { rows: childRows, x: 1 })}
                                        </div>
                                    </td>
                                </tr>
                            )
                            :
                            null}
                    </React.Fragment>
                )
                )}
            </tbody>
        </Table>
    );
}

export default MyTable;