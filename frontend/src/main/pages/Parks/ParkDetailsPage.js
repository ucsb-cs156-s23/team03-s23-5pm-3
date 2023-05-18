import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import ParkTable from 'main/components/Parks/ParkTable';
import { parkUtils } from 'main/utils/parkUtils';

export default function ParkDetailsPage() {
  let { id } = useParams();

  const response = parkUtils.getById(id);

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Park Details</h1>
        <ParkTable parks={[response.park]} showButtons={false} />
      </div>
    </BasicLayout>
  )
}
