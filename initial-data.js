/* eslint-disable no-console */
const crypto = require('crypto');
const axios = require('axios');
const { map } = require('lodash');

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
  let {
    data: { allLayers },
  } = await keystone.executeGraphQL({
    context,
    query: `query{
      allLayers{
        layerId
      }
    }`,
  });
  allLayers = map(allLayers, 'layerId');

  let {
    data: { layers },
  } = await axios.get(
    'https://arcgis.rice.edu/arcgis/rest/services/imagineRio_Data/FeatureServer/layers?f=json'
  );
  layers = layers
    .filter(l => !l.name.match(/^ir_rio/))
    .filter(l => !allLayers.includes(l.name.toLowerCase()))
    .map(layer => ({
      layerId: layer.name.toLowerCase(),
      title: layer.name.replace(/(Poly|Line)$/, '').replace(/([A-Z])/g, ' $1'),
      remoteId: layer.id,
    }));

  await Promise.all(
    layers.map(layer =>
      keystone.executeGraphQL({
        context,
        query: `mutation InitLayer($layerId: String, $title: String, $remoteId: Int) {
      createLayer(data: { layerId: $layerId, title: $title, remoteId: $remoteId }) {
        id
      }
    }`,
        variables: layer,
      })
    )
  );

  // Populate basemaps
  let {
    data: { allBasemaps },
  } = await keystone.executeGraphQL({
    context,
    query: `query{
        allBasemaps{
          ssid
        }
      }`,
  });
  allBasemaps = map(allBasemaps, 'ssid');
  const loadManifest = url =>
    axios.get(url).then(({ data: { manifests } }) => {
      const manifestReqs = manifests
        .filter(m => {
          const ssid = m['@id'].match(/SSID\d*/)[0];
          return !allBasemaps.includes(ssid);
        })
        .map(m =>
          axios.get(m['@id']).then(({ data: { metadata } }) => {
            const variables = {
              ssid: metadata.find(md => md.label === 'Identifier').value[0],
              title: metadata.find(md => md.label === 'Title').value,
              firstYear: 1800,
              lastYear: 2000,
            };
            return keystone.executeGraphQL({
              context,
              query: `mutation InitBasemap($ssid: String, $title: String, $firstYear: Int, $lastYear: Int) {
            createBasemap(data: { ssid: $ssid, title: $title, firstYear: $firstYear, lastYear: $lastYear}) {
              id
            }
          }`,
              variables,
            });
          })
        );
      return Promise.all(manifestReqs);
    });

  return loadManifest('https://situatedviews.axismaps.io/iiif/2/collection/maps').then(() =>
    loadManifest('https://situatedviews.axismaps.io/iiif/2/collection/plans')
  );
};
