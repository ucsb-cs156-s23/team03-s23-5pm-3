import React from 'react'
import { useBackend } from 'main/utils/useBackend';
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import ParksTable from 'main/components/Parks/ParkTable';
import { useCurrentUser } from 'main/utils/currentUser'

export default function ParksIndexPage() {

  const currentUser = useCurrentUser();

  const { data: parks, error: _error, status: _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      ["/api/parks/all"],
      { method: "GET", url: "/api/parks/all" },
      []
    );

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Parks</h1>
        <ParksTable parks={parks} currentUser={currentUser} />
      </div>
    </BasicLayout>
  )
}