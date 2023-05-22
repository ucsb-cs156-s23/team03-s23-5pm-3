import { fireEvent, queryByTestId, render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import RestaurantEditPage from "main/pages/Restaurants/RestaurantEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import mockConsole from "jest-mock-console";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        useParams: () => ({
            id: 17
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("RestaurantEditPage tests", () => {

    describe("when the backend doesn't return a todo", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/restaurant", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            const {getByText, queryByTestId, findByText} = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <RestaurantEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await findByText("Edit restaurant");
            expect(queryByTestId("RestaurantForm-name")).not.toBeInTheDocument();
            restoreConsole();
        });
    });

    describe("tests where backend is working normally", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/restaurant", { params: { id: 17 } }).reply(200, {
                "id": 17,
                 "name": "The Habit",
                 "address": "888 Embarcadero del Norte",
                 "city": "Isla Vista",
                 "state": "CA",
                 "zip": "93117",
                 "description": "Burgers and Fries"      
               });
            axiosMock.onPut('/api/restaurant').reply(200, {
                "id": 17,
                 "name": "The",
                 "address": "888",
                 "city": "Isla",
                 "state": "C",
                 "zip": "9311",
                 "description": "Burgers"      
               });
        });

        const queryClient = new QueryClient();
        test("renders without crashing", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <RestaurantEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
        });

        test("Is populated with the data provided", async () => {

            const { getByTestId, findByTestId } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <RestaurantEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await findByTestId("RestaurantForm-name");

            const idField = getByTestId("RestaurantForm-id");
            const nameField = getByTestId("RestaurantForm-name");
            const addressField = getByTestId("RestaurantForm-address");
            const cityField = getByTestId("RestaurantForm-city");
            const stateField = getByTestId("RestaurantForm-state");
            const zipField = getByTestId("RestaurantForm-zip");
            const descriptionField = getByTestId("RestaurantForm-description");
            const submitButton = getByTestId("RestaurantForm-submit");

            expect(idField).toHaveValue("17");
            expect(nameField).toHaveValue("The Habit");
            expect(addressField).toHaveValue("888 Embarcadero del Norte");
            expect(cityField).toHaveValue("Isla Vista");
            expect(stateField).toHaveValue("CA");
            expect(zipField).toHaveValue("93117");
            expect(descriptionField).toHaveValue("Burgers and Fries");   
        });

        test("Changes when you click Update", async () => {



            const { getByTestId, findByTestId } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <RestaurantEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await findByTestId("RestaurantForm-name");

            const idField = getByTestId("RestaurantForm-id");
            const nameField = getByTestId("RestaurantForm-name");
            const addressField = getByTestId("RestaurantForm-address");
            const cityField = getByTestId("RestaurantForm-city");
            const stateField = getByTestId("RestaurantForm-state");
            const zipField = getByTestId("RestaurantForm-zip");
            const descriptionField = getByTestId("RestaurantForm-description");
            const submitButton = getByTestId("RestaurantForm-submit");

            expect(idField).toHaveValue("17");
            expect(nameField).toHaveValue("The Habit");
            expect(addressField).toHaveValue("888 Embarcadero del Norte");
            expect(cityField).toHaveValue("Isla Vista");
            expect(stateField).toHaveValue("CA");
            expect(zipField).toHaveValue("93117");
            expect(descriptionField).toHaveValue("Burgers and Fries");   

            expect(submitButton).toBeInTheDocument();

            fireEvent.change(nameField, { target: { value: 'The' } })
            fireEvent.change(addressField, { target: { value: '888' } })
            fireEvent.change(cityField, { target: { value: 'Isla' } })
            fireEvent.change(stateField, { target: { value: 'C' } })
            fireEvent.change(zipField, { target: { value: '9311' } })
            fireEvent.change(descriptionField, { target: { value: 'Burgers' } })

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled);
            expect(mockToast).toBeCalledWith("Restaurant Updated - id: 17 name: The");
            expect(mockNavigate).toBeCalledWith({ "to": "/restaurants/list" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                name: 'The',
                address: '888',
                city: 'Isla',
                state: 'C',
                zip: '9311',
                description: 'Burgers'      
            })); // posted object

        });

       
    });
});


