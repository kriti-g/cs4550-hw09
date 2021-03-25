# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     UserStoriesSpa.Repo.insert!(%UserStoriesSpa.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.

alias UserStoriesSpa.Repo
alias UserStoriesSpa.Users.User
alias UserStoriesSpa.Events.Event
alias UserStoriesSpa.Users.Comment

defmodule Inject do

  def user(name, pass, email) do
    hash = Argon2.hash_pwd_salt(pass)
    Repo.insert!(%User{name: name, email: email, password_hash: hash})
  end
end

alice = Inject.user("Alice", "password1", "alice@email.com")
bob = Inject.user("Bob", "passwordd2", "bob@email.com")

e1 = %Event{
  user_id: alice.id,
  name: "Alice Event",
  desc: "Alice says Hi (in a while)!",
  date: ~N[2022-01-01 23:00:00]
}
Repo.insert!(e1)

c1 = %Comment{
  user_id: alice.id,
  event_id: e1.id,
  body: "alice left a comment"
}
Repo.insert!(c1)

e2 = %Event{
  user_id: bob.id,
  name: "Bob Event",
  desc: "Bob says garblarg (on a specified date)!",
  date: ~N[2022-01-19 23:00:00]
}
Repo.insert!(e2)
