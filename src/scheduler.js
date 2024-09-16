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
      (new Date() - new Date(user.sober)) / (1000 * 60 * 60 * 24)
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
      // Handle years beyond 5 up to 50 years based on your calculations
      const yearMilestones = [
        { year: 6, days: 2193 },
        { year: 7, days: 2558 },
        { year: 8, days: 2923 },
        { year: 9, days: 3289 },
        { year: 10, days: 3654 },
        { year: 11, days: 4019 },
        { year: 12, days: 4384 },
        { year: 13, days: 4750 },
        { year: 14, days: 5115 },
        { year: 15, days: 5480 },
        { year: 16, days: 5845 },
        { year: 17, days: 6211 },
        { year: 18, days: 6576 },
        { year: 19, days: 6941 },
        { year: 20, days: 7306 },
        { year: 21, days: 7672 },
        { year: 22, days: 8037 },
        { year: 23, days: 8402 },
        { year: 24, days: 8767 },
        { year: 25, days: 9133 },
        { year: 26, days: 9498 },
        { year: 27, days: 9863 },
        { year: 28, days: 10228 },
        { year: 29, days: 10594 },
        { year: 30, days: 10959 },
        { year: 31, days: 11324 },
        { year: 32, days: 11689 },
        { year: 33, days: 12055 },
        { year: 34, days: 12420 },
        { year: 35, days: 12785 },
        { year: 36, days: 13150 },
        { year: 37, days: 13516 },
        { year: 38, days: 13881 },
        { year: 39, days: 14246 },
        { year: 40, days: 14611 },
        { year: 41, days: 14977 },
        { year: 42, days: 15342 },
        { year: 43, days: 15707 },
        { year: 44, days: 16072 },
        { year: 45, days: 16438 },
        { year: 46, days: 16803 },
        { year: 47, days: 17168 },
        { year: 48, days: 17533 },
        { year: 49, days: 17899 },
        { year: 50, days: 18264 },
      ];

      // Check up to 50 years
      for (const milestone of yearMilestones) {
        if (soberDays === milestone.days) {
          console.log(`User ${user.username} reached ${milestone.year} year(s) of sobriety!`);
          await createMilestonePost(user, `${milestone.year} years`, `You've achieved ${milestone.year} year${milestone.year > 1 ? 's' : ''} of sobriety!`);
          break;
        }
      }

      // Handle years beyond 50 (each additional 365 days)
      const additionalYears = Math.floor((soberDays - 18264) / 365.5);
      const totalYears = 50 + additionalYears;
      const exactYearDays = 18264 + additionalYears * 365.5;

      console.log(`Checking milestone for year ${totalYears} at ${exactYearDays} days`);

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