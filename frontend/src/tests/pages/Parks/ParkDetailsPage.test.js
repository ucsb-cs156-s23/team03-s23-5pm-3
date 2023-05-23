import { fireEvent, render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ParkDetailsPage from "main/pages/Parks/ParkDetailsPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { parkFixtures } from "fixtures/parkFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";

jest.mock("react-router-dom", () => {
    const originalModule = jest.requireActual("react-router-dom");
    return {
        __esModule: true,
        ...originalModule,
        useParams: () => ({
            id: 1,
            name: "a",
            address: "b",
            rating: "c",
        }),
    };
});

describe("ParkDetailsPage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    const testId = "ParkTable";

    beforeEach(() => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
        axiosMock.onGet("/api/parks", { params: { id: 1 } }).reply(200, {
            id: 1,
            name: "a",
            address: "b",
            rating: "c",
        });
    });

    const queryClient = new QueryClient();
    test("renders header but table is not present when backend doesn't return a park", async () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
        axiosMock.onGet("/api/parks").timeout();

        const restoreConsole = mockConsole();
        const { queryByTestId, findByText } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ParkDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await findByText("Park Details");
        expect(queryByTestId(`${testId}-cell-row-0-col-id`)).not.toBeInTheDocument();
        restoreConsole();
    });

    test("renders without crashing for regular user", async () => {

        const { getByTestId, queryByText } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ParkDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1"); });
        expect(queryByText("Delete")).not.toBeInTheDocument();
        expect(queryByText("Edit")).not.toBeInTheDocument();
        expect(queryByText("Details")).not.toBeInTheDocument();

    });

    test("renders without crashing for admin user", async () => {

        const { getByTestId, queryByText } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ParkDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1"); });
        expect(queryByText("Delete")).not.toBeInTheDocument();
        expect(queryByText("Edit")).not.toBeInTheDocument();
        expect(queryByText("Details")).not.toBeInTheDocument();

    });

});