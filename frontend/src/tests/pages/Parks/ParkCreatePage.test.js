import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import ParkCreatePage from "main/pages/Parks/ParkCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import mockConsole from "jest-mock-console";

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));

const mockAdd = jest.fn();
jest.mock('main/utils/parkUtils', () => {
    return {
        __esModule: true,
        parkUtils: {
            add: () => { return mockAdd(); }
        }
    }
});

describe("ParkCreatePage tests", () => {

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ParkCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("redirects to /parks on submit", async () => {

        const restoreConsole = mockConsole();

        mockAdd.mockReturnValue({
            "Park": {
                id: 3,
                name: "Anderson Park",
                address: "123 Fake Ave",
                rating: "3.9"
            }
        });

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ParkCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        const nameInput = screen.getByLabelText("Name");
        expect(nameInput).toBeInTheDocument();


        const addressInput = screen.getByLabelText("Address");
        expect(addressInput).toBeInTheDocument();
        
        const ratingInput = screen.getByLabelText("Rating");
        expect(ratingInput).toBeInTheDocument();
        

        const createButton = screen.getByText("Create");
        expect(createButton).toBeInTheDocument();

        await act(async () => {
            fireEvent.change(nameInput, { target: { value: 'Anderson Park' } })
            fireEvent.change(addressInput, { target: { value: '123 Fake Ave' } })
            fireEvent.change(ratingInput, { target: { value: '3.9' } })
            fireEvent.click(createButton);
        });

        await waitFor(() => expect(mockAdd).toHaveBeenCalled());
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/parks"));

        // assert - check that the console.log was called with the expected message
        expect(console.log).toHaveBeenCalled();
        const message = console.log.mock.calls[0][0];
        const expectedMessage =  `createdPark: {"Park":{"id":3,"name":"Anderson Park","address":"123 Fake Ave","rating":"3.9"}}`
        expect(message).toMatch(expectedMessage);
        restoreConsole();

    });

});


