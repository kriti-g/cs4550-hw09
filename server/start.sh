#!/bin/bash

export MIX_ENV=prod
export PORT=4750
export DATABASE_URL=ecto://user_stories_spa:ainuu2vaeD6i@localhost/user_stories_spa_prod
export SECRET_KEY_BASE=9aZ1EsCPeoHveI1uSkcKBQA2vD6WgadKqDCgRLj1pNiKnL4Fx11/l8YR8GOiWLRW

echo "Starting app..."

_build/prod/rel/user_stories_spa/bin/user_stories_spa start
