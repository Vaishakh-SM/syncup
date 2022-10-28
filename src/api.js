import api, { route } from '@forge/api';
import { storage } from '@forge/api';

export async function addSyncupComment(action, apiName, issueId) {
  if (
    typeof action === 'undefined' ||
    typeof apiName === 'undefined' ||
    typeof issueId === 'undefined'
  ) {
    console.log('ERROR: Action, API and Issue ID name must be specified');
  } else {
    var commentText = `"SYNCUP: ${action} : ${apiName}"`;

    var body = `{
        "body": {
          "type": "doc",
          "version": 1,
          "content": [
            {
              "type": "paragraph",
              "content": [
                {
                  "text": ${commentText},
                  "type": "text"
                }
              ]
            }
          ]
        }
      }`;
    console.log('Issue body: ', body);

    try {
      let resp = await api
        .asApp()
        .requestJira(route`/rest/api/3/issue/${issueId}/comment`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: body,
        });

      console.log('Issue response ', await resp.json());
    } catch (e) {
      console.log('ERRORED', e);
    }
  }
}

export async function propertyAddApi(apiname, issueKey) {
  await propertyAdd(apiname, issueKey, 'AddApi');
}

export async function propertyDeleteApi(apiname, issueKey) {
  await propertyAdd(apiname, issueKey, 'DeleteApi');
}

export async function propertyAddSubscribe(apiname, issueKey) {
  await propertyAdd(apiname, issueKey, 'Subscribe');
}

export async function propertyGetSubscribe(issueKey) {
  return await propertyGet(issueKey, 'Subscribe');
}

export async function propertyUnsubscribe(apiname, issueKey) {
  await propertyAdd(apiname, issueKey, 'Unsubscribe');
}

export async function propertyGetUnsubscribe(issueKey) {
  return await propertyGet(issueKey, 'Unsubscribe');
}

export async function propertyGetAddApi(issueKey) {
  return await propertyGet(issueKey, 'AddApi');
}

export async function propertyGetDeleteApi(issueKey) {
  return await propertyGet(issueKey, 'DeleteApi');
}

export async function propertyAdd(element, issueKey, propKey) {
  try {
    let propData = await propertyGet(issueKey, propKey);

    if (typeof propData === 'undefined') {
      propData = [];
    }

    propData.push(element);

    var bodyData = {};

    bodyData[propKey] = propData;

    const jsonData = JSON.stringify(bodyData);

    const response = await api
      .asApp()
      .requestJira(route`/rest/api/3/issue/${issueKey}/properties/${propKey}`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: jsonData,
      });

    return response;
  } catch (e) {
    console.log('PROPEPRTY ADD ERROR: ', e);
  }
}

export async function propertyGet(issueKey, propKey) {
  let getresponse = await api
    .asApp()
    .requestJira(route`/rest/api/3/issue/${issueKey}/properties/${propKey}`, {
      headers: {
        Accept: 'application/json',
      },
    });

  let currentData = await getresponse.json();

  let fieldData;
  if (typeof currentData['value'] !== 'undefined') {
    fieldData = currentData['value'][propKey];
  } else {
    fieldData = [];
  }

  return fieldData;
}

export async function getProjectStorage(projectKey) {
  let currentStorage = await storage.get(projectKey);
  return currentStorage;
}

export async function getProjectKeys() {
  const response = await api
    .asApp()
    .requestJira(route`/rest/api/3/project/search`, {
      headers: {
        Accept: 'application/json',
      },
    });
  const data = await response.json();

  let projectKeys = [];
  for (let entry of data['values']) {
    projectKeys.push(entry['key']);
  }
  return projectKeys;
}

export async function getAllApis() {
  let keys = await getProjectKeys();
  let apis = [];
  console.log('Getting all apis');

  for (let project of keys) {
    console.log('Key: ', project);
    let projectStorage = await storage.get(project);
    console.log('Project storage is: ', projectStorage);
    if (typeof projectStorage !== 'undefined') {
      apis = apis.concat(projectStorage['storedAPIs']);
    }
    console.log('APis is ', apis);
  }
  return apis;
}

export async function getSubscribedProjects(api) {
  let keys = await getProjectKeys();
  let subscribedProjects = [];

  for (let project of keys) {
    let projectStorage = await storage.get(project);
    console.log('Project store of ', project, 'is ', projectStorage);

    if (
      projectStorage !== 'undefined' &&
      typeof projectStorage['subscriptions'] !== 'undefined'
    ) {
      if (projectStorage['subscriptions'].includes(api))
        subscribedProjects.push(project);
    }
  }

  return subscribedProjects;
}

export async function createIssue(project, title, description, priority) {
  var bodyData = `{
          "update": {},
          "fields": {
            "summary": "${title}",
            "project": {
              "key": "${project}"
            },
            "issuetype": {
                "name": "Bug"
            },
            "priority": {
                "name": "${priority}"
            },
            "description": {
              "type": "doc",
              "version": 1,
              "content": [
                {
                  "type": "paragraph",
                  "content": [
                    {
                      "text": "${description}",
                      "type": "text"
                    }
                  ]
                }
              ]
            },
            "labels": [
              "Notification"
            ]
          }
        }`;
  console.log('Create issue body: ', bodyData);
  try {
    const response = await api.asApp().requestJira(route`/rest/api/3/issue`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: bodyData,
    });
    console.log('Create issue Response: ', response);
  } catch (e) {
    console.log('Error: ', e);
  }
}

export async function sendUpdatesToSubscribedProjects(
  api,
  title,
  description,
  priority
) {
  let subscribedProjects = await getSubscribedProjects(api);

  for (let key of subscribedProjects) {
    await createIssue(key, title, description, priority);
  }
}
