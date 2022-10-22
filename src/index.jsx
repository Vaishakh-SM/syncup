import ForgeUI, { render, Fragment, Text, Tabs, Tab, IssuePanel,IssueAction, ModalDialog, Form, Button, useState, TextField, useProductContext, useEffect, Select, Option } from '@forge/ui';
import api, { route } from "@forge/api";
import { addSyncupComment } from './api';


// async function addSyncupComment(action, apiName, issueId) {
 
//     var commentText = `"SYNCUP: ${action} : ${apiName}"`;

//     var body = `{
//         "body": {
//           "type": "doc",
//           "version": 1,
//           "content": [
//             {
//               "type": "paragraph",
//               "content": [
//                 {
//                   "text": ${commentText},
//                   "type": "text"
//                 }
//               ]
//             }
//           ]
//         }
//       }`;

//     console.log('Sending API request with body');
//       console.log(body);
//       console.log('Issue key', issueId);

//     const response = await api
//       .asApp()
//       .requestJira(route`/rest/api/3/issue/${issueId}/comment`, {
//         method: 'POST',
//         headers: {
//           Accept: 'application/json',
//           'Content-Type': 'application/json',
//         },
//         body: body,
//       });

//     console.log(`Response: ${response.status} ${response.statusText}`);
//     console.log(await response.json());
  
// }


const App = () => {
  const [formState, setFormState] = useState(undefined);
  const context = useProductContext();

  const onAddApi = async (formData) => {
    addSyncupComment("add", formData.apiname, context.platformContext.issueKey);
  //   var commentText = `"SYNCUP: ADD : ${formData.apiname}"`;
  //   var body = `{
  //     "body": {
  //       "type": "doc",
  //       "version": 1,
  //       "content": [
  //         {
  //           "type": "paragraph",
  //           "content": [
  //             {
  //               "text": ${commentText},
  //               "type": "text"
  //             }
  //           ]
  //         }
  //       ]
  //     }
  //   }`;
  
  // console.log('Sending API request with body');
  //   console.log(body);
  //   console.log('Issue key', context.platformContext.issueKey);

  // const response = await api
  //   .asApp()
  //   .requestJira(route`/rest/api/3/issue/${context.platformContext.issueKey}/comment`, {
  //     method: 'POST',
  //     headers: {
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json',
  //     },
  //     body: body,
  //   });

  // console.log(`Response: ${response.status} ${response.statusText}`);
  // console.log(await response.json());




    // const response = await api
    // .asApp()
    // .requestJira(route`/rest/api/3/issue/${context.platformContext.issueKey}/comment`, {
    //   headers: {
    //     Accept: 'application/json',
    //   },
    // });

    // console.log(`Response: ${response.status} ${response.statusText}`);
    // console.log(await response.json());
    // const PROPKEY = "StoredAPIs"

    // const getresponse = await api.asApp().requestJira(route`/rest/api/3/issue/${context.platformContext.issueKey}/properties/${PROPKEY}`, {
    //   headers: {
    //     'Accept': 'application/json'
    //   }
    // });

    // const currentData = await getresponse.json();


    // let storedAPIs;
    // if (typeof(currentData['value']) !== 'undefined'){
    //   storedAPIs = currentData['value']['APIs'];
    // }else{
    //   storedAPIs = [];
    // }
    

    // storedAPIs.push(formData['apiname'])

    // var bodyData = {
    //   APIs: storedAPIs
    // };

    // const jsonData = JSON.stringify(bodyData);

    // const response = await api.asApp().requestJira(route`/rest/api/3/issue/${context.platformContext.issueKey}/properties/${PROPKEY}`, {
    //   method: 'PUT',
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json'
    //   },
    //   body: jsonData
    // });

    setFormState(formData);
  };


  return (
    <Fragment>
      <Tabs>

        <Tab label="Add">
        <Form onSubmit={onAddApi}>
          <TextField name="apiname" label="API Name" />
        </Form>
        </Tab>
      
        <Tab label="Deprecate">

        </Tab>

        <Tab label="Subscription">

        </Tab>
      </Tabs>
      {formState && <Text>{JSON.stringify(formState)}</Text>}
    </Fragment>
  );
};

export const run = render(
  <IssuePanel>
    <App />
  </IssuePanel>
);
