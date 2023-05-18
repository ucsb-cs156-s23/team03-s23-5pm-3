import { parkFixtures } from "fixtures/parkFixtures";
import { parkUtils } from "main/utils/parkUtils";

describe("parkUtils tests", () => {
    // return a function that can be used as a mock implementation of getItem
    // the value passed in will be convertd to JSON and returned as the value
    // for the key "parks".  Any other key results in an error
    const createGetItemMock = (returnValue) => (key) => {
        if (key === "parks") {
            return JSON.stringify(returnValue);
        } else {
            throw new Error("Unexpected key: " + key);
        }
    };

    describe("get", () => {

        test("When parks is undefined in local storage, should set to empty list", () => {

            // arrange
            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock(undefined));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = parkUtils.get();

            // assert
            const expected = { nextId: 1, parks: [] } ;
            expect(result).toEqual(expected);

            const expectedJSON = JSON.stringify(expected);
            expect(setItemSpy).toHaveBeenCalledWith("parks", expectedJSON);
        });

        test("When parks is null in local storage, should set to empty list", () => {

            // arrange
            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock(null));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = parkUtils.get();

            // assert
            const expected = { nextId: 1, parks: [] } ;
            expect(result).toEqual(expected);

            const expectedJSON = JSON.stringify(expected);
            expect(setItemSpy).toHaveBeenCalledWith("parks", expectedJSON);
        });

        test("When parks is [] in local storage, should return []", () => {

            // arrange
            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 1, parks: [] }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = parkUtils.get();

            // assert
            const expected = { nextId: 1, parks: [] };
            expect(result).toEqual(expected);

            expect(setItemSpy).not.toHaveBeenCalled();
        });

        test("When parks is JSON of three parks, should return that JSON", () => {

            // arrange
            const threeParks = parkFixtures.threeParks;
            const mockParkCollection = { nextId: 10, parks: threeParks };

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock(mockParkCollection));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = parkUtils.get();

            // assert
            expect(result).toEqual(mockParkCollection);
            expect(setItemSpy).not.toHaveBeenCalled();
        });
    });


    describe("getById", () => {
        test("Check that getting a park by id works", () => {

            // arrange
            const threeParks = parkFixtures.threeParks;
            const idToGet = threeParks[1].id;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, parks: threeParks }));

            // act
            const result = parkUtils.getById(idToGet);

            // assert

            const expected = { park: threeParks[1] };
            expect(result).toEqual(expected);
        });

        test("Check that getting a non-existing park returns an error", () => {

            // arrange
            const threeParks = parkFixtures.threeParks;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, parks: threeParks }));

            // act
            const result = parkUtils.getById(99);

            // assert
            const expectedError = `park with id 99 not found`
            expect(result).toEqual({ error: expectedError });
        });

        test("Check that an error is returned when id not passed", () => {

            // arrange
            const threeParks = parkFixtures.threeParks;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, parks: threeParks }));

            // act
            const result = parkUtils.getById();

            // assert
            const expectedError = `id is a required parameter`
            expect(result).toEqual({ error: expectedError });
        });

    });
    describe("add", () => {
        test("Starting from [], check that adding one park works", () => {

            // arrange
            const park = parkFixtures.onePark[0];
            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 1, parks: [] }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = parkUtils.add(park);

            // assert
            expect(result).toEqual(park);
            expect(setItemSpy).toHaveBeenCalledWith("parks",
                JSON.stringify({ nextId: 2, parks: parkFixtures.onePark }));
        });
    });

    describe("update", () => {
        test("Check that updating an existing park works", () => {

            // arrange
            const threeParks = parkFixtures.threeParks;
            const updatedPark = {
                ...threeParks[0],
                name: "Updated Name"
            };
            const threeParksUpdated = [
                updatedPark,
                threeParks[1],
                threeParks[2]
            ];

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, parks: threeParks }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = parkUtils.update(updatedPark);

            // assert
            const expected = { parkCollection: { nextId: 5, parks: threeParksUpdated } };
            expect(result).toEqual(expected);
            expect(setItemSpy).toHaveBeenCalledWith("parks", JSON.stringify(expected.parkCollection));
        });
        test("Check that updating an non-existing park returns an error", () => {

            // arrange
            const threeParks = parkFixtures.threeParks;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, parks: threeParks }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            const updatedPark = {
                id: 99,
                name: "Fake Name",
                description: "Fake Description"
            }

            // act
            const result = parkUtils.update(updatedPark);

            // assert
            const expectedError = `park with id 99 not found`
            expect(result).toEqual({ error: expectedError });
            expect(setItemSpy).not.toHaveBeenCalled();
        });
    });

    describe("del", () => {
        test("Check that deleting a park by id works", () => {

            // arrange
            const threeParks = parkFixtures.threeParks;
            const idToDelete = threeParks[1].id;
            const threeParksUpdated = [
                threeParks[0],
                threeParks[2]
            ];

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, parks: threeParks }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = parkUtils.del(idToDelete);

            // assert

            const expected = { parkCollection: { nextId: 5, parks: threeParksUpdated } };
            expect(result).toEqual(expected);
            expect(setItemSpy).toHaveBeenCalledWith("parks", JSON.stringify(expected.parkCollection));
        });
        test("Check that deleting a non-existing park returns an error", () => {

            // arrange
            const threeParks = parkFixtures.threeParks;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, parks: threeParks }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = parkUtils.del(99);

            // assert
            const expectedError = `park with id 99 not found`
            expect(result).toEqual({ error: expectedError });
            expect(setItemSpy).not.toHaveBeenCalled();
        });
        test("Check that an error is returned when id not passed", () => {

            // arrange
            const threeParks = parkFixtures.threeParks;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, parks: threeParks }));

            // act
            const result = parkUtils.del();

            // assert
            const expectedError = `id is a required parameter`
            expect(result).toEqual({ error: expectedError });
        });
    });
});

