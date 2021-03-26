#!/bin/bash

export MIX_ENV=prod
# Common port range for this is 4000-10,000
# Valid port range for a user app to listen
# on is something like 1025-32767
export PORT=4750
export SECRET_KEY_BASE=9aZ1EsCPeoHveI1uSkcKBQA2vD6WgadKqDCgRLj1pNiKnL4Fx11/l8YR8GOiWLRW
export DATABASE_URL=ecto://user_stories_spa:ainuu2vaeD6i@localhost/user_stories_spa_prod

mix deps.get --only prod
mix compile

mix ecto.reset

mix release
