import api, { route } from '@forge/api';

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

    const response = await api
      .asApp()
      .requestJira(route`/rest/api/3/issue/${issueId}/comment`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: body,
      });

    // THIS LOG NOT WORKING
    console.log(`Response: ${response.status} ${response.statusText}`);
    console.log(await response.json());
  }
}
