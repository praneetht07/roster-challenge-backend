const express = require("express");
var cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());

const port = process.env.PORT || 3010;

app.use(express.json());

/* Create - Artist POST method */
app.post("/artist/add", (req, res) => {
  const existArtist = getArtistData();
  const artistData = req.body;

  //check if the artistData fields are missing
  if (
    artistData.artist == null ||
    artistData.rate == null ||
    artistData.streams == null
  ) {
    return res.status(401).send({ error: true, msg: "Artist data missing" });
  }

  //check if the artist exist already
  const findExist = existArtist.find(
    (artist) => artist.artist === artistData.artist
  );
  if (findExist) {
    return res.status(409).send({ error: true, msg: "Artist already exist" });
  }

  existArtist.push(artistData);

  saveArtistData(existArtist);
  res.send({ success: true, msg: "Artist added successfully" });
});

/* Read - GET method */
app.get("/artist/list", (req, res) => {
  const artists = getArtistData();
  res.send(artists);
});

/* Update - Patch method */
app.patch("/artist/update/:artist", (req, res) => {
  const artist = req.params.artist;
  const artistData = req.body;

  const existArtist = getArtistData();

  //check if the Artist exist or not
  const findExist = existArtist.find(
    (artist) => artist.artist === artistData.artist
  );
  if (!findExist) {
    return res.status(409).send({ error: true, msg: "Artist not exist" });
  }

  let updated = {
    artist: findExist?.artist,
    rate: artistData.rate,
    streams: artistData.streams,
    status: artistData.status,
  };

  // find index of found object from array of data
  let targetIndex = existArtist.indexOf(findExist);

  // replace object from data list with `updated` object
  existArtist.splice(targetIndex, 1, updated);

  saveArtistData(existArtist);

  res.send({ success: true, msg: "Artist updated successfully" });
});

/* Delete Artist - Delete method */
app.delete("/artist/delete/:artist", (req, res) => {
  const username = req.params.artist;
  //get the existing userdata
  const existUsers = getArtistData();

  const filterUser = existUsers.filter((user) => user.artist !== username);

  if (existUsers.length === filterUser.length) {
    return res.status(409).send({ error: true, msg: "Artist does not exist" });
  }

  //save the filtered data
  saveArtistData(filterUser);

  res.send({ success: true, msg: "Artist removed successfully" });
});

const saveArtistData = (data) => {
  const stringifyData = JSON.stringify(data);
  fs.writeFileSync("db.json", stringifyData);
};

const getArtistData = () => {
  const jsonData = fs.readFileSync("db.json");
  return JSON.parse(jsonData);
};

//configure the server port
app.listen(port, () => {
  console.log("Server runs on port PORT", port);
});
