import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";
import { useBackendMutation } from "main/utils/useBackend";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/bookUtils";
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

const showCell = (cell) => JSON.stringify(cell.row.values);

export default function BookTable({
    books,
    currentUser,
    showButtons = true,
    testIdPrefix = "BookTable" }) {

    const navigate = useNavigate();

    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess },
        ["/api/books/all"]
    );

    const editCallback = (cell) => {
        console.log(`editCallback: ${showCell(cell)})`);
        navigate(`/Books/edit/${cell.row.values.id}`);
    };

    const detailsCallback = (cell) => {
        console.log(`detailsCallback: ${showCell(cell)})`);
        navigate(`/Books/details/${cell.row.values.id}`);
    };

    const deleteCallback = async (cell) => {
        console.log(`deleteCallback: ${showCell(cell)})`);
        deleteMutation.mutate(cell);
    };


    const columns = [
        {
            Header: 'id',
            accessor: 'id', // accessor is the "key" in the data
        },

        {
            Header: 'Title',
            accessor: 'title',
        },
        {
            Header: 'Author',
            accessor: 'author',
        },
        {
            Header: 'Genre',
            accessor: 'genre',
        }
    ];

    const buttonColumns = [
        ...columns,
        ButtonColumn("Details", "primary", detailsCallback, testIdPrefix),
    ];

    if (hasRole(currentUser, "ROLE_ADMIN")) {
        buttonColumns.push(ButtonColumn("Edit", "primary", editCallback, testIdPrefix));
        buttonColumns.push(ButtonColumn("Delete", "danger", deleteCallback, testIdPrefix));
    }

    // Stryker disable next-line ArrayDeclaration : [buttonColumns] is a performance optimization
    const memoizedColumns = React.useMemo(() => buttonColumns, [buttonColumns]);
    const memoizedBooks = React.useMemo(() => books, [books]);

    const columnsToDisplay = showButtons ? memoizedColumns : columns;

    return <OurTable
        data={memoizedBooks}
        columns={columnsToDisplay}
        testid={testIdPrefix}
    />;
};

export { showCell };