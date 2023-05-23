import React from 'react';
import ParkForm from "main/components/Parks/ParkForm"
import { parkFixtures } from 'fixtures/parkFixtures';

export default {
    title: 'components/Parks/ParkForm',
    component: ParkForm
};

const Template = (args) => {
    return (
        <ParkForm {...args} />
    )
};

export const Default = Template.bind({});

Default.args = {
    submitText: "Create",
    submitAction: () => { console.log("Submit was clicked"); }
};

export const Show = Template.bind({});

Show.args = {
    Park: parkFixtures.onePark,
    submitText: "",
    submitAction: () => { }
};