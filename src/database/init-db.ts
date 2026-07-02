import { prisma } from "./prisma-client";

async function main() {
  console.log("Starting database initialization...");

  // Verifica se já existem registos para garantir a idempotência
  const count = await prisma.tripRequest.count();

  if (count > 0) {
    console.log(
      `Database already contains ${count} trip requests. Skipping seed to maintain idempotency.`,
    );
    return;
  }

  console.log("Inserting 10 initial trip requests...");

  await prisma.tripRequest.createMany({
    data: [
      {
        requesterName: "Alice Souza",
        origin: "Parnaíba",
        destination: "Teresina",
        departureAt: new Date("2026-08-10T08:00:00.000Z"),
        returnAt: new Date("2026-08-12T18:00:00.000Z"),
        purpose: "Participação em congresso acadêmico",
        passengerCount: 2,
        status: "pending",
      },
      {
        requesterName: "Bruno Lima",
        origin: "Parnaíba",
        destination: "Piripiri",
        departureAt: new Date("2026-09-15T07:30:00.000Z"),
        returnAt: new Date("2026-09-15T19:00:00.000Z"),
        purpose: "Reunião de alinhamento de projeto de extensão",
        passengerCount: 4,
        status: "pending",
      },
      {
        requesterName: "Carla Dias",
        origin: "Teresina",
        destination: "Parnaíba",
        departureAt: new Date("2026-10-05T09:00:00.000Z"),
        returnAt: new Date("2026-10-07T14:00:00.000Z"),
        purpose: "Defesa de dissertação",
        passengerCount: 1,
        status: "pending",
      },
      {
        requesterName: "Diego Fernandes",
        origin: "Picos",
        destination: "Teresina",
        departureAt: new Date("2026-10-20T06:00:00.000Z"),
        returnAt: new Date("2026-10-22T20:00:00.000Z"),
        purpose: "Treinamento administrativo",
        passengerCount: 3,
        status: "canceled", // Algumas já podem estar canceladas para testes
      },
      {
        requesterName: "Elena Costa",
        origin: "Parnaíba",
        destination: "Floriano",
        departureAt: new Date("2026-11-03T08:00:00.000Z"),
        returnAt: new Date("2026-11-05T17:00:00.000Z"),
        purpose: "Apresentação de artigo",
        passengerCount: 2,
        status: "pending",
      },
      {
        requesterName: "Fábio Gomes",
        origin: "São Raimundo Nonato",
        destination: "Teresina",
        departureAt: new Date("2026-11-10T05:00:00.000Z"),
        returnAt: new Date("2026-11-12T22:00:00.000Z"),
        purpose: "Reunião da reitoria",
        passengerCount: 4,
        status: "pending",
      },
      {
        requesterName: "Gabriela Santos",
        origin: "Parnaíba",
        destination: "Corrente",
        departureAt: new Date("2026-07-20T07:00:00.000Z"),
        returnAt: new Date("2026-07-25T18:00:00.000Z"),
        purpose: "Pesquisa de campo",
        passengerCount: 3,
        status: "pending",
      },
      {
        requesterName: "Henrique Alves",
        origin: "Teresina",
        destination: "Parnaíba",
        departureAt: new Date("2026-08-25T08:30:00.000Z"),
        returnAt: new Date("2026-08-26T16:00:00.000Z"),
        purpose: "Manutenção de equipamentos de laboratório",
        passengerCount: 2,
        status: "pending",
      },
      {
        requesterName: "Isabela Martins",
        origin: "Parnaíba",
        destination: "Teresina",
        departureAt: new Date("2026-09-02T06:30:00.000Z"),
        returnAt: new Date("2026-09-04T12:00:00.000Z"),
        purpose: "Evento acadêmico",
        passengerCount: 1,
        status: "canceled",
      },
      {
        requesterName: "João Pedro",
        origin: "Oeiras",
        destination: "Teresina",
        departureAt: new Date("2026-10-14T07:00:00.000Z"),
        returnAt: new Date("2026-10-15T19:00:00.000Z"),
        purpose: "Audiência pública",
        passengerCount: 3,
        status: "pending",
      },
    ],
  });

  console.log("Database initialized successfully with 10 records!");
}

main()
  .catch((e) => {
    console.error("Error initializing database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
