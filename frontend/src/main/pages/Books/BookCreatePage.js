import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import BookForm from "main/components/Books/BookForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function BooksCreatePage() {

  const objectToAxiosParams = (Book) => ({
    url: "/api/books/post",
    method: "POST",
    params: {
      title: Book.title,
      author: Book.author,
      genre: Book.genre
    }
  });

  const onSuccess = (Book) => {
    toast(`New Book Created - id: ${Book.id} author: ${Book.author}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosParams,
     { onSuccess }, 
     // Stryker disable next-line all : hard to set up test for caching
     ["/api/books/all"]
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
        <h1>Create New Book</h1>

        <BookForm submitAction={onSubmit} />

      </div>
    </BasicLayout>
  )
}