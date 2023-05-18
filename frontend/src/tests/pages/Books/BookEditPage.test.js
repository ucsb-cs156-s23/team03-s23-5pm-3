import { render, screen, act, waitFor, fireEvent } from "@testing-library/react";
import BookEditPage from "main/pages/Books/BookEditPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import mockConsole from "jest-mock-console";

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({
        id: 3
    }),
    useNavigate: () => mockNavigate
}));

const mockUpdate = jest.fn();
jest.mock('main/utils/bookUtils', () => {
    return {
        __esModule: true,
        bookUtils: {
            update: (_Book) => {return mockUpdate();},
            getById: (_id) => {
                return {
                    Book: {
                        id: 3,
                        title: "It",
                        author: "Stephen King",
                        genre: "Horror"
                    }
                }
            }
        }
    }
});


describe("BookEditPage tests", () => {

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

    test("loads the correct fields", async () => {

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <BookEditPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(screen.getByTestId("BookForm-title")).toBeInTheDocument();
        expect(screen.getByDisplayValue('It')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Stephen King')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Horror')).toBeInTheDocument();

    });

    test("redirects to /books on submit", async () => {

        const restoreConsole = mockConsole();

        mockUpdate.mockReturnValue({
            "Book": {
                id: 3,
                title: "It",
                author: "Stephe King",
                genre: "Horror"
            }
        });

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <BookEditPage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        const titleInput = screen.getByLabelText("Title");
        expect(titleInput).toBeInTheDocument();


        const authorInput = screen.getByLabelText("Author");
        expect(authorInput).toBeInTheDocument();

        const genreInput = screen.getByLabelText("Genre");
        expect(genreInput).toBeInTheDocument();

        const updateButton = screen.getByText("Update");
        expect(updateButton).toBeInTheDocument();

        await act(async () => {
            fireEvent.change(titleInput, { target: { value: 'It' } })
            fireEvent.change(authorInput, { target: { value: 'Stephe King' } })
            fireEvent.change(genreInput, { target: { value: 'Horror' } })

            fireEvent.click(updateButton);
        });

        await waitFor(() => expect(mockUpdate).toHaveBeenCalled());
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/books"));

        // assert - check that the console.log was called with the expected message
        expect(console.log).toHaveBeenCalled();
        const message = console.log.mock.calls[0][0];
        const expectedMessage =  `updatedBook: {"Book":{"id":3,"title":"It","author":"Stephe King","genre":"Horror"}}`

        expect(message).toMatch(expectedMessage);
        restoreConsole();

    });

});


