import { fireEvent, queryByTestId, render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import ParkEditPage from "main/pages/Parks/ParkEditPage";

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

describe("ParkEditPage tests", () => {

    describe("when the backend doesn't return a park", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/parks", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            const {getByText, queryByTestId, findByText} = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <ParkEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await findByText("Edit Park");
            expect(queryByTestId("ParkForm-name")).not.toBeInTheDocument();
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
            axiosMock.onGet("/api/parks", { params: { id: 17 } }).reply(200, {
                id: 17,
                name: 'anderson park',
                address: "123 fake ave",
                rating: "3.9"
            });
            axiosMock.onPut('/api/parks').reply(200, {
                id: "17",
                name: 'anderson park2',
                address: "123 fake ave2",
                rating: "3.92"
            });
        });

        const queryClient = new QueryClient();
        test("renders without crashing", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <ParkEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
        });

        test("Is populated with the data provided", async () => {

            const { getByTestId, findByTestId } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <ParkEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await findByTestId("ParkForm-name");

            const idField = getByTestId("ParkForm-id");
            const nameField = getByTestId("ParkForm-name");
            const addressField = getByTestId("ParkForm-address");
            const ratingField = getByTestId("ParkForm-rating");
            

            expect(idField).toHaveValue("17");
            expect(nameField).toHaveValue("anderson park");
            expect(addressField).toHaveValue("123 fake ave");
            expect(ratingField).toHaveValue("3.9");
        });

        test("Changes when you click Update", async () => {



            const { getByTestId, findByTestId } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <ParkEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await findByTestId("ParkForm-name");

            const idField = getByTestId("ParkForm-id");
            const nameField = getByTestId("ParkForm-name");
            const addressField = getByTestId("ParkForm-address");
            const ratingField = getByTestId("ParkForm-rating");
            const submitButton = getByTestId("ParkForm-submit");

            expect(idField).toHaveValue("17");
            expect(nameField).toHaveValue("anderson park");
            expect(addressField).toHaveValue("123 fake ave");
            expect(ratingField).toHaveValue("3.9");
            expect(submitButton).toBeInTheDocument();

            fireEvent.change(nameField, { target: { value: 'anderson park2' } })
            fireEvent.change(addressField, { target: { value: '123 fake ave2' } })
            fireEvent.change(ratingField, { target: { value: "3.92" } })

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled);
            expect(mockToast).toBeCalledWith("Park Updated - id: 17 name: anderson park2 address: 123 fake ave2 rating: 3.92");
            expect(mockNavigate).toBeCalledWith({ "to": "/Parks/list" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                name: 'anderson park2',
                address: "123 fake ave2",
                rating: "3.92"
            })); // posted object

        });

       
    });
});


