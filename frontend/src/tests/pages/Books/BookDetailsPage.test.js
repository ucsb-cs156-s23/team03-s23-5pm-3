import { fireEvent, render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import BookDetailsPage from "main/pages/Books/BookDetailsPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { bookFixtures } from "fixtures/bookFixtures";
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
            title: "a",
            author: "b",
            genre: "c",
        }),
    };
});

describe("BookDetailsPage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    const testId = "BookTable";

    beforeEach(() => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
        axiosMock.onGet("/api/books", { params: { id: 1 } }).reply(200, {
            id: 1,
            title: "a",
            author: "b",
            genre: "c",
        });
    });

    const queryClient = new QueryClient();
    test("renders header but table is not present when backend doesn't return a book", async () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
        axiosMock.onGet("/api/books").timeout();

        const restoreConsole = mockConsole();
        const { queryByTestId, findByText } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <BookDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await findByText("Book Details");
        expect(queryByTestId(`${testId}-cell-row-0-col-id`)).not.toBeInTheDocument();
        restoreConsole();
    });

    test("renders without crashing for regular user", async () => {

        const { getByTestId, queryByText } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <BookDetailsPage />
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
                    <BookDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1"); });
        expect(queryByText("Delete")).not.toBeInTheDocument();
        expect(queryByText("Edit")).not.toBeInTheDocument();
        expect(queryByText("Details")).not.toBeInTheDocument();

    });

});


