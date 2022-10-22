import ForgeUI, { render, Fragment, Text, Tabs, Tab, IssuePanel,IssueAction, ModalDialog, Form, Button, useState, TextField, useProductContext, useEffect, Select, Option } from '@forge/ui';
import api, { route } from "@forge/api";
import { addSyncupComment } from './api';



const App = () => {
  const [formState, setFormState] = useState(undefined);
  const context = useProductContext();

  const onAddApi = async (formData) => {
    addSyncupComment("add", formData.apiname, context.platformContext.issueKey);

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
