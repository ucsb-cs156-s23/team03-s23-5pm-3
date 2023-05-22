import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import RestaurantForm from "main/components/Restaurants/RestaurantForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function RestaurantCreatePage() {

  const objectToAxiosParams = (restaurant) => ({
    url: "/api/restaurant/post",
    method: "POST",
    params: {
      name: restaurant.name,
      address: restaurant.address,
      city: restaurant.city,
      state: restaurant.state,
      zip: restaurant.zip,
      description: restaurant.description
    }
  });

  const onSuccess = (restaurant) => {
    toast(`New restaurant Created - id: ${restaurant.id} name: ${restaurant.name}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosParams,
     { onSuccess }, 
     // Stryker disable next-line all : hard to set up test for caching
     ["/api/restaurant/all"]
     );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess) {
    return <Navigate to="/restaurants/list" />
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New Restaurant</h1>

        <RestaurantForm submitAction={onSubmit} />

      </div>
    </BasicLayout>
  )
}
