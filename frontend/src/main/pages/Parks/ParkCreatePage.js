import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import ParkForm from "main/components/Parks/ParkForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function ParkCreatePage() {

  const objectToAxiosParams = (park) => ({
    url: "/api/park/post",
    method: "POST",
    params: {
      name: park.name,
      address: park.address,
      rating: park.rating
    }
  });

  const onSuccess = (park) => {
    toast(`New park Created - id: ${park.id} name: ${park.name}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosParams,
     { onSuccess }, 
     // Stryker disable next-line all : hard to set up test for caching
     ["/api/park/all"]
     );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess) {
    return <Navigate to="/parks/list" />
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
