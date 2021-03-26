#!/bin/bash

export MIX_ENV=prod
export PORT=4750

CFGD=$(readlink -f ~/.config/user_stories_spa)

if [ ! -e "$CFGD/base" ]; then
    echo "run deploy first"
    exit 1
fi

DB_PASS=$(cat "$CFGD/db_pass")
export DATABASE_URL=ecto://user_stories_spa:$DB_PASS@localhost/user_stories_spa_prod

SECRET_KEY_BASE=$(cat "$CFGD/base")
export SECRET_KEY_BASE

_build/prod/rel/user_stories_spa/bin/user_stories_spa start
