import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import ParkForm from "main/components/Parks/ParkForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function ParksCreatePage() {
  const objectToAxiosParams = (Park) => ({
    url: "/api/parks/post",
    method: "POST",
    params: {
      name: Park.name,
      address: Park.address,
      rating: Park.rating
    }
  });

  const onSuccess = (Park) => {
    toast(`New Park Created - id: ${Park.id} name: ${Park.name}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosParams,
     { onSuccess }, 
     // Stryker disable next-line all : hard to set up test for caching
     ["/api/parks/all"]
     );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess) {
    return <Navigate to="/Parks/list" />
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