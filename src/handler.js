import { storage } from '@forge/api';
import {
  propertyGetAddApi,
  propertyGetDeleteApi,
  propertyGetSubscribe,
  propertyGetUnsubscribe,
  getProjectKeys,
} from './api';

async function initializeProjectStorage(project) {
  let projectStorage = await storage.get(project);
  if (typeof projectStorage === 'undefined') {
    return {
      storedAPIs: [],
      subscriptions: [],
      subscribers: [],
    };
  } else {
    return projectStorage;
  }
}

export async function addApi(payload, context) {
  const issueKey = payload['issue']['key'];
  const status = payload['issue']['fields']['status']['statusCategory']['key'];
  const project = payload['issue']['fields']['project']['key'];

  let propertyAPIs = await propertyGetAddApi(issueKey);

  if (status === 'done') {
    let projectStorage = await initializeProjectStorage(project);

    let currentAPIs = projectStorage['storedAPIs'];

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
    console.log(
      'By Add api, storage of ',
      project,
      ' set to: ',
      projectStorage
    );
    storage.set(project, projectStorage);

    // await storage.delete(project);
  }
}

export async function deleteApi(payload, context) {
  const issueKey = payload['issue']['key'];
  const status = payload['issue']['fields']['status']['statusCategory']['key'];
  const project = payload['issue']['fields']['project']['key'];

  let unsubscribeObject = await propertyGetDeleteApi(issueKey);
  let apiNames = [];

  for (let obj of unsubscribeObject) {
    apiNames.push(obj['deleteApi']);
  }

  if (status === 'done') {
    let projectStorage = await initializeProjectStorage(project);

    let currentAPIs = projectStorage['storedAPIs'];

    if (
      typeof currentAPIs === 'undefined' ||
      Object.keys(currentAPIs).length === 0
    ) {
      currentAPIs = [];
    } else {
      currentAPIs = currentAPIs.filter((el) => !apiNames.includes(el));
    }

    currentAPIs = [...new Set(currentAPIs)];
    projectStorage['storedAPIs'] = currentAPIs;
    storage.set(project, projectStorage);
    console.log(
      'By delete api, storage of ',
      project,
      ' set to: ',
      projectStorage
    );
    // await storage.delete(project);
  }
}

export async function addSubscription(payload, context) {
  const issueKey = payload['issue']['key'];
  const status = payload['issue']['fields']['status']['statusCategory']['key'];
  const project = payload['issue']['fields']['project']['key'];

  let propertyAPIs = await propertyGetSubscribe(issueKey);
  if (status === 'done') {
    let projectStorage = await initializeProjectStorage(project);

    let currentAPIs = projectStorage['subscriptions'];

    if (
      typeof currentAPIs === 'undefined' ||
      Object.keys(currentAPIs).length === 0
    ) {
      currentAPIs = propertyAPIs;
    } else {
      currentAPIs = currentAPIs.concat(propertyAPIs);
    }

    currentAPIs = [...new Set(currentAPIs)];
    projectStorage['subscriptions'] = currentAPIs;
    console.log(
      'By Add subs, storage of ',
      project,
      ' set to: ',
      projectStorage
    );
    storage.set(project, projectStorage);
  }
}

export async function deleteSubscription(payload, context) {
  const issueKey = payload['issue']['key'];
  const status = payload['issue']['fields']['status']['statusCategory']['key'];
  const project = payload['issue']['fields']['project']['key'];

  let propertyAPIs = await propertyGetUnsubscribe(issueKey);

  if (status === 'done') {
    let projectStorage = await initializeProjectStorage(project);

    let currentAPIs = projectStorage['subscriptions'];

    if (
      typeof currentAPIs === 'undefined' ||
      Object.keys(currentAPIs).length === 0
    ) {
      currentAPIs = [];
    } else {
      currentAPIs = currentAPIs.filter((el) => !propertyAPIs.includes(el));
    }

    currentAPIs = [...new Set(currentAPIs)];
    projectStorage['subscriptions'] = currentAPIs;
    storage.set(project, projectStorage);
    console.log(
      'By delete subs, storage of ',
      project,
      ' set to: ',
      projectStorage
    );
    // await storage.delete(project);
  }
}

export async function updateHandler(payload, context) {
  await addApi(payload, context);
  await deleteApi(payload, context);
  await addSubscription(payload, context);
  await deleteSubscription(payload, context);
}
// Function to take in a list of projects and
// Send issues with a specified type and description to all these projects
