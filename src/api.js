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

    console.log('Before await');
    try {
      let response = await api
        .asApp()
        .requestJira(route`/rest/api/3/issue/${issueId}/comment`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: body,
        });

      //   console.log(`Response: ${response.status} ${response.statusText}`);
      //   console.log(await response.json());
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

export async function propertyGetAddApi(issueKey) {
  return await propertyGet(issueKey, 'AddApi');
}

export async function propertyGetDeleteApi(issueKey) {
  return await propertyGet(issueKey, 'DeleteApi');
}

export async function propertyAdd(element, issueKey, propKey) {
  try {
    let propData = await propertyGet(issueKey, propKey);
    console.log('Prop data is: ', propData);

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
  console.log('CURR project storage: ', currentStorage);
  return currentStorage;
}
