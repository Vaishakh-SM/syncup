import ForgeUI, { render, Fragment, Text, IssuePanel,IssueAction, ModalDialog, Form, Button, useState, TextField, useProductContext, useEffect } from '@forge/ui';
import api, { route } from "@forge/api";


const App = () => {
  const [formState, setFormState] = useState(undefined);
  const context = useProductContext();

  const onAddApi = async (formData) => {
    console.log("Formdata: ",formData)
    const PROPKEY = "StoredAPIs"
    const getresponse = await api.asApp().requestJira(route`/rest/api/3/issue/${context.platformContext.issueKey}/properties/${PROPKEY}`, {
      headers: {
        'Accept': 'application/json'
      }
    });
    const currentData = await getresponse.json();
    // console.log("CURRL: ", currentData);
    console.log("type CURRL: ", typeof(currentData['value']));
    let storedAPIs;
    if (typeof(currentData['value']) !== 'undefined'){
      console.log("Executing first IF")
      storedAPIs = currentData['value']['APIs'];
    }else{
      storedAPIs = [];
    }
    

    storedAPIs.push(formData['apiname'])

    console.log(`GET Response: ${getresponse.status} ${getresponse.statusText}`);
    // console.log("Current data is ",currentData['value']['APIs']);

    var bodyData = {
      APIs: storedAPIs
    };

    const jsonData = JSON.stringify(bodyData);

    console.log("Json data is ", jsonData);

    const response = await api.asApp().requestJira(route`/rest/api/3/issue/${context.platformContext.issueKey}/properties/${PROPKEY}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: jsonData
    });

    // console.log(`Response: ${response.status} ${response.statusText}`);
    // console.log(response);

    setFormState(formData);
  };

  const goBack = () => {};
  const cancel = () => {};

  // The array of additional buttons.
  // These buttons align to the right of the submit button.
  const actionButtons = [
    <Button text="Go back" onClick={goBack} />,
    <Button text="Cancel" onClick={cancel} />,
  ];

  // useEffect(async ()=>{
  //   const response = await api.asApp().requestJira(route`/rest/api/3/issue/${context.platformContext.issueKey}/properties/textrand`, {
  //     headers: {
  //       'Accept': 'application/json'
  //     }
  //   });
    
  //   console.log(`Response: ${response.status} ${response.statusText}`);
  //   console.log(await response.json());
  // },[])


  return (
    <Fragment>
      <Form onSubmit={onAddApi}>
        <TextField name="apiname" label="Add API" />

      </Form>
      {formState && <Text>{JSON.stringify(formState)}</Text>}
    </Fragment>
  );
};

















export const run = render(
  <IssuePanel>
    <App />
  </IssuePanel>
);

const App2 = () => {
  const [isOpen, setOpen] = useState(true);
  const [formState, setFormState] = useState(undefined);

  const onSubmit = async (formData) => {
    setFormState(formData);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <ModalDialog header="Syncup" onClose={() => setOpen(false)}>
      <Text>Subscribe</Text>
      <Form onSubmit={onSubmit}>
        <TextField name="username" label="Username" />
      </Form>
      {formState && <Text>{JSON.stringify(formState)}</Text>}
    </ModalDialog>
  );
};

export const run2 = render(
  <IssueAction>
    <App2/>
  </IssueAction>
);