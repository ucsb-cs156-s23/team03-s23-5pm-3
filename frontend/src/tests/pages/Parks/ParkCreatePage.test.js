import { render, waitFor, fireEvent } from "@testing-library/react";
import CreatePage from "main/pages/Parks/ParkCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

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
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("ParkCreatePage tests", () => {

    const axiosMock =new AxiosMockAdapter(axios);

    beforeEach(() => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    test("renders without crashing", () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("when you fill in the form and hit submit, it makes a request to the backend", async () => {

        const queryClient = new QueryClient();
        const Park = {
            id: 17,
            name: "anderson park",
            address: "123 fake ave",
            rating: "3.9",
        };

        axiosMock.onPost("/api/parks/post").reply( 202, Park );

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(getByTestId("ParkForm-name")).toBeInTheDocument();
        });

        const nameField = getByTestId("ParkForm-name");
        const addressField = getByTestId("ParkForm-address");
        const ratingField = getByTestId("ParkForm-rating");
        const submitButton = getByTestId("ParkForm-submit");

        fireEvent.change(nameField, { target: { value: 'anderson park' } });
        fireEvent.change(addressField, { target: { value: '123 fake ave' } });
        fireEvent.change(ratingField, { target: { value: '3.9' } });

        expect(submitButton).toBeInTheDocument();

        fireEvent.click(submitButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual(
            {
            "name": "anderson park",
            "address": "123 fake ave",
            "rating": "3.9"
        });

        expect(mockToast).toBeCalledWith("New Park Created - id: 17 name: anderson park");
        expect(mockNavigate).toBeCalledWith({ "to": "/Parks/list" });
    });


});


