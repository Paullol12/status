const USER_ID = "1500771253160644639";

async function updatePresence() {
  try {
    const response = await fetch(
      `https://api.lanyard.rest/v1/users/${USER_ID}`
    );

    const json = await response.json();
    const data = json.data;

    // USERNAME
    document.getElementById("username").textContent =
      data.discord_user.display_name ||
      data.discord_user.username;

    // AVATAR
    const avatarURL =
      `https://cdn.discordapp.com/avatars/${USER_ID}/${data.discord_user.avatar}.png`;

    document.getElementById("avatar").src = avatarURL;

    // STATUS
    const status = data.discord_status;

    document.getElementById("status").textContent = status;

    const dot = document.getElementById("dot");

    if (status === "online") {
      dot.style.background = "#43b581";
    } else if (status === "idle") {
      dot.style.background = "#faa61a";
    } else if (status === "dnd") {
      dot.style.background = "#f04747";
    } else {
      dot.style.background = "gray";
    }

    // BIO / CUSTOM STATUS
    const bioActivity = data.activities.find(
      a => a.type === 4
    );

    const bioDiv = document.getElementById("bio");

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
    const activityDiv = document.getElementById("activity");

    const activities = data.activities.filter(
      a =>
        a.name !== "Custom Status" &&
        a.type !== 4
    );

    if (activities.length > 0) {
      const act = activities[0];

      activityDiv.innerHTML = `
        <div class="section">
          <h3>${act.name}</h3>
          <p>${act.details || ""}</p>
          <small>${act.state || ""}</small>
        </div>
      `;
    } else {
      activityDiv.innerHTML = "";
    }

    // SPOTIFY
    const spotifyDiv = document.getElementById("spotify");

    if (data.listening_to_spotify) {
      spotifyDiv.innerHTML = `
        <div class="section">
          <h3>Listening to Spotify</h3>

          <img
            class="spotify-cover"
            src="${data.spotify.album_art_url}"
          >

          <p><strong>${data.spotify.song}</strong></p>

          <small>${data.spotify.artist}</small>
        </div>
      `;
    } else {
      spotifyDiv.innerHTML = "";
    }

  } catch (err) {
    console.error(err);
  }
}

updatePresence();

setInterval(updatePresence, 1000);
