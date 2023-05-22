// get parks from local storage
const get = () => {
    const parkValue = localStorage.getItem("parks");
    if (parkValue === undefined) {
        const parkCollection = { nextId: 1, parks: [] }
        return set(parkCollection);
    }
    const parkCollection = JSON.parse(parkValue);
    if (parkCollection === null) {
        const parkCollection = { nextId: 1, parks: [] }
        return set(parkCollection);
    }
    return parkCollection;
};

const getById = (id) => {
    if (id === undefined) {
        return { "error": "id is a required parameter" };
    }
    const parkCollection = get();
    const parks = parkCollection.parks;

    /* eslint-disable-next-line eqeqeq */ // we really do want == here, not ===
    const index = parks.findIndex((r) => r.id == id);
    if (index === -1) {
        return { "error": `park with id ${id} not found` };
    }
    return { park: parks[index] };
}

// set parks in local storage
const set = (parkCollection) => {
    localStorage.setItem("parks", JSON.stringify(parkCollection));
    return parkCollection;
};

// add a park to local storage
const add = (park) => {
    const parkCollection = get();
    park = { ...park, id: parkCollection.nextId };
    parkCollection.nextId++;
    parkCollection.parks.push(park);
    set(parkCollection);
    return park;
};

// update a park in local storage
const update = (park) => {
    const parkCollection = get();

    const parks = parkCollection.parks;

    /* eslint-disable-next-line eqeqeq */ // we really do want == here, not ===
    const index = parks.findIndex((r) => r.id == park.id);
    if (index === -1) {
        return { "error": `park with id ${park.id} not found` };
    }
    parks[index] = park;
    set(parkCollection);
    return { parkCollection: parkCollection };
};

// delete a park from local storage
const del = (id) => {
    if (id === undefined) {
        return { "error": "id is a required parameter" };
    }
    const parkCollection = get();
    const parks = parkCollection.parks;

    /* eslint-disable-next-line eqeqeq */ // we really do want == here, not ===
    const index = parks.findIndex((r) => r.id == id);
    if (index === -1) {
        return { "error": `park with id ${id} not found` };
    }
    parks.splice(index, 1);
    set(parkCollection);
    return { parkCollection: parkCollection };
};

const parkUtils = {
    get,
    getById,
    add,
    update,
    del
};

export { parkUtils };



