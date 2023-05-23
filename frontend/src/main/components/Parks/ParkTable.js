import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";
import { useBackendMutation } from "main/utils/useBackend";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/parkUtils";
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

export default function ParkTable({
    parks,
    currentUser,
    showButtons = true,
    testIdPrefix = "ParkTable" }) {

    const navigate = useNavigate();

     // Stryker disable all : hard to test for query caching
    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess },
        ["/api/parks/all"]
    );
    // Stryker enable all 


    const editCallback = (cell) => {
        navigate(`/Parks/edit/${cell.row.values.id}`);
    };

    const detailsCallback = (cell) => {
        navigate(`/Parks/details/${cell.row.values.id}`);
    };

    // Stryker disable all : TODO try to make a good test for this
    const deleteCallback = async (cell) => {
        deleteMutation.mutate(cell);
    };
    // Stryker enable all 


    const columns = [
        {
            Header: 'id',
            accessor: 'id', // accessor is the "key" in the data
        },

        {
            Header: 'Name',
            accessor: 'name',
        },
        {
            Header: 'Address',
            accessor: 'address',
        },
        {
            Header: 'Rating',
            accessor: 'rating',
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
    const memoizedParks = React.useMemo(() => parks, [parks]);

    const columnsToDisplay = showButtons ? memoizedColumns : columns;

    return <OurTable
        data={memoizedParks}
        columns={columnsToDisplay}
        testid={testIdPrefix}
    />;
};