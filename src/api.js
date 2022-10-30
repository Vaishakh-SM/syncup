import api, { route } from '@forge/api';
import { storage } from '@forge/api';

export async function addSyncupComment(commentText, issueId, infoType) {
  if (typeof commentText === 'undefined' || typeof issueId === 'undefined') {
    console.log('ERROR: Comment text and Issue ID name must be specified');
  } else {
    var body = `{
        "body": {
          "type": "doc",
          "version": 1,
          "content": [
            {
                "type": "panel",
                "attrs": {
                  "panelType": "${infoType}"
                },
                "content": [
                  {
                    "type": "paragraph",
                    "content": [
                      {
                        "type": "text",
                        "text": "${commentText}"
                      }
                    ]
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

export async function createIssue(
  project,
  title,
  description,
  priority,
  action,
  apiName
) {
  let issueType;
  if (action === 'deprecate') {
    issueType = 'Deprecation';
  } else if (action === 'remove') {
    issueType = 'Removal';
  } else if (action === 'update') {
    issueType = 'Update';
  }

  var bodyData = `{
          "update": {},
          "fields": {
            "summary": "${issueType}: ${title}",
            "project": {
              "key": "${project}"
            },
            "issuetype": {
                "name": "${issueType}"
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
              "${apiName}"
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
    console.log('Create issue Response: ', await response.json());
  } catch (e) {
    console.log('Error: ', e);
  }
}

export async function sendUpdatesToSubscribedProjects(
  apiName,
  title,
  description,
  priority,
  action
) {
  let subscribedProjects = await getSubscribedProjects(apiName);

  for (let key of subscribedProjects) {
    await createIssue(key, title, description, priority, action, apiName);
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
