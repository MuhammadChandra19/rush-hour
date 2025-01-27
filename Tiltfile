docker_compose('./docker-compose-dev.yml')


local_resource('pnpm i', cmd='pnpm i', deps=['packages.json', 'pnpm-lock.yaml'])
local_resource('build resource', cmd='pnpm run build', deps=['packages.json', 'pnpm-lock.yaml'])
local_resource("api service", serve_cmd='pnpm run:api', resource_deps=['build resource'])
local_resource("cron job", serve_cmd='pnpm run:cron', resource_deps=['build resource'])
local_resource("game consumer", serve_cmd='pnpm run:consumer', resource_deps=['build resource'])

docker_prune_settings()