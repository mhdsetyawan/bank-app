const fastify = require("fastify")({ logger: true });
const { createClient } = require("@supabase/supabase-js");
const prisma = require("@prisma/client");
const { PrismaClient } = prisma;

const prismaClient = new PrismaClient();

// Supabase client setup
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function processTransaction(transaction) {
  return new Promise((resolve) => {
    setTimeout(() => {
      transaction.status = "completed";
      resolve(transaction);
    }, 30000); // 30 seconds
  });
}

// Send money from one account to another
fastify.post("/send", async (request, reply) => {
  const { authorization } = request.headers;
  const token = authorization.split(" ")[1];

  const { data: user, error } = await supabase.auth.getUser(token);
  if (error) return reply.status(401).send({ error: error.message });

  const { fromAccount, toAccount, amount } = request.body;

  let transaction = await prismaClient.transaction.create({
    data: {
      fromAccount,
      toAccount,
      amount,
      status: "processing",
    },
  });

  transaction = await processTransaction(transaction);

  await prismaClient.transaction.update({
    where: { id: transaction.id },
    data: transaction,
  });

  reply.send(transaction);
});

// Withdraw money from an account
fastify.post("/withdraw", async (request, reply) => {
  const { authorization } = request.headers;
  const token = authorization.split(" ")[1];

  const { data: user, error } = await supabase.auth.getUser(token);
  if (error) return reply.status(401).send({ error: error.message });

  const { fromAccount, amount } = request.body;

  let transaction = await prismaClient.transaction.create({
    data: {
      fromAccount,
      toAccount: fromAccount, // Assuming withdrawal to the same account
      amount,
      status: "processing",
    },
  });

  transaction = await processTransaction(transaction);

  await prismaClient.transaction.update({
    where: { id: transaction.id },
    data: transaction,
  });

  reply.send(transaction);
});

fastify.listen({ port: 3002, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`server listening on ${address}`);
});
