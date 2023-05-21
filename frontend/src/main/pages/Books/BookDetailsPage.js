import React from 'react'
import { useParams } from 'react-router-dom'
import { useBackend } from 'main/utils/useBackend';

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import BookTable from 'main/components/Books/BookTable';
import { useCurrentUser } from 'main/utils/currentUser'

export default function BooksDetailsPage() {
  let { id } = useParams();

  const currentUser = useCurrentUser();

  const { data: book, error: _error, status: _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      [`/api/books?id=${id}`],
      { method: "GET", 
        url: "/api/books", 
        params: {
          id
        } 
      },
    );

  console.log(book);

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Book Details</h1>
        {book &&
          <BookTable books={book} currentUser={currentUser} />
        }
      </div>
    </BasicLayout>
  )
}