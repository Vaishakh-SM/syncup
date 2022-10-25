import { storage } from '@forge/api';
import { propertyGetAddApi } from './api';

export async function addApi(payload, context) {
  //   console.log(JSON.stringify(payload, null, 2));

  const issueKey = payload['issue']['key'];
  const status = payload['issue']['fields']['status']['statusCategory']['key'];
  const project = payload['issue']['fields']['project']['key'];

  console.log('Status: ', status);
  console.log('Issue key: ', issueKey);
  console.log('Project: ', project);
  let propertyAPIs = await propertyGetAddApi(issueKey);

  if (status === 'done') {
    let projectStorage = await storage.get(project);
    console.log('Current project storage: ', projectStorage);

    if (typeof projectStorage === 'undefined') {
      projectStorage = {
        storedAPIs: [],
      };
    }

    let currentAPIs = projectStorage['storedAPIs'];

    console.log('Current apis in the project: ', currentAPIs);
    console.log('PropertyAPis', propertyAPIs);

    if (
      typeof currentAPIs === 'undefined' ||
      Object.keys(currentAPIs).length === 0
    ) {
      currentAPIs = propertyAPIs;
    } else {
      currentAPIs = currentAPIs.concat(propertyAPIs);
    }

    currentAPIs = [...new Set(currentAPIs)];
    projectStorage['storedAPIs'] = currentAPIs;
    storage.set(project, projectStorage);

    // await storage.delete(project);
  }
}

export async function deleteApi(payload, context) {
  //   console.log(JSON.stringify(payload, null, 2));

  const issueKey = payload['issue']['key'];
  const status = payload['issue']['fields']['status']['statusCategory']['key'];
  const project = payload['issue']['fields']['project']['key'];

  console.log('Status: ', status);
  console.log('Issue key: ', issueKey);
  console.log('Project: ', project);
  let propertyAPIs = await propertyGetAddApi(issueKey);

  if (status === 'done') {
    let projectStorage = await storage.get(project);
    console.log('Current project storage: ', projectStorage);

    if (typeof projectStorage === 'undefined') {
      projectStorage = {
        storedAPIs: [],
      };
    }

    let currentAPIs = projectStorage['storedAPIs'];

    console.log('Current apis in the project: ', currentAPIs);
    console.log('PropertyAPis', propertyAPIs);

    if (
      typeof currentAPIs === 'undefined' ||
      Object.keys(currentAPIs).length === 0
    ) {
      currentAPIs = [];
    } else {
      currentAPIs = currentAPIs.filter((el) => !propertyAPIs.includes(el));
    }

    currentAPIs = [...new Set(currentAPIs)];
    projectStorage['storedAPIs'] = currentAPIs;
    storage.set(project, projectStorage);

    // await storage.delete(project);
  }
}
