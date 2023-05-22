import { render, waitFor, fireEvent } from "@testing-library/react";
import RestaurantForm from "main/components/Restaurants/RestaurantForm";
import { restaurantFixtures } from "fixtures/restaurantFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));


describe("RestaurantForm tests", () => {

    test("renders correctly", async () => {

        const { getByText, findByText } = render(
            <Router  >
                <RestaurantForm />
            </Router>
        );
        await findByText(/Name/);
        await findByText(/Create/);
    });


    test("renders correctly when passing in a Restaurant", async () => {

        const { getByText, getByTestId, findByTestId } = render(
            <Router  >
                <RestaurantForm initialContents={restaurantFixtures.oneRestaurant} />
            </Router>
        );
        await findByTestId(/RestaurantForm-id/);
        expect(getByText(/Id/)).toBeInTheDocument();
    });


    test("Correct Error messsages on bad input", async () => {

        const { getByTestId, getByText, findByTestId, findByText } = render(
            <Router  >
                <RestaurantForm />
            </Router>
        );
        await findByTestId("RestaurantForm-name");
        const nameField = getByTestId("RestaurantForm-name");
        const addressField = getByTestId("RestaurantForm-address");
        const cityField = getByTestId("RestaurantForm-city");
        const stateField = getByTestId("RestaurantForm-state");
        const zipField = getByTestId("RestaurantForm-zip");
        const descriptionField = getByTestId("RestaurantForm-description");
        const submitButton = getByTestId("RestaurantForm-submit");

        fireEvent.change(nameField, { target: { value: 'saoidjaoihdaushdaufhfuiwhuhiqhfiuqhwfuqwhfqwifhqwqfwijofqwijfwq' } })
        fireEvent.change(addressField, { target: { value: '' } })
        fireEvent.change(cityField, { target: { value: '' } })
        fireEvent.change(stateField, { target: { value: '' } })
        fireEvent.change(zipField, { target: { value: '' } })
        fireEvent.change(descriptionField, { target: { value: '' } })
        fireEvent.click(submitButton);

        await findByText(/Max length 30 characters/);
        expect(getByText(/Address is required/)).toBeInTheDocument();
        expect(getByText(/City is required/)).toBeInTheDocument();
        expect(getByText(/State is required/)).toBeInTheDocument();
        expect(getByText(/Zip is required/)).toBeInTheDocument();
        expect(getByText(/Description is required/)).toBeInTheDocument();
    });

    test("Correct Error messsages on missing input", async () => {

        const { getByTestId, getByText, findByTestId, findByText } = render(
            <Router  >
                <RestaurantForm />
            </Router>
        );
        await findByTestId("RestaurantForm-submit");
        const submitButton = getByTestId("RestaurantForm-submit");

        fireEvent.click(submitButton);

        await findByText(/Name is required/);
        expect(getByText(/Address is required/)).toBeInTheDocument();
        expect(getByText(/City is required/)).toBeInTheDocument();
        expect(getByText(/State is required/)).toBeInTheDocument();
        expect(getByText(/Zip is required/)).toBeInTheDocument();
        expect(getByText(/Description is required/)).toBeInTheDocument();

    });

    test("No Error messsages on good input", async () => {

        const mockSubmitAction = jest.fn();


        const { getByTestId, queryByText, findByTestId } = render(
            <Router  >
                <RestaurantForm submitAction={mockSubmitAction} />
            </Router>
        );
        await findByTestId("RestaurantForm-name");

        const nameField = getByTestId("RestaurantForm-name");
        const addressField = getByTestId("RestaurantForm-address");
        const cityField = getByTestId("RestaurantForm-city");
        const stateField = getByTestId("RestaurantForm-state");
        const zipField = getByTestId("RestaurantForm-zip");
        const descriptionField = getByTestId("RestaurantForm-description");
        const submitButton = getByTestId("RestaurantForm-submit");

        fireEvent.change(nameField, { target: { value: 'zzz' } })
        fireEvent.change(addressField, { target: { value: 'z' } })
        fireEvent.change(cityField, { target: { value: 'z' } })
        fireEvent.change(stateField, { target: { value: 'z' } })
        fireEvent.change(zipField, { target: { value: 'z' } })
        fireEvent.change(descriptionField, { target: { value: 'z' } })
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(queryByText(/Max length 30 characters/)).not.toBeInTheDocument();
        expect(queryByText(/Address is required/)).not.toBeInTheDocument();

    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {

        const { getByTestId, findByTestId } = render(
            <Router  >
                <RestaurantForm />
            </Router>
        );
        await findByTestId("RestaurantForm-cancel");
        const cancelButton = getByTestId("RestaurantForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

    });

});