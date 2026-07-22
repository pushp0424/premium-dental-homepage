import "dotenv/config";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? "file:./prisma/dev.db" });
const prisma = new PrismaClient({ adapter });

faker.seed(42);

const DEMO_PASSWORD = "Demo1234!";

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: readonly T[]): T {
  return arr[randomInt(0, arr.length - 1)];
}

function weightedPick<T>(entries: [T, number][]): T {
  const total = entries.reduce((sum, [, w]) => sum + w, 0);
  let r = Math.random() * total;
  for (const [value, weight] of entries) {
    if (r < weight) return value;
    r -= weight;
  }
  return entries[entries.length - 1][0];
}

function confirmationCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "MD-";
  for (let i = 0; i < 6; i++) code += chars[randomInt(0, chars.length - 1)];
  return code;
}

async function main() {
  console.log("Clearing existing data...");
  await prisma.reminder.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.invoiceItem.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.document.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.workingHour.deleteMany();
  await prisma.service.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.location.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.user.deleteMany();

  console.log("Seeding locations...");
  const locationsData = [
    {
      name: "Meridian Dental — Downtown",
      addressLine: "412 Congress Avenue, Suite 200",
      city: "Austin",
      state: "TX",
      zip: "78701",
      phone: "(512) 555-0142",
      lat: 30.2672,
      lng: -97.7431,
      hoursNote: "Mon–Fri 8:00am–6:00pm · Sat 9:00am–2:00pm",
      imageColor: "#0B5FFF",
    },
    {
      name: "Meridian Dental — Uptown",
      addressLine: "2100 Guadalupe Street",
      city: "Austin",
      state: "TX",
      zip: "78705",
      phone: "(512) 555-0198",
      lat: 30.2952,
      lng: -97.7423,
      hoursNote: "Mon–Fri 7:30am–5:30pm",
      imageColor: "#1E88E5",
    },
    {
      name: "Meridian Dental — Westside",
      addressLine: "5601 Bee Cave Road, Building 3",
      city: "Austin",
      state: "TX",
      zip: "78746",
      phone: "(512) 555-0173",
      lat: 30.2849,
      lng: -97.8264,
      hoursNote: "Mon–Sat 8:00am–6:00pm",
      imageColor: "#0EA5A4",
    },
  ];
  const locations = [];
  for (const data of locationsData) {
    locations.push(await prisma.location.create({ data }));
  }

  console.log("Seeding services...");
  const servicesData = [
    { name: "Comprehensive Exam & Cleaning", category: "Preventive", description: "A full checkup, professional cleaning, and personalized oral health plan.", durationMinutes: 60, price: 150, icon: "sparkles" },
    { name: "Digital X-Rays", category: "Preventive", description: "Low-radiation digital imaging to catch issues early.", durationMinutes: 30, price: 85, icon: "scan" },
    { name: "Fluoride Treatment", category: "Preventive", description: "Strengthens enamel and helps prevent decay.", durationMinutes: 20, price: 45, icon: "shield" },
    { name: "Tooth-Colored Filling", category: "Restorative", description: "Durable, natural-looking composite fillings.", durationMinutes: 45, price: 220, icon: "droplet" },
    { name: "Dental Crown", category: "Restorative", description: "Custom-crafted crowns to restore strength and shape.", durationMinutes: 90, price: 1200, icon: "gem" },
    { name: "Root Canal Therapy", category: "Restorative", description: "Gentle, modern endodontic treatment to save the natural tooth.", durationMinutes: 120, price: 950, icon: "activity" },
    { name: "Professional Teeth Whitening", category: "Cosmetic", description: "In-office whitening for a noticeably brighter smile in one visit.", durationMinutes: 60, price: 395, icon: "sun" },
    { name: "Porcelain Veneers", category: "Cosmetic", description: "Ultra-thin custom veneers for a flawless, natural finish.", durationMinutes: 90, price: 1450, icon: "gem" },
    { name: "Invisalign Consultation", category: "Orthodontics", description: "Free consult to map out a clear-aligner treatment plan.", durationMinutes: 45, price: 0, icon: "align-center" },
    { name: "Braces Adjustment", category: "Orthodontics", description: "Routine adjustment for patients in active orthodontic treatment.", durationMinutes: 30, price: 150, icon: "settings" },
    { name: "Tooth Extraction", category: "Surgical", description: "Simple extraction performed with modern comfort techniques.", durationMinutes: 45, price: 275, icon: "scissors" },
    { name: "Wisdom Teeth Removal", category: "Surgical", description: "Surgical removal of impacted or problematic wisdom teeth.", durationMinutes: 90, price: 650, icon: "scissors" },
    { name: "Child Dental Checkup", category: "Pediatric", description: "Gentle, kid-friendly exam and cleaning for younger patients.", durationMinutes: 45, price: 120, icon: "smile" },
    { name: "Emergency Dental Visit", category: "Emergency", description: "Same-day care for pain, trauma, or urgent dental issues.", durationMinutes: 60, price: 250, icon: "zap" },
  ];
  const services = [];
  for (const data of servicesData) {
    services.push(await prisma.service.create({ data }));
  }

  console.log("Seeding doctors...");
  const doctorsData = [
    { firstName: "Sarah", lastName: "Chen", credentials: "DDS", specialty: "General & Family Dentistry", bio: "Dr. Chen has spent over a decade helping families build lifelong healthy habits, with a calm, detail-oriented approach to preventive care.", yearsExperience: 12, photoColor: "#0B5FFF", locIdx: [0, 1] },
    { firstName: "Michael", lastName: "Alvarez", credentials: "DMD", specialty: "Restorative Dentistry", bio: "Dr. Alvarez specializes in crowns, bridges, and full-mouth restorations, combining precision craftsmanship with a gentle chairside manner.", yearsExperience: 16, photoColor: "#1E88E5", locIdx: [0, 2] },
    { firstName: "Priya", lastName: "Nair", credentials: "DDS, MS", specialty: "Orthodontics", bio: "Board-certified orthodontist Dr. Nair has guided thousands of patients through Invisalign and traditional braces treatment plans.", yearsExperience: 9, photoColor: "#7C3AED", locIdx: [1] },
    { firstName: "James", lastName: "Whitfield", credentials: "DDS", specialty: "Pediatric Dentistry", bio: "Dr. Whitfield's warm, patient approach makes him a favorite with younger patients and anxious first-timers alike.", yearsExperience: 7, photoColor: "#F59E0B", locIdx: [0] },
    { firstName: "Olivia", lastName: "Bennett", credentials: "DMD", specialty: "Oral & Maxillofacial Surgery", bio: "Dr. Bennett brings advanced surgical training to extractions, implants, and wisdom teeth removal with a strong focus on comfort.", yearsExperience: 14, photoColor: "#0EA5A4", locIdx: [2] },
    { firstName: "Daniel", lastName: "Kim", credentials: "DDS", specialty: "Cosmetic Dentistry", bio: "Dr. Kim designs smile makeovers using veneers and whitening, blending artistry with modern digital smile design.", yearsExperience: 11, photoColor: "#EC4899", locIdx: [1, 2] },
  ];
  const doctors = [];
  for (const d of doctorsData) {
    const doctor = await prisma.doctor.create({
      data: {
        firstName: d.firstName,
        lastName: d.lastName,
        credentials: d.credentials,
        specialty: d.specialty,
        bio: d.bio,
        yearsExperience: d.yearsExperience,
        photoColor: d.photoColor,
        languages: Math.random() > 0.6 ? "English, Spanish" : "English",
      },
    });
    doctors.push({ ...doctor, locIdx: d.locIdx });

    for (const li of d.locIdx) {
      const days = [1, 2, 3, 4, 5]; // Mon-Fri
      const saturdays = li === 2 ? [6] : [];
      for (const day of [...days, ...saturdays]) {
        await prisma.workingHour.create({
          data: {
            doctorId: doctor.id,
            locationId: locations[li].id,
            dayOfWeek: day,
            startMinute: day === 6 ? 9 * 60 : 8 * 60,
            endMinute: day === 6 ? 14 * 60 : 17 * 60,
          },
        });
      }
    }
  }

  console.log("Seeding admin account...");
  const adminPasswordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  await prisma.user.create({
    data: {
      email: "admin@meridiandental.com",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    },
  });

  console.log("Seeding patients...");
  const patientPasswordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  const insuranceProviders = ["Delta Dental", "Cigna", "MetLife", "Aetna", "Guardian", null];
  const patients: { id: string; firstName: string; lastName: string }[] = [];

  // Featured demo patient — always present, always predictable.
  const demoUser = await prisma.user.create({
    data: { email: "sarah.patient@demo.com", passwordHash: patientPasswordHash, role: "PATIENT" },
  });
  const demoPatient = await prisma.patient.create({
    data: {
      userId: demoUser.id,
      firstName: "Sarah",
      lastName: "Patient",
      phone: "(512) 555-0110",
      dateOfBirth: new Date(1992, 3, 14),
      gender: "Female",
      addressLine: "1180 S Lamar Blvd",
      city: "Austin",
      state: "TX",
      zip: "78704",
      insuranceProvider: "Delta Dental",
      insuranceMemberId: "DD-88421903",
      emergencyContactName: "James Patient",
      emergencyContactPhone: "(512) 555-0111",
      avatarColor: "#0B5FFF",
    },
  });
  patients.push(demoPatient);

  for (let i = 0; i < 180; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet
      .email({ firstName, lastName, provider: "example.com" })
      .toLowerCase();
    const user = await prisma.user.create({
      data: { email, passwordHash: patientPasswordHash, role: "PATIENT" },
    });
    const patient = await prisma.patient.create({
      data: {
        userId: user.id,
        firstName,
        lastName,
        phone: faker.phone.number({ style: "national" }),
        dateOfBirth: faker.date.birthdate({ min: 4, max: 82, mode: "age" }),
        gender: pick(["Female", "Male", "Non-binary"]),
        addressLine: faker.location.streetAddress(),
        city: "Austin",
        state: "TX",
        zip: faker.location.zipCode("787##"),
        insuranceProvider: pick(insuranceProviders),
        insuranceMemberId: Math.random() > 0.3 ? faker.string.alphanumeric(9).toUpperCase() : null,
        emergencyContactName: faker.person.fullName(),
        emergencyContactPhone: faker.phone.number({ style: "national" }),
        avatarColor: pick(["#0B5FFF", "#1E88E5", "#7C3AED", "#F59E0B", "#0EA5A4", "#EC4899"]),
      },
    });
    patients.push(patient);
  }

  console.log("Generating appointments (this simulates ~15 weeks of schedule)...");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startRange = new Date(today);
  startRange.setDate(startRange.getDate() - 70);
  const endRange = new Date(today);
  endRange.setDate(endRange.getDate() + 35);

  const usedCodes = new Set<string>();
  function uniqueCode() {
    let code = confirmationCode();
    while (usedCodes.has(code)) code = confirmationCode();
    usedCodes.add(code);
    return code;
  }

  type Row = {
    confirmationCode: string;
    patientId: string;
    doctorId: string;
    locationId: string;
    serviceId: string;
    startsAt: Date;
    endsAt: Date;
    status: "COMPLETED" | "NO_SHOW" | "CANCELLED" | "CONFIRMED" | "PENDING";
    reasonNote: string | null;
    cancelReason: string | null;
  };
  const appointmentRows: Row[] = [];

  for (const doctor of doctors) {
    const workingHours = await prisma.workingHour.findMany({ where: { doctorId: doctor.id } });
    for (let d = new Date(startRange); d <= endRange; d.setDate(d.getDate() + 1)) {
      const dow = d.getDay();
      const blocksForDay = workingHours.filter((w) => w.dayOfWeek === dow);
      if (blocksForDay.length === 0) continue;
      const block = blocksForDay[0];
      const isPast = d < today;
      let pointer = block.startMinute;
      while (pointer < block.endMinute) {
        const bookProbability = isPast ? 0.16 : 0.1;
        if (Math.random() < bookProbability) {
          const service = pick(services);
          const duration = Math.max(20, service.durationMinutes);
          if (pointer + duration > block.endMinute) {
            pointer += 30;
            continue;
          }
          const patient = pick(patients);
          const start = new Date(d);
          start.setHours(0, 0, 0, 0);
          start.setMinutes(pointer);
          const end = new Date(start);
          end.setMinutes(end.getMinutes() + duration);

          let status: Row["status"];
          let cancelReason: string | null = null;
          if (isPast) {
            status = weightedPick([
              ["COMPLETED", 76],
              ["NO_SHOW", 8],
              ["CANCELLED", 16],
            ]);
            if (status === "CANCELLED") {
              cancelReason = pick([
                "Patient rescheduled to a later date",
                "Patient requested cancellation",
                "Illness",
                "Scheduling conflict",
              ]);
            }
          } else {
            status = weightedPick([
              ["CONFIRMED", 72],
              ["PENDING", 20],
              ["CANCELLED", 8],
            ]);
            if (status === "CANCELLED") {
              cancelReason = "Patient cancelled";
            }
          }

          appointmentRows.push({
            confirmationCode: uniqueCode(),
            patientId: patient.id,
            doctorId: doctor.id,
            locationId: block.locationId,
            serviceId: service.id,
            startsAt: start,
            endsAt: end,
            status,
            reasonNote: Math.random() > 0.6 ? pick([
              "Tooth sensitivity on the left side",
              "Routine follow-up",
              "New patient visit",
              "Follow-up on treatment plan",
              null,
            ]) : null,
            cancelReason,
          });
          pointer += duration;
        } else {
          pointer += 30;
        }
      }
    }
  }

  // Guarantee the demo patient has a friendly, predictable set of appointments.
  const demoDoctor = doctors[0];
  const demoService = services[0];
  const upcoming1 = new Date(today);
  upcoming1.setDate(upcoming1.getDate() + 4);
  upcoming1.setHours(10, 0, 0, 0);
  const upcoming2 = new Date(today);
  upcoming2.setDate(upcoming2.getDate() + 18);
  upcoming2.setHours(14, 30, 0, 0);
  const past1 = new Date(today);
  past1.setDate(past1.getDate() - 40);
  past1.setHours(9, 0, 0, 0);

  appointmentRows.push(
    {
      confirmationCode: uniqueCode(),
      patientId: demoPatient.id,
      doctorId: demoDoctor.id,
      locationId: locations[0].id,
      serviceId: demoService.id,
      startsAt: upcoming1,
      endsAt: new Date(upcoming1.getTime() + demoService.durationMinutes * 60000),
      status: "CONFIRMED",
      reasonNote: "Routine 6-month cleaning",
      cancelReason: null,
    },
    {
      confirmationCode: uniqueCode(),
      patientId: demoPatient.id,
      doctorId: doctors[5].id,
      locationId: locations[1].id,
      serviceId: services[6].id,
      startsAt: upcoming2,
      endsAt: new Date(upcoming2.getTime() + services[6].durationMinutes * 60000),
      status: "PENDING",
      reasonNote: "Whitening before wedding",
      cancelReason: null,
    },
    {
      confirmationCode: uniqueCode(),
      patientId: demoPatient.id,
      doctorId: demoDoctor.id,
      locationId: locations[0].id,
      serviceId: demoService.id,
      startsAt: past1,
      endsAt: new Date(past1.getTime() + demoService.durationMinutes * 60000),
      status: "COMPLETED",
      reasonNote: "Routine cleaning",
      cancelReason: null,
    }
  );

  console.log(`Inserting ${appointmentRows.length} appointments...`);
  const createdAppointments = [];
  for (const row of appointmentRows) {
    createdAppointments.push(await prisma.appointment.create({ data: row }));
  }

  console.log("Generating invoices, payments, documents, reminders...");
  let invoiceSeq = 10000;
  for (const appt of createdAppointments) {
    if (appt.status !== "COMPLETED" && appt.status !== "NO_SHOW") continue;
    const service = services.find((s) => s.id === appt.serviceId)!;
    const patient = patients.find((p) => p.id === appt.patientId)!;
    if (service.price === 0) continue;

    const hasInsurance = Math.random() > 0.35;
    const insuranceAdjustment = hasInsurance ? Math.round(service.price * (randomInt(20, 60) / 100)) : 0;
    const total = service.price - insuranceAdjustment;
    const dueDate = new Date(appt.startsAt);
    dueDate.setDate(dueDate.getDate() + 21);

    const status = weightedPick<"PAID" | "SENT" | "OVERDUE">([
      ["PAID", 68],
      ["SENT", 18],
      ["OVERDUE", 14],
    ]);

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber: `INV-${invoiceSeq++}`,
        patientId: patient.id,
        appointmentId: appt.id,
        subtotal: service.price,
        insuranceAdjustment,
        total,
        status,
        dueDate,
        items: {
          create: [{ description: service.name, amount: service.price, quantity: 1 }],
        },
      },
    });

    if (status === "PAID") {
      await prisma.payment.create({
        data: {
          invoiceId: invoice.id,
          amount: total,
          method: pick(["Visa •••• 4242", "Mastercard •••• 4444", "Amex •••• 1005", "Discover •••• 6011"]),
          status: "SUCCEEDED",
          createdAt: dueDate,
        },
      });
    }
  }

  const docCategories = ["INSURANCE", "XRAY", "CONSENT_FORM", "ID_CARD"] as const;

  for (const patient of patients) {
    if (Math.random() > 0.55) continue;
    const count = randomInt(1, 3);
    for (let i = 0; i < count; i++) {
      const category = pick(docCategories);
      const fileName = {
        INSURANCE: "Insurance-Card.txt",
        XRAY: "Panoramic-Xray-Notes.txt",
        CONSENT_FORM: "Treatment-Consent-Form.txt",
        ID_CARD: "Photo-ID.txt",
      }[category];
      const textContent = `Meridian Dental — demo placeholder document\nCategory: ${category}\nPatient: ${patient.firstName} ${patient.lastName}\nGenerated for demo purposes only.`;
      const content = Buffer.from(textContent, "utf-8");
      await prisma.document.create({
        data: {
          patientId: patient.id,
          fileName,
          content,
          fileType: "text/plain",
          fileSize: content.byteLength,
          category,
          uploadedByRole: "PATIENT",
          uploadedAt: faker.date.recent({ days: 120 }),
        },
      });
    }
  }

  const upcomingAppts = createdAppointments.filter(
    (a) => a.startsAt > today && (a.status === "CONFIRMED" || a.status === "PENDING")
  );
  for (const appt of upcomingAppts) {
    const reminderTime = new Date(appt.startsAt);
    reminderTime.setDate(reminderTime.getDate() - 1);
    await prisma.reminder.create({
      data: {
        patientId: appt.patientId,
        appointmentId: appt.id,
        channel: Math.random() > 0.5 ? "EMAIL" : "SMS",
        message: `Reminder: you have an appointment coming up on ${appt.startsAt.toDateString()}.`,
        scheduledFor: reminderTime,
        status: reminderTime < new Date() ? "SENT" : "SCHEDULED",
        sentAt: reminderTime < new Date() ? reminderTime : null,
      },
    });
  }

  console.log("Seed complete.");
  console.log(`  Locations: ${locations.length}`);
  console.log(`  Services: ${services.length}`);
  console.log(`  Doctors: ${doctors.length}`);
  console.log(`  Patients: ${patients.length}`);
  console.log(`  Appointments: ${createdAppointments.length}`);
  console.log("");
  console.log("Demo logins:");
  console.log("  Patient — sarah.patient@demo.com / Demo1234!");
  console.log("  Admin   — admin@meridiandental.com / Demo1234!");

  await prisma.$disconnect();
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
