const fastify = require("fastify")({ logger: true });
const { createClient } = require("@supabase/supabase-js");
const prisma = require("@prisma/client");
const { PrismaClient } = prisma;

const prismaClient = new PrismaClient();

// Supabase client setup
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Register a new user
fastify.post("/register", async (request, reply) => {
  const { email, password } = request.body;
  const { data, error } = await supabase.auth.signUp({ email, password });
  console.log(error);
  if (error) return reply.status(400).send({ error: error.message });

  // Create user in Prisma
  const user = await prismaClient.user.create({
    data: {
      username: email, // Use email as username
      password, // In production, this should be hashed
    },
  });

  reply.send({ user });
});

// Login user
fastify.post("/login", async (request, reply) => {
  const { email, password } = request.body;
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) return reply.status(401).send({ error: error.message });

  reply.send({ token: data.session.access_token });
});

// Get payment accounts for logged-in user
fastify.get("/accounts", async (request, reply) => {
  const { authorization } = request.headers;
  const token = authorization.split(" ")[1];

  const { data: user, error } = await supabase.auth.getUser(token);
  if (error) return reply.status(401).send({ error: error.message });

  const accounts = await prismaClient.paymentAccount.findMany({
    where: { userId: user.id },
    include: { history: true },
  });

  reply.send(accounts);
});

fastify.listen({ port: 3001, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`server listening on ${address}`);
});
