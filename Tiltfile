docker_compose('./docker-compose-dev.yml')


local_resource('pnpm i', cmd='pnpm i', deps=['packages.json', 'pnpm-lock.yaml'])
local_resource("api service", serve_cmd='pnpm run:api', resource_deps=['pnpm i'])
local_resource("cron job", serve_cmd='pnpm run:cron', resource_deps=['pnpm i'])
local_resource("game consumer", serve_cmd='pnpm run:consumer', resource_deps=['pnpm i'])

docker_prune_settings()