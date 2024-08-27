const { PrismaClient } = require("@prisma/client");
const cron = require("node-cron");

const prisma = new PrismaClient();

const YOUR_USER_ID = 'd35m6skcmnk2wbve'; // Replace with your actual user ID

// Function to generate regular milestones up to a specified maximum
function generateMilestones(max) {
  const milestones = [];
  for (let i = 30; i <= max; i += 30) {
    if (i !== 183 && i % 367 !== 0) { // Exclude 183 days (6 months) and yearly milestones
      milestones.push(i);
    }
  }
  return milestones;
}

// Define the maximum milestone
const MAX_MILESTONE = 1200;
const MILESTONES = generateMilestones(MAX_MILESTONE);

async function createMilestonePost(user, milestone, message) {
  const content = `🎉 Congratulations @${user.username}! ${message} 🎉`;

  try {
    await prisma.post.create({
      data: {
        content,
        userId: YOUR_USER_ID, // Use your user ID here
      },
    });
    console.log(
      `Created post for user ${user.displayName} for ${milestone} milestone.`
    );
  } catch (error) {
    console.error(
      `Failed to create post for user ${user.displayName} for ${milestone} milestone:`,
      error
    );
  }
}

async function checkSoberMilestones() {
  const users = await prisma.user.findMany({
    where: {
      sober: {
        not: null,
      },
    },
  });

  console.log("Fetched users:", users);

  for (const user of users) {
    console.log("Processing user:", user.username);
    const soberDays = Math.floor(
      (new Date() - new Date(user.sober)) / (1000 * 60 * 60 * 24) + 1
    );

    console.log(`User ${user.username} has been sober for ${soberDays} days`);

    if (soberDays === 183) {
      // Special post for 6 months (183 days)
      console.log(`User ${user.username} reached 6 months of sobriety!`);
      await createMilestonePost(user, "6 months", "You've reached 6 months of sobriety!");
    } else if (soberDays === 367 || soberDays === 732 || soberDays === 1097 || soberDays === 1462 || soberDays === 1828) {
      // Special post for 1 to 5 year milestones
      const years = Math.floor(soberDays / 367);
      console.log(`User ${user.username} reached ${years} year(s) of sobriety!`);
      await createMilestonePost(user, `${years} years`, `You've achieved ${years} year${years > 1 ? 's' : ''} of sobriety!`);
    } else if (soberDays > 1828) {
      // Handle years beyond 5 (each additional 365 days)
      const additionalYears = Math.floor((soberDays - 1828) / 365);
      const totalYears = 5 + additionalYears;
      const exactYearDays = 1828 + additionalYears * 365;
      if (soberDays === exactYearDays) {
        console.log(`User ${user.username} reached ${totalYears} years of sobriety!`);
        await createMilestonePost(user, `${totalYears} years`, `You've achieved ${totalYears} years of sobriety!`);
      }
    } else if (MILESTONES.includes(soberDays)) {
      // Create posts for regular milestones (30, 60, 90 days, etc.)
      console.log(`User ${user.username} reached a milestone: ${soberDays} days`);
      await createMilestonePost(user, `${soberDays} days`, `You've reached ${soberDays} days of sobriety!`);
    }
  }
}

// Schedule the task to run every minute
cron.schedule("* * * * *", async () => {
  console.log("Checking sober milestones...");
  await checkSoberMilestones();
});

// Gracefully handle termination
process.on("SIGINT", async () => {
  console.log("Shutting down...");
  await prisma.$disconnect();
  process.exit(0);
});