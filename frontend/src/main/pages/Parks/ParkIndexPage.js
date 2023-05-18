import React from 'react'
import Button from 'react-bootstrap/Button';
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import ParkTable from 'main/components/Parks/ParkTable';
import { parkUtils } from 'main/utils/parkUtils';
import { useNavigate, Link } from 'react-router-dom';

export default function ParkIndexPage() {

    const navigate = useNavigate();

    const parkCollection = parkUtils.get();
    const parks = parkCollection.parks;

    const showCell = (cell) => JSON.stringify(cell.row.values);

    const deleteCallback = async (cell) => {
        console.log(`ParkIndexPage deleteCallback: ${showCell(cell)})`);
        parkUtils.del(cell.row.values.id);
        navigate("/parks");
    }

    return (
        <BasicLayout>
            <div className="pt-2">
                <Button style={{ float: "right" }} as={Link} to="/parks/create">
                    Create Park
                </Button>
                <h1>Parks</h1>
                <ParkTable parks={parks} deleteCallback={deleteCallback} />
            </div>
        </BasicLayout>
    )
}