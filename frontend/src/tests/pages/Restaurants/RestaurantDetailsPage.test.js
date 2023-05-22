import RestaurantDetailsPage from "main/pages/Restaurants/RestaurantDetailsPage";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { restaurantFixtures } from "fixtures/restaurantFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        useParams: () => ({
            id: 1,
            name: "a",
            address: "b",
            city: "c",
            state: "d",
            zip: "1",
            description: "e"
        }),
    };
});

describe("RestaurantDetailsPage tests", () => {
    const axiosMock =new AxiosMockAdapter(axios);

    const testId = "RestaurantTable";

    const setupUserOnly = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
        axiosMock.onGet("/api/restaurant", { params: { id: 1 } }).reply(200, {
            id: 1,
            name: "a",
            address: "b",
            city: "c",
            state: "d",
            zip: "1",
            description: "e"
        });
    };

    const setupAdminUser = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.adminUser);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
        axiosMock.onGet("/api/restaurant", { params: { id: 1 } }).reply(200, {
            id: 1,
            name: "a",
            address: "b",
            city: "c",
            state: "d",
            zip: "1",
            description: "e"
        });
    };

    test("renders without crashing", async () => {
        setupAdminUser();
        const queryClient = new QueryClient();

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RestaurantDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1")});
        const deleteButton = getByTestId(`${testId}-cell-row-0-col-Delete-button`);
        expect(deleteButton).toBeInTheDocument();
        const editButton = getByTestId(`${testId}-cell-row-0-col-Edit-button`);
        expect(editButton).toBeInTheDocument();
        const detailsButton = getByTestId(`${testId}-cell-row-0-col-Details-button`);
        expect(detailsButton).toBeInTheDocument();
    });

    test("loads the correct fields", async () => {
        setupAdminUser();
        const queryClient = new QueryClient();
        
        const { getByTestId, getByText } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RestaurantDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
        await waitFor(() => { expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1"); });
        expect(getByText("a")).toBeInTheDocument();

        const deleteButton = getByTestId(`${testId}-cell-row-0-col-Delete-button`);
        expect(deleteButton).toBeInTheDocument();
        const editButton = getByTestId(`${testId}-cell-row-0-col-Edit-button`);
        expect(editButton).toBeInTheDocument();
        const detailsButton = getByTestId(`${testId}-cell-row-0-col-Details-button`);
        expect(detailsButton).toBeInTheDocument();
    });

});


