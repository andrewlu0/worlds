import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/Graph.module.css";
import { Scene } from "../components/Scene";
import { parseCookies } from "../utils/parser";
import { get, put } from "../utils/api";
import { ControlBar } from "../components/ControlBar";
import SpotifyWebApi from "spotify-web-api-node";
import Script from "react-load-script";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { Connect } from "../components/Connect";
import Home from ".";
import { stateContext } from "react-three-fiber";

export default function GraphPage({ data, user }) {
  const [player, setPlayer] = useState(null);
  const [playbackState, setPlaybackState] = useState(null);
  const [audioAnalysis, setAudioAnalysis] = useState(null);

  const handle = useFullScreenHandle();

  useEffect(() => {
    window.onSpotifyWebPlaybackSDKReady = () => {
      handleLoadSuccess();
    };
  }, []);

  const handleLoadSuccess = () => {
    const token = data["access_token"];
    const player = new window.Spotify.Player({
      name: "worlds",
      getOAuthToken: (cb) => {
        cb(token);
      },
      volume: 0.5,
    });
    // Error handling
    player.addListener("initialization_error", ({ message }) => {
      console.error(message);
    });
    player.addListener("authentication_error", ({ message }) => {
      console.error(message);
    });
    player.addListener("account_error", ({ message }) => {
      console.error(message);
    });
    player.addListener("playback_error", ({ message }) => {
      console.error(message);
    });

    // Playback status updates
    player.addListener("player_state_changed", (state) => {
      if (!state) return;
      setPlaybackState(state);
      const id = state.track_window.current_track.id;
      updateAudioAnalysis(id);
    });

    // Ready
    player.addListener("ready", ({ device_id }) => {
      console.log("Ready with Device ID", device_id);
    });

    // Not Ready
    player.addListener("not_ready", ({ device_id }) => {
      console.log("Device ID has gone offline", device_id);
    });

    // Connect to the player!
    player.connect();
    setPlayer(player);
  };

  const getArtists = (arr) => {
    var artists = "";
    for (var i = 0; i < arr.length - 1; i++) {
      artists += arr[i].name + ", ";
    }
    artists += arr[arr.length - 1].name;
    return artists;
  };

  const updateAudioAnalysis = async (id) => {
    const config = {
      headers: { Authorization: "Bearer " + data["access_token"] },
    };
    try {
      const audio = await get(
        "https://api.spotify.com/v1/audio-analysis/" + id,
        config
      );
      console.log(audio);
      setAudioAnalysis(audio);
    } catch (err) {
      console.error(err);
    }
  };

  const cb = (token) => {
    return token;
  };

  const play = () => {
    player.resume();
  };

  const pause = () => {
    player.pause();
  };

  const next = () => {
    player.nextTrack();
  };

  const back = async () => {
    const state = await player.getCurrentState();
    setPlaybackState(state);
    if (
      state.position > 3000 ||
      state.track_window.previous_tracks.length == 0
    ) {
      player.seek(1);
    } else {
      player.previousTrack();
    }
  };

  if (!playbackState) {
    console.log("not playback");
    return (
      <>
        <Script url="https://sdk.scdn.co/spotify-player.js" />
        <Connect name={user.display_name.split(" ")[0]} />
      </>
    );
  } else if (!user) {
    return (
      <>
        <Script url="https://sdk.scdn.co/spotify-player.js" />
        <Home />
      </>
    );
  } else {
    return (
      <>
        <Script url="https://sdk.scdn.co/spotify-player.js" />
        <FullScreen handle={handle}>
          <div className={styles.container}>
            <p>tempo : {audioAnalysis ? audioAnalysis.track.tempo : null}</p>
            <Scene
              tempo={audioAnalysis ? audioAnalysis.track.tempo : null}
              track={playbackState}
            />
          </div>
          <ControlBar
            paused={playbackState.paused}
            play={play}
            pause={pause}
            albumImage={
              playbackState.track_window.current_track.album.images[0].url
            }
            track={playbackState.track_window.current_track.name}
            artist={getArtists(
              playbackState.track_window.current_track.artists
            )}
            next={next}
            back={back}
            full={() => {
              !handle.active ? handle.enter() : handle.exit();
            }}
          />
        </FullScreen>
      </>
    );
  }
}

GraphPage.getInitialProps = async ({ req }) => {
  const data = parseCookies(req);
  var user = null;
  var spotifyApi = new SpotifyWebApi({
    accessToken: data["access_token"],
    refreshToken: data["refresh_token"],
  });
  const config = {
    headers: { Authorization: "Bearer " + data["access_token"] },
  };
  try {
    user = await get("https://api.spotify.com/v1/me", config);
  } catch (err) {
    console.error(err);
  }
  return {
    data: data,
    user: user,
  };
};
