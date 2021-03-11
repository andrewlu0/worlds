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

export default function GraphPage({ data, user }) {
  const [paused, setPaused] = useState(true);
  const [player, setPlayer] = useState(null);
  const [track, setTrack] = useState(null);
  const [artist, setArtist] = useState(null);
  const [albumImg, setAlbumImg] = useState(null);
  const [fullScreen, setFullScreen] = useState(false);

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
      volume: 0.5
    });
    console.log(player);
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
      const current = state.track_window.current_track;
      var artists = "";
      for (var i = 0; i < current.artists.length - 1; i++) {
        artists += current.artists[i].name + ", ";
      }
      artists += current.artists[current.artists.length - 1].name;
      setTrack(current.name);
      setArtist(artists);
      setPaused(state.paused);
      setAlbumImg(current.album.images[0].url);
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

  const back = () => {
    player.previousTrack();
  };

  if (albumImg) {
    return (
      <>
        <Script url="https://sdk.scdn.co/spotify-player.js" />
        <FullScreen handle={handle}>
          <div className={styles.container}>
            <div className={styles.scene}>
              <Scene />
            </div>
          </div>
          <ControlBar
            paused={paused}
            play={play}
            pause={pause}
            albumImage={albumImg}
            track={track}
            artist={artist}
            next={next}
            back={back}
            full= {()=>{
              !fullScreen ? handle.enter() : handle.exit()
              setFullScreen(!fullScreen)}
            }
          />
        </FullScreen>
      </>
    );
  } else {
    return (
      <>
        <Script url="https://sdk.scdn.co/spotify-player.js" />
        <Connect name = {user.display_name.split(" ")[0]}/>
      </>
    );
  }
}

GraphPage.getInitialProps = async ({ req }) => {
  const data = parseCookies(req);
  var spotifyApi = new SpotifyWebApi({
    accessToken: data["access_token"],
    refreshToken: data["refresh_token"],
  });
  const config = {
    headers: { 'Authorization': 'Bearer ' + data["access_token"] },
  }
  const user = await get("https://api.spotify.com/v1/me", config);
  return {
    data: data,
    user: user,
  };
};
