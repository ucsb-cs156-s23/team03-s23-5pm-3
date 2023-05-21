import { fireEvent, render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import BookDetailsPage from "main/pages/Books/BookDetailsPage";


import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { bookFixtures } from "fixtures/bookFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";

describe("BookDetailsPage tests", () => {

    const axiosMock =new AxiosMockAdapter(axios);

    const testId = "BookTable";

    const setupUserOnly = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
        
    };

    const setupAdminUser = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.adminUser);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
        axiosMock.onGet("/api/books", { params: { id: 17 } }).reply(200, {
            id: 17,
            title: 'IT',
            author: "Stephen King",
            genre: "Horror"
        });
    };

    test("renders header but table is not present when backend doesn't return a book", async () => {
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/books", { params: { id: 17 } }).timeout();
        const restoreConsole = mockConsole();

        const {getByText, queryByTestId, findByText} = render(
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
        setupUserOnly();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/books", { params: { id: 1 } }).reply(200, bookFixtures.oneBook);

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <BookDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1"); });

    });

    test("renders without crashing for admin user", async () => {
        setupAdminUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/books", { params: { id: 1 } }).reply(200, bookFixtures.oneBook);
        
        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <BookDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1"); });

    });

});


