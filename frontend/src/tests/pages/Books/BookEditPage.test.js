import { fireEvent, queryByTestId, render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import BookEditPage from "main/pages/Books/BookEditPage";

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

describe("BookEditPage tests", () => {

    describe("when the backend doesn't return a todo", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/Books", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            const {getByText, queryByTestId, findByText} = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <BookEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await findByText("Edit Books");
            expect(queryByTestId("BookForm-title")).not.toBeInTheDocument();
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
            axiosMock.onGet("/api/Books", { params: { id: 17 } }).reply(200, {
                id: 17,
                title: 'IT',
                author: "Stephen King",
                genre: "Horror"
            });
            axiosMock.onPut('/api/Books').reply(200, {
                id: "17",
                title: 'IT2',
                author: "Stephen King2",
                genre: "Horror2"
            });
        });

        const queryClient = new QueryClient();
        test("renders without crashing", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <BookEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
        });

        test("Is populated with the data provided", async () => {

            const { getByTestId, findByTestId } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <BookEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await findByTestId("BookForm-title");

            const idField = getByTestId("BookForm-id");
            const titleField = getByTestId("BookForm-title");
            const authorField = getByTestId("BookForm-author");
            const genreField = getByTestId("BookForm-genre");
            const submitButton = getByTestId("BookForm-submit");

            expect(idField).toHaveValue("17");
            expect(titleField).toHaveValue("IT");
            expect(authorField).toHaveValue("Stephen King");
            expect(genreField).toHaveValue("Horror");
        });

        test("Changes when you click Update", async () => {



            const { getByTestId, findByTestId } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <BookEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await findByTestId("BookForm-title");

            const idField = getByTestId("BookForm-id");
            const titleField = getByTestId("BookForm-title");
            const authorField = getByTestId("BookForm-author");
            const genreField = getByTestId("BookForm-genre");
            const submitButton = getByTestId("BookForm-submit");

            expect(idField).toHaveValue("17");
            expect(titleField).toHaveValue("IT");
            expect(authorField).toHaveValue("Stephen King");
            expect(genreField).toHaveValue("Horror");

            expect(submitButton).toBeInTheDocument();

            fireEvent.change(titleField, { target: { value: 'IT2' } })
            fireEvent.change(authorField, { target: { value: 'Stephen King2' } })
            fireEvent.change(genreField, { target: { value: "Horror2" } })

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled);
            expect(mockToast).toBeCalledWith("Books Updated - id: 17 author: Stephen King2");
            expect(mockNavigate).toBeCalledWith({ "to": "/Books/list" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                title: 'IT2',
                author: "Stephen King2",
                genre: "Horror2"
            })); // posted object

        });

       
    });
});


