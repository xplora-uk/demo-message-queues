# message-queues-demo

demo applications for message queues

Microservices -> delay a task or inform other systems interested in an event and send required info.

Queue systems: RabbitMQ, AWS SQS

Methods:

1. many microservices --(AMQP)--> RabbitMQ --(AMQP)--> other systems

Challenge: try to maintain connections, adjust according to that tech

2. many microservices --(HTTP)--> publisher proxy (API) --(AMQP)--> RabbitMQ --(AMQP)--> subscriber proxy --(HTTP)--> other systems (WebHooks)

Advantage: simplifies tech on microservices; API comes with contract, validation, structured communication.

```sh
# terminal one
cd publisher-proxy
npm i
cp _sample.env .env
# edit .env
npm run start
```

```sh
# terminal two or postman
curl --location 'http://localhost:15000/publish/queue1' \
--header 'Content-Type: application/json' \
--data '{
  "customerId": 123,
  "firstName": "John",
  "lastName": "Smith"
}'
```

```sh
# terminal three
cd subscriber-proxy
npm i
cp _sample.env .env
# edit .env
npm run start
# let it receive and process messages
```
