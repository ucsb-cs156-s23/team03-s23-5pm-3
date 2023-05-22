import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import ParkForm from "main/components/Parks/ParkForm";
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function ParksEditPage() {
  let { id } = useParams();

  const { data: Park, error, status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      [`/api/parks?id=${id}`],
      {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
        method: "GET",
        url: `/api/parks`,
        params: {
          id
        }
      }
    );


  const objectToAxiosPutParams = (Park) => ({
    url: "/api/parks",
    method: "PUT",
    params: {
      id: Park.id,
    },
    data: {
      name: Park.name,
      address: Park.address,
      rating: Park.rating
    }
  });

  const onSuccess = (Park) => {
    toast(`Park Updated - id: ${Park.id} name: ${Park.name} address: ${Park.address} rating: ${Park.rating}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosPutParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    [`/api/parks?id=${id}`]
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
        <h1>Edit Park</h1>
        {Park &&
          <ParkForm initialContents={Park} submitAction={onSubmit} buttonLabel="Update" />
        }
      </div>
    </BasicLayout>
  )
}

