
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import { parkUtils }  from 'main/utils/parkUtils';
import ParkForm from 'main/components/Parks/ParkForm';
import { useNavigate } from 'react-router-dom'


export default function ParkEditPage() {
    let { id } = useParams();

    let navigate = useNavigate(); 

    const response = parkUtils.getById(id);

    const onSubmit = async (park) => {
        const updatedPark = parkUtils.update(park);
        console.log("updatedPark: " + JSON.stringify(updatedPark));
        navigate("/parks");
    }  

    return (
        <BasicLayout>
            <div className="pt-2">
                <h1>Edit Park</h1>
                <ParkForm submitAction={onSubmit} buttonLabel={"Update"} initialContents={response.park}/>
            </div>
        </BasicLayout>
    )
}