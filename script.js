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

    // ACTIVITIES
    const activityDiv = document.getElementById("activity");

    const activities = data.activities.filter(
      a => a.name !== "Custom Status"
    );

    if (activities.length > 0) {
      const act = activities[0];

      activityDiv.innerHTML = `
        <h3>${act.name}</h3>
        <p>${act.details || ""}</p>
        <small>${act.state || ""}</small>
      `;
    } else {
      activityDiv.innerHTML = `
        <h3>No Activity</h3>
      `;
    }

    // SPOTIFY
    const spotifyDiv = document.getElementById("spotify");

    if (data.listening_to_spotify) {
      spotifyDiv.innerHTML = `
        <h3>Listening to Spotify</h3>

        <img
          class="spotify-cover"
          src="${data.spotify.album_art_url}"
        >

        <p><strong>${data.spotify.song}</strong></p>

        <small>
          ${data.spotify.artist}
        </small>
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
