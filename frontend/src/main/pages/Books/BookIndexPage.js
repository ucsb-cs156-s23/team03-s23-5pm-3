import React from 'react'
import { useBackend } from 'main/utils/useBackend';

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import BooksTable from 'main/components/Books/BookTable';
import { useCurrentUser } from 'main/utils/currentUser'

export default function BooksIndexPage() {

  const currentUser = useCurrentUser();

  const { data: dates, error: _error, status: _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      ["/api/Books/all"],
      { method: "GET", url: "/api/Books/all" },
      []
    );

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Books</h1>
        <BooksTable dates={dates} currentUser={currentUser} />
      </div>
    </BasicLayout>
  )
}