import ForgeUI, { render, Fragment, Text, Tabs, Tab, IssuePanel,IssueAction, ModalDialog, Form, Button, useState, TextField, useProductContext, useEffect, Select, Option } from '@forge/ui';
import { storage } from '@forge/api';
import { addSyncupComment, propertyAddApi } from './api';

const ProjectAPISelect = (props) => {

  const rows = [];

    for( let api of props.rows){
      rows.push(<Option label={api} value={api} />);
    }

  console.log("PROPS: ",props);



  return(
  <Select label="Choose API" name="projectapiselect">
    {rows}
  </Select>
  );

};

const App = () => {

  const context = useProductContext();
  const [rows,setRows] = useState([]);
  const [apiExistsModal, setApiExistsModal] = useState(false);

  useEffect(async ()=>{
    const projectAPIs = await storage.get(context.platformContext.projectKey);
    if(typeof projectAPIs !== 'undefined'){
      setRows(projectAPIs["storedAPIs"]);
    }
  },[])


  const onAddApi = async (formData) => {
    if(rows.includes(formData.apiname)){
      setApiExistsModal(true);
    }else{
    await addSyncupComment("add", formData.apiname, context.platformContext.issueKey);
  
    await propertyAddApi(formData.apiname, context.platformContext.issueKey);
    }
  };


  return (
    <Fragment>
      {apiExistsModal && (
        <ModalDialog header="API Already Exists" onClose={() => setApiExistsModal(false)}>
          <Text>Another API of this name already exists!</Text>
        </ModalDialog>
      )}

      <Tabs>

        <Tab label="Add">
        <Form onSubmit={onAddApi}>
          <TextField name="apiname" label="API Name" />
        </Form>
        </Tab>
      
        <Tab label="Deprecate">
            <Form>
              <ProjectAPISelect rows = {rows}/>
            </Form>
        </Tab>

        <Tab label="Subscription">

        </Tab>
      </Tabs>

    </Fragment>
  );
};

export const run = render(
  <IssuePanel>
    <App />
  </IssuePanel>
);
