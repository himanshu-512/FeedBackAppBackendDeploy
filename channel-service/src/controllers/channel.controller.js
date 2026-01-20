import Channel from "../models/Channel.model.js";

// GET /channels
export const listChannels = async (req, res) => {
  try {
    const channels = await Channel.find()
      .sort({ createdAt: -1 })
      .limit(50) // 🔥 safety
      .lean();

    res.json(channels);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch channels" });
  }
};

// POST /channels
export const createChannel = async (req, res) => {
  try {
    const { name, description, icon, color } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Channel name required" });
    }

    const channel = await Channel.create({
      name,
      description: description || "",
      icon: icon || "💬",
      color: color || "#7860E3",

      members: [], // ✅ VERY IMPORTANT
    });

    res.status(201).json(channel);
  } catch (err) {
    console.log("CREATE CHANNEL ERROR:", err.message);
    res.status(500).json({ message: "Failed to create channel" });
  }
};

// POST /channels/:id/join

export const joinChannel = async (req, res) => {
  try {
    const { userId, username } = req.user; // JWT se aaya
    const channelId = req.params.id;

    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    // 🔥 CHECK ALREADY JOINED
    const alreadyJoined = channel.members.some(
      (m) => m.userId === userId
    );

    if (!alreadyJoined) {
      channel.members.push({
        userId,
        username, // ✅ OBJECT, NOT STRING
      });

      await channel.save(); // 🔥 THIS WAS FAILING EARLIER
    }

    res.json({
      message: "Joined successfully",
      members: channel.members,
    });
  } catch (err) {
    console.log("JOIN ERROR:", err.message);
    res.status(500).json({ message: err.message });
  }
};


/* GET SINGLE CHANNEL (FOR CHAT MEMBERSHIP CHECK) */
export const getChannelById = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }
    res.json(channel);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch channel" });
  }
};
export const checkMember = async (req, res) => {
  try {
    const { id: channelId, userId } = req.params;
    console.log(channelId, userId);

    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({
        isMember: false,
        message: "Channel not found",
      });
    }

    const members = Array.isArray(channel.members)
      ? channel.members
      : [];

    const isMember = members.some(
      (m) => m.userId === userId
    );

    res.json({ isMember });
  } catch (err) {
    console.log("CHECK MEMBER ERROR:", err.message);
    res.status(500).json({ isMember: false });
  }
};
export const searchChannels = async (req, res) => {
  try {
    const { q, category } = req.query;
    console.log(q, category);

    if (!q || q.trim().length < 2) {
      return res.json([]);
    }

    const query = {
      $text: { $search: q },
    };

    if (category && category !== "All") {
      query.category = category;
    }

    const channels = await Channel.find(
      query,
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(20)
      .lean();

    res.json(channels);
  } catch (err) {
    console.error("SEARCH ERROR:", err.message);
    res.status(500).json({ message: "Search failed" });
  }
};
