import React from 'react'
import { useParams } from 'react-router-dom'
import { useBackend } from 'main/utils/useBackend';

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import ParkTable from 'main/components/Parks/ParkTable';
import { useCurrentUser } from 'main/utils/currentUser'

export default function ParksDetailsPage() {
  let { id } = useParams();

  const currentUser = useCurrentUser();

  const { data: park, error: _error, status: _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      [`/api/parks?id=${id}`],
      { // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
        method: "GET", 
        url: "/api/parks", 
        params: {
          id
        } 
      }
    );
    
  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Park Details</h1>
        {park && <ParkTable parks={[park]} currentUser={currentUser} showButtons={false}/>}
      </div>
    </BasicLayout>
  )
}