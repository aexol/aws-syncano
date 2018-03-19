# Create AWS S3 bucket using syncano socket.

This is an example usage of syncano aws-storage socket.

## Create and init syncano project

First you need to create syncano project.

```
mkdir sample-aws-storage-socket-use
cd sample-aws-storage-socket-use
npx s init
cd syncano
```

## Add remote aws-storage socket and it's dependencies to your syncano instance.

So, it's pretty straightforward stuff, aws-storage depends on two sockets, aws-utils and aws-config (as all of our aws sockets do). We need to add them from registry.

Be careful, order in which you add them matters.

```
npx s add aws-config
npx s add aws-storage
```

And deploy it

```
npx s deploy
```

## Initialize your aws-stoarge config.

```
npx s call aws-config/install
```

This will ask you for 3 things, namely: 
* AWS_ACCESS_KEY_ID - that's an access key to your aws account.
* AWS_SECRET_ACCESS_KEY - that's a secret key to your aws account.
* REGION - That's a region on which your instance will operate.

## Upload file

Check your instance with, it's at the top in after `Current Instance:`
```
npx s
```

Upload file using for example `curl`, you'll get link to uploaded file in response ^^

```
curl -H "Content-Type: application/json" -H "X-API-KEY: ${SYNCANO_ACCOUNT_KEY}" -X POST https://api.syncano.io/v2/instances/${instance_name}/endpoints/sockets/aws-storage/upload/ -d '{"name": "socket.yml", "file": "ZGVwZW5kZW5jaWVzOgogIHNvY2tldHM6CiAgICBhd3MtdXRpbHM6CiAgICAgIHZlcnNpb246IDAuMC4xCiAgICBhd3MtY29uZmlnOgogICAgICB2ZXJzaW9uOiAwLjAuMgogICAgYXdzLXN0b3JhZ2U6CiAgICAgIHZlcnNpb246IDAuMC4zCg=="}'
```
