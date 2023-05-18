import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import BookCreatePage from "main/pages/Books/BookCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import mockConsole from "jest-mock-console";
import { apiCurrentUserFixtures }  from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));

const mockAdd = jest.fn();
jest.mock('main/utils/bookUtils', () => {
    return {
        __esModule: true,
        bookUtils: {
            add: () => { return mockAdd(); }
        }
    }
});

describe("BookCreatePage tests", () => {
    const axiosMock =new AxiosMockAdapter(axios);
    axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither); 
    
    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <BookCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("redirects to /books on submit", async () => {

        const restoreConsole = mockConsole();

        mockAdd.mockReturnValue({
            "Book": {
                id: 3,
                title: "It",
                author: "Stephen King",
                genre: "Horror"
            }
        });

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <BookCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        const titleInput = screen.getByLabelText("Title");
        expect(titleInput).toBeInTheDocument();


        const authorInput = screen.getByLabelText("Author");
        expect(authorInput).toBeInTheDocument();
        
        const genreInput = screen.getByLabelText("Genre");
        expect(genreInput).toBeInTheDocument();
        

        const createButton = screen.getByText("Create");
        expect(createButton).toBeInTheDocument();

        await act(async () => {
            fireEvent.change(titleInput, { target: { value: 'It' } })
            fireEvent.change(authorInput, { target: { value: 'Stephen King' } })
            fireEvent.change(genreInput, { target: { value: 'Horror' } })
            fireEvent.click(createButton);
        });

        await waitFor(() => expect(mockAdd).toHaveBeenCalled());
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/books"));

        // assert - check that the console.log was called with the expected message
        expect(console.log).toHaveBeenCalled();
        const message = console.log.mock.calls[0][0];
        const expectedMessage =  `createdBook: {"Book":{"id":3,"title":"It","author":"Stephen King","genre":"Horror"}}`

        expect(message).toMatch(expectedMessage);
        restoreConsole();

    });

});


