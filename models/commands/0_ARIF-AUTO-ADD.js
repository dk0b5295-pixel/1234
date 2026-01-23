/* ================= CONFIG ================= */

module.exports.config = {
  name: "add",
  version: "1.2.0",
  hasPermssion: 1, // Admin only
  credits: "ARIF BABU",
  description: "Add user to group by UID or Facebook profile link",
  commandCategory: "Group",
  usages: "add <uid | fb link>",
  cooldowns: 5
};

/* ================= UI BOX ================= */

const box = (title, body) =>
`╭───〔 ${title} 〕───╮

${body}

╰────────────────────╯`;

/* ================= MAIN RUN ================= */

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;

  /* ===== CREDITS LOCK ===== */
  if (module.exports.config.credits !== "ARIF BABU") {
    return api.sendMessage(
      box(
        "❌ DISABLED",
        "Credits modified detected!\nCommand disabled 🔒"
      ),
      threadID,
      messageID
    );
  }

  /* ===== NO INPUT ===== */
  if (!args[0]) {
    return api.sendMessage(
      box(
        "❗ ADD USER",
        `Use command like this:
🔹 add <facebook uid>
🔹 add <facebook profile link>`
      ),
      threadID,
      messageID
    );
  }

  let input = args[0];
  let uid = input;

  /* ===== FB LINK → UID ===== */
  if (input.includes("facebook.com")) {
    try {
      const data = await api.getUserID(input);
      uid = data[0].userID;
    } catch (e) {
      return api.sendMessage(
        box(
          "❌ ERROR",
          "Facebook link se UID extract nahi ho paya."
        ),
        threadID,
        messageID
      );
    }
  }

  /* ===== ADD USER ===== */
  api.addUserToGroup(uid, threadID, (err) => {
    if (err) {
      return api.sendMessage(
        box(
          "❌ FAILED",
          `User add nahi ho paya 😶‍🌫️
Possible reasons:
• User ne group add off rakha ho
• Bot group admin nahi ho
• UID invalid ho`
        ),
        threadID,
        messageID
      );
    }

    api.sendMessage(
      box(
        "✅ SUCCESS",
        `User successfully group me add ho gaya 🎉
🆔 UID: ${uid}`
      ),
      threadID,
      messageID
    );
  });
};