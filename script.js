const USER_ID = "1500771253160644639";

const dot = document.getElementById("dot");
const statusText = document.getElementById("status");
const usernameEl = document.getElementById("username");
const avatarEl = document.getElementById("avatar");
const bioDiv = document.getElementById("bio");
const activityDiv = document.getElementById("activity");
const spotifyDiv = document.getElementById("spotify");

function setStatus(text, color) {
  statusText.style.opacity = 0;

  setTimeout(() => {
    statusText.textContent = text;
    dot.style.background = color;
    dot.style.boxShadow = `0 0 12px ${color}`;
    statusText.style.opacity = 1;
  }, 120);
}

function getAvatarURL(id, avatar) {
  if (!avatar) {
    return `https://cdn.discordapp.com/embed/avatars/0.png`;
  }
  return `https://cdn.discordapp.com/avatars/${id}/${avatar}.png?size=256`;
}

async function updatePresence() {
  try {
    const response = await fetch(
      `https://api.lanyard.rest/v1/users/${USER_ID}`
    );

    const json = await response.json();
    const data = json?.data;
    if (!data) return;

    // USERNAME
    usernameEl.textContent =
      data.discord_user?.display_name ||
      data.discord_user?.username ||
      "Unknown";

    // AVATAR
    avatarEl.src = getAvatarURL(
      USER_ID,
      data.discord_user?.avatar
    );

    // STATUS
    const status = data.discord_status || "offline";

    if (status === "online") setStatus("online", "#43b581");
    else if (status === "idle") setStatus("idle", "#faa61a");
    else if (status === "dnd") setStatus("dnd", "#f04747");
    else setStatus("offline", "gray");

    // BIO / CUSTOM STATUS
    const bioActivity = data.activities?.find(
      a => a.type === 4
    );

    if (bioActivity?.state) {
      bioDiv.innerHTML = `
        <div class="section">
          <h3>Status</h3>
          <div class="bio">${bioActivity.state}</div>
        </div>
      `;
    } else {
      bioDiv.innerHTML = "";
    }

    // ACTIVITIES
    const activities = (data.activities || []).filter(
      a => a.type !== 4
    );

    if (activities.length > 0) {
      const act = activities[0];

      activityDiv.innerHTML = `
        <div class="section">
          <h3>${act.name || "Activity"}</h3>
          <p>${act.details || ""}</p>
          <small>${act.state || ""}</small>
        </div>
      `;
    } else {
      activityDiv.innerHTML = "";
    }

    // SPOTIFY
    if (data.listening_to_spotify && data.spotify) {
      spotifyDiv.innerHTML = `
        <div class="section">
          <h3>Listening to Spotify</h3>

          <img class="spotify-cover" src="${data.spotify.album_art_url}" />

          <p><strong>${data.spotify.song}</strong></p>
          <small>${data.spotify.artist}</small>
        </div>
      `;
    } else {
      spotifyDiv.innerHTML = "";
    }

  } catch (err) {
    console.error("Presence update failed:", err);
    setStatus("offline", "gray");
  }
}

// initial + interval
updatePresence();
setInterval(updatePresence, 5000);
