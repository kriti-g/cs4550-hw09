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

alice = Repo.insert!(%User{name: "alice", password_hash: "", email: "alice@email.com"})
bob = Repo.insert!(%User{name: "bob", password_hash: "", email: "bob@email.com"})

e1 = %Event{
  user_id: alice.id,
  name: "Alice Event",
  desc: "Alice says Hi (in a while)!",
  date: ~N[2022-01-01 23:00:00]
}
Repo.insert!(e1)

e2 = %Event{
  user_id: bob.id,
  name: "Bob Event",
  desc: "Bob says garblarg (on a specified date)!",
  date: ~N[2022-01-19 23:00:00]
}
Repo.insert!(e2)
