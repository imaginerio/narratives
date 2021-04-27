/* eslint-disable no-console */
const crypto = require('crypto');
const axios = require('axios');
const { map, flatten } = require('lodash');

const randomString = () => crypto.randomBytes(6).hexSlice();

module.exports = async keystone => {
  const context = keystone.createContext({ skipAccessControl: true });
  // Count existing users
  const {
    data: {
      _allUsersMeta: { count },
    },
  } = await keystone.executeGraphQL({
    context,
    query: `query {
      _allUsersMeta {
        count
      }
    }`,
  });

  if (count === 0) {
    const password = randomString();
    const email = 'admin@example.com';

    const { errors } = await keystone.executeGraphQL({
      context,
      query: `mutation initialUser($password: String, $email: String) {
            createUser(data: {name: "Admin", email: $email, isAdmin: true, password: $password}) {
              id
            }
          }`,
      variables: { password, email },
    });

    if (errors) {
      console.log('failed to create initial user:');
      console.log(errors);
    } else {
      console.log(`
      User created:
        email: ${email}
        password: ${password}
      Please change these details after initial login.
      `);
    }
  }

  // Populate layers
  const {
    data: { allLayers },
  } = await keystone.executeGraphQL({
    context,
    query: `query{
      allLayers{
        id
        layerId
      }
    }`,
  });
  const allLayerNames = map(allLayers, 'layerId');

  let { data: layers } = await axios.get(`${process.env.NEXT_PUBLIC_SEARCH_API}/layers`);
  layers = layers.map(layer => ({
    layerId: layer.name.toLowerCase(),
    title: layer.title,
    remoteId: layer.id,
  }));

  await Promise.all(
    layers.map(layer => {
      if (!allLayerNames.includes(layer.layerId)) {
        return keystone.executeGraphQL({
          context,
          query: `
            mutation InitLayer($layerId: String, $title: String, $remoteId: Int) {
              createLayer(data: { layerId: $layerId, title: $title, remoteId: $remoteId }) {
                id
              }
            }`,
          variables: layer,
        });
      }
      const existingLayer = allLayers.find(l => l.layerId === layer.layerId);
      if (!existingLayer) return Promise.resolve();
      const { id } = existingLayer;
      return keystone.executeGraphQL({
        context,
        query: `
          mutation UpdateLayer($id: ID!, $layerId: String, $title: String, $remoteId: Int) {
            updateLayer(id: $id, data: { layerId: $layerId, title: $title, remoteId: $remoteId }) {
              id
            }
          }`,
        variables: { id, ...layer },
      });
    })
  );

  // Populate basemaps
  const {
    data: { allBasemaps },
  } = await keystone.executeGraphQL({
    context,
    query: `query{
        allBasemaps{
          id
          ssid
        }
      }`,
  });
  const allBasemapIds = map(allBasemaps, 'ssid');
  let { data } = await axios.get(`${process.env.NEXT_PUBLIC_SEARCH_API}/documents`);
  data = data.filter(d => d.title !== 'Views');
  const documents = flatten(map(data, 'Documents'));
  const documentReqs = documents.map(m => {
    const variables = {
      ...m,
      firstYear: m.firstyear,
      lastYear: m.lastyear,
    };
    if (!allBasemapIds.includes(m.ssid) || !allBasemapIds.includes(`SSID${m.ssid}`)) {
      return keystone.executeGraphQL({
        context,
        query: `
        mutation InitBasemap($ssid: String, $title: String, $firstYear: Int, $lastYear: Int, $longitude: Float, $latitude: Float) {
          createBasemap(data: { ssid: $ssid, title: $title, firstYear: $firstYear, lastYear: $lastYear, longitude: $longitude, latitude: $latitude }) {
            id
          }
        }`,
        variables,
      });
    }

    const existingBasemap = allBasemaps.find(l => l.ssid === m.ssid || l.ssid === `SSID${m.ssid}`);
    if (!existingBasemap) return Promise.resolve();
    variables.id = existingBasemap.id;

    return keystone.executeGraphQL({
      context,
      query: `
      mutation UpdateBasemap($id: ID!, $ssid: String, $title: String, $firstYear: Int, $lastYear: Int, $longitude: Float, $latitude: Float) {
        updateBasemap(id: $id, data: { ssid: $ssid, title: $title, firstYear: $firstYear, lastYear: $lastYear, longitude: $longitude, latitude: $latitude }) {
          id
        }
      }`,
      variables,
    });
  });
  return Promise.all(documentReqs);
};
