import React from 'react';
import ParkTable from 'main/components/Parks/ParkTable';
import { parkFixtures } from 'fixtures/parkFixtures';

export default {
    title: 'components/Parks/ParkTable',
    component: ParkTable
};

const Template = (args) => {
    return (
        <ParkTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    parks: []
};

export const ThreeSubjectsNoButtons = Template.bind({});

ThreeSubjectsNoButtons.args = {
    parks: parkFixtures.threeParks,
    showButtons: false
};

export const ThreeSubjectsWithButtons = Template.bind({});
ThreeSubjectsWithButtons.args = {
    parks: parkFixtures.threeParks,
    showButtons: true
};