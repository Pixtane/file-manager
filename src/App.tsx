import { ReactNode, useState, useMemo } from "react";
import "./App.css";
import Card from "./components/Card";
import MemoizedAlert from "./components/Alert";
import CreateFolderButton from "./components/CreateFolderButton";
import MiniForm from "./components/MiniForm";
import Warning from "./components/Warning";
import { useNavigate, useLocation } from "react-router-dom";

import axios from "axios";

import foldersData from "./user-data/folders.json";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [jsonData, setJsonData] = useState(foldersData);
  const [isMiniFormVisible, setIsMiniFormVisible] = useState(false);
  const [isDeleteFolderVisible, setIsDeleteFolderVisible] = useState(false);
  let [activeFolder, setActiveFolder] = useState("");

  const folderNameRegex =
    /^(?!(?:CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(?:\.[^.]*)?$)[^<>:"/\\|?*\x00-\x1F]*[^<>:"/\\|?*\x00-\x1F\ .]$/;

  function handleFolderClick(text: string) {
    const queryParams = new URLSearchParams(location.search);
    let newPath;

    // Check for existing path parameter
    let existingPathParam = queryParams.get("path");
    if (existingPathParam === null) {
      newPath = `/?path=${text}`;
      queryParams.set("path", newPath);
      navigate(newPath);
      return;
    }
    if (existingPathParam.split("/")[-1] === "") {
      existingPathParam = existingPathParam.split("/").slice(0, -1).join("/");
    }
    newPath = existingPathParam
      ? `/?path=${existingPathParam}/${text}`
      : `/?path=${text}`;
    //console.log(newPath, existingPathParam, text);
    queryParams.set("path", newPath);
    navigate(newPath);
  }
  function handleFolderBack() {
    const queryParams = new URLSearchParams(location.search);
    let existingPathParam = queryParams.get("path");

    if (!queryParams || !existingPathParam || existingPathParam == undefined) {
      return;
    }
    if (existingPathParam.split("/")[-1] === "") {
      existingPathParam = existingPathParam.split("/").slice(0, -1).join("/");
    }

    const newPath = existingPathParam.split("/").slice(0, -1).join("/");
    //console.log(newPath, existingPathParam, text);
    queryParams.set("path", newPath);
    navigate("/?path=" + newPath);
  }

  function handleFolderCreate(name: string) {
    if (!folderNameRegex.test(name)) {
      console.log("Invalid folder name: " + name);
      setIsMiniFormVisible(false);
      return;
    }

    let myPath: string | null | any[];

    myPath = new URLSearchParams(location.search).get("path");

    if (myPath === null) {
      myPath = [];
    } else if (myPath.split("/")[myPath.split("/").length - 1] === "") {
      myPath = myPath.split("/").slice(0, -1);
    } else {
      myPath = myPath.split("/");
    }
    // Function to add a new object based on path and name
    const addNewObject = (myPath: string[], name: string) => {
      // Create a copy of the current JSON data
      const updatedJsonData = { ...jsonData };

      // Traverse the nested structure using the path
      let currentLevel: any = updatedJsonData;
      for (const level of myPath) {
        if (!currentLevel[level]) {
          currentLevel[level] = {};
        }
        currentLevel = currentLevel[level];
      }

      // Add the new object with the provided name
      currentLevel[name] = {};

      console.log(currentLevel);

      // Update the state with the new JSON data
      setJsonData(updatedJsonData);

      const sendData = async (data: any) => {
        try {
          const response = await axios.post(
            "http://localhost:3001/submitData",
            data
          );
          console.log(response.data);
        } catch (error: any) {
          console.error("Error sending data:", error.message);
        }
      };

      // Call the function to send data
      sendData(updatedJsonData);
    };
    addNewObject(myPath, name);
    setIsMiniFormVisible(false);
  }

  function handleFolderDelete() {
    setIsDeleteFolderVisible(false);
    console.log("Active folder: " + activeFolder);
    if (activeFolder === "") {
      console.error("No folder specified");
      return;
    }

    let myPath: string | null | any[];

    myPath = new URLSearchParams(location.search).get("path");

    // Convert the path string to an array and remove unnecessary
    if (myPath === null) {
      myPath = [];
    } else if (myPath.split("/")[myPath.split("/").length - 1] === "") {
      myPath = myPath.split("/").slice(0, -1);
    } else {
      myPath = myPath.split("/");
    }

    // Function to add a new object based on path and name
    const removeObject = (myPath: string[], name: string) => {
      // Create a copy of the current JSON data
      const updatedJsonData = { ...jsonData };

      // Traverse the nested structure using the path
      let currentLevel: any = updatedJsonData;
      for (const level of myPath) {
        if (!currentLevel[level]) {
          // If the path doesn't exist, there's nothing to delete
          return;
        }
        currentLevel = currentLevel[level];
      }

      // Check if the object with the provided name exists
      if (currentLevel[name]) {
        // Delete the object with the provided name
        delete currentLevel[name];
      } else {
        // If the object doesn't exist, there's nothing to delete
        return;
      }

      // Update the state with the new JSON data
      setJsonData(updatedJsonData);

      const sendData = async (data: any) => {
        try {
          const response = await axios.post(
            "http://localhost:3001/submitData",
            data
          );
          console.log(response.data);
        } catch (error: any) {
          console.error("Error sending data:", error.message);
        }
      };

      // Call the function to send data
      sendData(updatedJsonData);
    };

    removeObject(myPath, activeFolder);
    setActiveFolder("");
  }

  function accessNestedObject(baseObject: any, keyList: string[]): any {
    if (!keyList) {
      return baseObject;
    }
    return keyList.reduce(
      (acc, key) => (acc && acc[key] ? acc[key] : null),
      baseObject
    );
  }

  function returnCardList(path: string | null): ReactNode {
    if (!path) {
      path = "";
      //throw new Error("Null path!");
    }

    let folderNames = path.split("/");
    if (folderNames[folderNames.length - 1] === "") {
      folderNames.pop();
    }
    folderNames.forEach((folderName) => {
      if (!folderNameRegex.test(folderName)) {
        throw new Error("Invalid folder name - " + folderName);
      }
    });

    const currentFolder = accessNestedObject(jsonData, folderNames);

    function handleFolderRightClick(name: string) {
      console.log("Right click", name);
      setActiveFolder(name);
      setIsDeleteFolderVisible(true);
    }

    const elementList = Object.keys(currentFolder).map((itemName, index) => (
      <Card
        key={index}
        type="folder"
        onContextMenu={() => handleFolderRightClick(itemName)}
        onClick={handleFolderClick}
      >
        {itemName}
      </Card>
    ));

    return (
      <>
        <div className="row row-cols-6">
          {path !== "" && (
            <Card
              type="folder"
              onClick={handleFolderBack}
              onContextMenu={() => {}}
            >
              ..
            </Card>
          )}
          {elementList}
        </div>
      </>
    );
    /*
      console.log(error);
      console.log(isAlertVisible);
      if (!isAlertVisible) {
        setIsAlertVisible(true);
      }
      console.log(isAlertVisible);
      return;
      */
  }

  const path2 = new URLSearchParams(location.search).get("path");
  const memoizedCardList = useMemo(() => returnCardList(path2), [path2]);
  return (
    <>
      <div className="container text-center">
        <CreateFolderButton
          classes=""
          onClick={() => setIsMiniFormVisible(true)}
        />
        {returnCardList(path2)}
        {isAlertVisible && (
          <MemoizedAlert
            color="danger"
            onClick={() => setIsAlertVisible(false)}
          >
            Something went wrong!
          </MemoizedAlert>
        )}
        {isMiniFormVisible && (
          <MiniForm
            title="Enter new folder name"
            color="dark"
            inputType="text"
            buttonText="Submit"
            buttonColor="success"
            placeholdertext="Folder name"
            onClick={handleFolderCreate}
          ></MiniForm>
        )}
        {isDeleteFolderVisible && (
          <Warning
            title="Delete folder?"
            color="dark"
            acceptButtonText="OK"
            acceptButtonColor="success"
            declineButtonText="Cancel"
            declineButtonColor="danger"
            onAccept={() => handleFolderDelete()}
            onDecline={() => setIsDeleteFolderVisible(false)}
          ></Warning>
        )}
      </div>
    </>
  );
}

export default App;
