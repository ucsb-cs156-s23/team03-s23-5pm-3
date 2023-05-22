
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import { restaurantUtils }  from 'main/utils/restaurantUtils';
import RestaurantForm from 'main/components/Restaurants/RestaurantForm';
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function RestaurantEditPage() {
    let { id } = useParams();

    const { data: restaurant, error, status } =
      useBackend(
        // Stryker disable next-line all : don't test internal caching of React Query
        [`/api/restaurant?id=${id}`],
        {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
          method: "GET",
          url: `/api/restaurant`,
          params: {
            id
          }
        }
      );
  
  
    const objectToAxiosPutParams = (restaurant) => ({
      url: "/api/restaurant",
      method: "PUT",
      params: {
        id: restaurant.id,
      },
      data: {
        name: restaurant.name,
        address: restaurant.address,
        city: restaurant.city,
        state: restaurant.state,
        zip: restaurant.zip,
        description: restaurant.description
      }
    });
  
    const onSuccess = (restaurant) => {
      toast(`Restaurant Updated - id: ${restaurant.id} name: ${restaurant.name}`);
    }
  
    const mutation = useBackendMutation(
      objectToAxiosPutParams,
      { onSuccess },
      // Stryker disable next-line all : hard to set up test for caching
      [`/api/restaurant?id=${id}`]
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
          <h1>Edit restaurant</h1>
          {restaurant &&
            <RestaurantForm initialContents={restaurant} submitAction={onSubmit} buttonLabel="Update" />
          }
        </div>
      </BasicLayout>
    )
}