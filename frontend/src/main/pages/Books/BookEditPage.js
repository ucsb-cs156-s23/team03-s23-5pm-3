import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import BookForm from "main/components/Books/BookForm";
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function BooksEditPage() {
  let { id } = useParams();

  const { data: Book, error, status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      [`/api/books?id=${id}`],
      {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
        method: "GET",
        url: `/api/books`,
        params: {
          id
        }
      }
    );


  const objectToAxiosPutParams = (Book) => ({
    url: "/api/books",
    method: "PUT",
    params: {
      id: Book.id,
    },
    data: {
      title: Book.title,
      author: Book.author,
      genre: Book.genre
    }
  });

  const onSuccess = (Book) => {
    toast(`Book Updated - id: ${Book.id} title: ${Book.title} author: ${Book.author} genre: ${Book.genre}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosPutParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    [`/api/books?id=${id}`]
  );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess) {
    return <Navigate to="/Books/list" />
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit Book</h1>
        {Book &&
          <BookForm initialContents={Book} submitAction={onSubmit} buttonLabel="Update" />
        }
      </div>
    </BasicLayout>
  )
}

