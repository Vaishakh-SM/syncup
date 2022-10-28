import ForgeUI, { render, Radio, RadioGroup ,Fragment, Text,TextArea, Tabs, Tab, IssuePanel,IssueAction, ModalDialog, Form, Button, useState, TextField, useProductContext, useEffect, Select, Option } from '@forge/ui';
import { storage } from '@forge/api';
import { addSyncupComment, getAllApis, getProjectKeys, propertyAddApi, propertyAddSubscribe, propertyDeleteApi, propertyGetSubscribe, propertyGetUnsubscribe, propertyUnsubscribe, createIssue, sendUpdatesToSubscribedProjects } from './api';

const ProjectAPISelect = (props) => {

  const rows = [];
  const context = useProductContext();

  const onUpdateApi = async (formData) => {
    await addSyncupComment("Delete", formData.updateApi, context.platformContext.issueKey);

    if (formData.action === 'remove'){
      await propertyDeleteApi(formData, context.platformContext.issueKey)
    }

    let resp = await sendUpdatesToSubscribedProjects(formData.updateApi,formData.title,formData.description,formData.priority);
    console.log("Response of dprecrcate: ",resp);
  }

  for( let api of props.projectApi){
    rows.push(<Option label={api} value={api} />);
  }


  return(
  <Form onSubmit={onUpdateApi}>
    <Select label="Choose API" name="updateApi" isRequired={true}>
      {rows}
    </Select>
    <TextField label="Title" name="title"  isRequired={true}/>
    <TextArea label="Description" name="description" />
    <Select label="Action" name="action">
      <Option defaultSelected label="Update" value="update" />
      <Option label="Deprecate" value="deprecate" />
      <Option label="Remove" value="remove" />
    </Select>
    <Select label="Priority" name="priority">
      <Option defaultSelected label="Medium" value="Medium" />
      <Option label="Highest" value="Highest" />
      <Option label="High" value="High" />
      <Option label="Low" value="Low" />
      <Option label="Lowest" value="Lowest" />
    </Select>
  </Form>
  );

};

const ProjectSubscribeSelect = ({allApis}) =>{
  const rows = [];
  const context = useProductContext();

  for( let project of allApis){
    rows.push(<Option label={project} value={project}/>);
  }

  const addSubscription = async (formData) =>{
    await propertyAddSubscribe(formData.apiname, context.platformContext.issueKey);

    await propertyGetSubscribe(context.platformContext.issueKey);
  };

  const unsubscribe = async (formData) =>{
    await propertyUnsubscribe(formData.apiname, context.platformContext.issueKey);

    await propertyGetUnsubscribe(context.platformContext.issueKey);
  };

  const handleSubmit = async(formData) =>{
    if(formData.action === "subscribe"){
      await addSubscription(formData);
    }else{
      await unsubscribe(formData);
    }
  }

  return(
  <Form onSubmit={handleSubmit} submitButtonText={"Go"}>
    <Select label="Choose API" name="apiname" isRequired={true}>
      {rows}
    </Select>
    <RadioGroup name="action" label="Action">
          <Radio defaultChecked value="subscribe" label="Subscribe" />
          <Radio value="unsubscribe" label="Unsubscribe" />
    </RadioGroup>

  </Form>
  );
}

const App = () => {

  const context = useProductContext();
  const [projectApi,setProjectApi] = useState([]);
  const [apiExistsModal, setApiExistsModal] = useState(false);
  const [allApis, setAllApis] = useState([]);

  useEffect(async ()=>{
    const _projectAPIs = await storage.get(context.platformContext.projectKey);
    if(typeof _projectAPIs !== 'undefined' && typeof _projectAPIs["storedAPIs"] !== 'undefined'){
      console.log("Project APi: ", _projectAPIs)
      setProjectApi(_projectAPIs["storedAPIs"]);
    }

    const _projectKeys = await getAllApis();
    setAllApis(_projectKeys);

  },[])


  const onAddApi = async (formData) => {
    if(allApis.includes(formData.apiname)){
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

        {/* <Button text="Create issue" onClick={async ()=>{await createIssue("TES2", "Title1", "Some random desc")}}/> */}
        {/* <Button text = "Clear" onClick={async () =>{await storage.delete(context.platformContext.projectKey);}}/> */}
        </Tab>
      
        <Tab label="Update">

            <ProjectAPISelect projectApi = {projectApi}/>

        </Tab>

        <Tab label="Subscription">
            <ProjectSubscribeSelect allApis = {allApis}/>
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
