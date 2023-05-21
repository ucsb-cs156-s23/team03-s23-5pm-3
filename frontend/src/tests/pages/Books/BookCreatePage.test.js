import { render, waitFor, fireEvent } from "@testing-library/react";
import CreatePage from "main/pages/Books/BookCreatePage";
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

describe("BookCreatePage tests", () => {

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
        const Book = {
            id: 17,
            title: "IT",
            author: "Stephen King",
            genre: "Horror",
        };

        axiosMock.onPost("/api/Books/post").reply( 202, Book );

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(getByTestId("BookForm-title")).toBeInTheDocument();
        });

        const titleField = getByTestId("BookForm-title");
        const authorField = getByTestId("BookForm-author");
        const genreField = getByTestId("BookForm-genre");
        const submitButton = getByTestId("BookForm-submit");

        fireEvent.change(titleField, { target: { value: 'IT' } });
        fireEvent.change(authorField, { target: { value: 'Stephen King' } });
        fireEvent.change(genreField, { target: { value: 'Horror' } });

        expect(submitButton).toBeInTheDocument();

        fireEvent.click(submitButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual(
            {
            "genre": "Horror",
            "author": "Stephen King",
            "title": "IT"
        });

        expect(mockToast).toBeCalledWith("New Book Created - id: 17 author: Stephen King");
        expect(mockNavigate).toBeCalledWith({ "to": "/Books/list" });
    });


});


