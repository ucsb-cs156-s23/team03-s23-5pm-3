import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import ParkForm from "main/components/Parks/ParkForm";
import { useNavigate } from 'react-router-dom'
import { parkUtils } from 'main/utils/parkUtils';

export default function ParkCreatePage() {

  let navigate = useNavigate(); 

  const onSubmit = async (Park) => {
    const createdPark = parkUtils.add(Park);
    console.log("createdPark: " + JSON.stringify(createdPark));
    navigate("/parks");
  }  

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New Park</h1>
        <ParkForm submitAction={onSubmit} />
      </div>
    </BasicLayout>
  )
}
