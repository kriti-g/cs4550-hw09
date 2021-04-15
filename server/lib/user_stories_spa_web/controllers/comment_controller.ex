defmodule UserStoriesSpaWeb.CommentController do
  use UserStoriesSpaWeb, :controller

  alias UserStoriesSpa.Comments
  alias UserStoriesSpa.Comments.Comment
  alias UserStoriesSpaWeb.Plugs

  plug Plugs.RequireLoggedIn when action in [:show, :update, :delete, :create]

  action_fallback UserStoriesSpaWeb.FallbackController

  def index(conn, _params) do
    comments = Comments.list_comments()
    render(conn, "index.json", comments: comments)
  end

  def create(conn, %{"comment" => comment_params}) do
    case Comments.create_comment(comment_params) do
      {:ok, %Comment{} = comm} ->
        comment = Comments.load_user(comm)
        conn
        |> put_status(:created)
        |> put_resp_header("location", Routes.comment_path(conn, :show, comment))
        |> render("show.json", comment: comment)
      {:error, _changeset} ->
        conn
        |> put_resp_header("content-type", "application/json; charset=UTF-8")
        |> send_resp(422, Jason.encode!(%{error: "Failed to create comment."}))
    end
  end

  def show(conn, %{"id" => id}) do
    comm = Comments.get_comment!(id)
    comment = Comments.load_user(comm)
    render(conn, "show.json", comment: comment)
  end

  def update(conn, %{"id" => id, "comment" => comment_params}) do
    comment = Comments.get_comment!(id)
    case Comments.update_comment(comment, comment_params) do
      {:ok, %Comment{} = comment} ->
        render(conn, "show.json", comment: comment)
      {:error, _changeset} ->
        conn
        |> put_resp_header("content-type", "application/json; charset=UTF-8")
        |> send_resp(422, Jason.encode!(%{error: "Failed to update comment."}))
    end
  end

  def delete(conn, %{"id" => id}) do
    comment = Comments.get_comment!(id)
    case Comments.delete_comment(comment) do
      {:ok, %Comment{}} ->
        send_resp(conn, :no_content, "")
      {:error, _changeset} ->
        conn
        |> put_resp_header("content-type", "application/json; charset=UTF-8")
        |> send_resp(422, Jason.encode!(%{error: "Failed to delete comment."}))
    end
  end
end
