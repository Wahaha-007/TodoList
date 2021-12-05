//let taskCollection = [];
let projCollection = [];
let activeProject = 0;
//let currentTask = 0;

function taskObj(name, date, prior, done) {
    this.name = name;
    this.date = date;
    this.prior = prior;
    this.done = done;
    this.serial = projCollection[activeProject].taskArray.length;
}

function projObj(name, taskArray) {
    this.name = name;
    this.taskArray = taskArray;
    this.serial = projCollection.length;
}
/******************************************* END OBJECT DECLARATION ******************************/

function reAttachTaskButton() {

    /* Add Monitoring for delete button */
    const gDel = Array.from(document.querySelectorAll('.pbDelete'));
    gDel.forEach(key => key.addEventListener('click', deleteTask));

    /* Add Monitoring for done button */
    const gDone = Array.from(document.querySelectorAll('.pbDone'));
    gDone.forEach(key => key.addEventListener('click', doneTask));

    /* Add Monitoring for update button */
    const gUpdate = Array.from(document.querySelectorAll('.pbUpdate'));
    gUpdate.forEach(key => key.addEventListener('click', updateTask));
}

function addTaskDOM(reverse, mName, mDate, mPrior, mDone, mSerial) {

    const cContainer = document.querySelector(".rootOldTask");

    const oldWrapper = document.createElement("div");
    oldWrapper.setAttribute("class", "oldWrapper mSerial" + mSerial); // Add class for easy deletion by button later

    const oldContain = document.createElement("div");
    oldContain.setAttribute("class", "oldContainer");

    /* 1.Update Left side of Task : Name */
    const iName = document.createElement("div");
    iName.setAttribute("class", "itemName name" + mSerial + " prior" + mPrior); // Add class for easy managing item color
    iName.textContent = mName;

    if (mDone) {
        iName.setAttribute("style", "color:gray");
    }


    /* 2.Update Right side of Task : Date and Button */
    const iRight = document.createElement("div");
    iRight.classList.add("itemRight");

    const iDate = document.createElement("div");
    iDate.setAttribute("class", "itemDate name" + mSerial); // Add class for easy managing item color
    iDate.textContent = mDate;

    if (mDone) {
        iDate.setAttribute("style", "color:gray");
    }

    const iDone = document.createElement("button");
    iDone.setAttribute("class", "pbDone");
    iDone.setAttribute("val", mSerial);
    iDone.textContent = "Done";

    const iEdit = document.createElement("button");
    iEdit.setAttribute("class", "pbUpdate");
    iEdit.setAttribute("val", mSerial);
    iEdit.textContent = "Update";

    const iDelete = document.createElement("button");
    iDelete.setAttribute("class", "pbDelete");
    iDelete.setAttribute("val", mSerial);
    iDelete.textContent = "x";

    const iLine = document.createElement("hr");

    /* 2.1 Final task combination */

    iRight.appendChild(iDate);
    iRight.appendChild(iDone);
    iRight.appendChild(iEdit);
    iRight.appendChild(iDelete);

    oldContain.appendChild(iName);
    oldContain.appendChild(iRight);

    oldWrapper.appendChild(oldContain);
    oldWrapper.appendChild(iLine);

    if (reverse) {
        cContainer.prepend(oldWrapper);
    } else {
        cContainer.appendChild(oldWrapper);
    }
}

function addTask(e) {

    e.preventDefault(); // Stop form from sending request to server

    /* 1.Input from to DOM */

    const mName = taskForm.elements['tName'].value;
    const mDate = taskForm.elements['tDate'].value;
    const mPrior = taskForm.elements['tPriority'].value;
    const mDone = false;

    if (mName == '' || mDate == '') return;

    /* 2.Output to DOM */

    addTaskDOM(true, mName, mDate, mPrior, mDone, projCollection[activeProject].taskArray.length);
    reAttachTaskButton();

    /* 3.Clear input field */

    taskForm.elements['tName'].value = "";
    taskForm.elements['tDate'].value = "";

    /* 4.Output to Array */

    const task = new taskObj(mName, mDate, mPrior, mDone);

    projCollection[activeProject].taskArray.push(task);

    /* 5.Update localStorage */

    localStorage.setItem("myProjData", JSON.stringify(projCollection));
}

function deleteTask(e) {

    let dSerial = Number(e.target.getAttribute('val'));
    const rRead = document.querySelector(".mSerial" + dSerial);

    /* 1.Remove from Array */
    delete projCollection[activeProject].taskArray[dSerial];

    /* 2.Remove from DOM */
    rRead.remove();

    reAttachTaskButton();

    /* 3.Update localStorage */
    localStorage.setItem("myProjData", JSON.stringify(projCollection));
}

function updateTask(e) {

    let dSerial = Number(e.target.getAttribute('val'));
    const rRead = document.querySelector(".mSerial" + dSerial);

    taskForm.elements['tName'].value = projCollection[activeProject].taskArray[dSerial].name;
    taskForm.elements['tDate'].value = projCollection[activeProject].taskArray[dSerial].date;
    taskForm.elements['tPriority'].value = projCollection[activeProject].taskArray[dSerial].prior;

    deleteTask(e);

    /* 3.Update localStorage */
    localStorage.setItem("myProjData", JSON.stringify(projCollection));
}

function doneTask(e) {
    let dSerial = Number(e.target.getAttribute('val'));

    if (projCollection[activeProject].taskArray[dSerial].done == false) {

        projCollection[activeProject].taskArray[dSerial].done = true;
        const gRead = Array.from(document.querySelectorAll('.name' + dSerial));
        gRead.forEach(key => key.setAttribute("style", "color:gray"));
    } else {
        projCollection[activeProject].taskArray[dSerial].done = false;
        const gRead = Array.from(document.querySelectorAll('.name' + dSerial));
        gRead.forEach(key => key.setAttribute("style", "color:blanchedalmond"));

    }

    /* 3.Update localStorage */
    localStorage.setItem("myProjData", JSON.stringify(projCollection));
}

/****************************** END TASK SECTION ****************************************/

function reAttachProjButton() {

    /* Add Monitoring for delete button */
    const gDel = Array.from(document.querySelectorAll('.pjDelete'));
    gDel.forEach(key => key.addEventListener('click', deleteProj));

    /* Addd Monitoring for active project */
    const actProj = Array.from(document.querySelectorAll('.pjTopic'));
    actProj.forEach(key => key.addEventListener('click', activatePrj));
}


function addProjDOM(reverse, pjName, pjSerial) {

    const mSerial = pjSerial;

    const cContainer = document.querySelector(".rootOldProject");

    const oldProject = document.createElement("div");
    oldProject.setAttribute("class", "oldProject prj" + mSerial); // Add class for easy deletion by button later

    /* Project content */

    const ipName = document.createElement("button");
    ipName.setAttribute("class", "pjTopic");
    ipName.setAttribute("val", mSerial);
    ipName.textContent = pjName;

    const iDelete = document.createElement("button");
    iDelete.setAttribute("class", "pjDelete pjDel" + mSerial);
    iDelete.setAttribute("val", mSerial);
    iDelete.textContent = "x";

    /* Final task combination */

    oldProject.appendChild(ipName);
    oldProject.appendChild(iDelete);

    if (reverse) {
        cContainer.prepend(oldProject);
    } else {
        cContainer.appendChild(oldProject);
    }
}


function addProj(e) {

    const pjArray = [];

    e.preventDefault(); // Stop form from sending request to server

    /* 1.Input from to DOM */

    const pjName = projForm.elements['pjName'].value;

    if (pjName == '') return; // If input empty name, do nothing

    /* 2.Output to DOM */

    addProjDOM(true, pjName, projCollection.length);
    reAttachProjButton();

    projForm.elements['pjName'].value = "";


    /* 3.Output to Array */

    const proj = new projObj(pjName, pjArray);
    projCollection.push(proj);

    /* 4.Auto active just added project */

    activeProject = projCollection.length - 1;
    displayProjTask(activeProject);

    /* 5.Update localStorage */
    localStorage.setItem("myProjData", JSON.stringify(projCollection));
}

function deleteProj(e) {

    let dSerial = Number(e.target.getAttribute('val'));
    const rRead = document.querySelector(".prj" + dSerial);
    /* 1. Not remove default project */
    // if (dSerial == 0) return;

    /* 2.Remove from DOM */
    rRead.remove(); // Remove from DOM

    /* 3.Remove from Array */
    delete projCollection[dSerial]; // Remove from Array, intentionally left hole

    reAttachProjButton();

    /* 3.If remove current project, auto set activeProject to "General" */
    if (dSerial == activeProject) {
        activeProject = 0;
        displayProjTask(activeProject);
    }

    /* 4.Update localStorage */
    localStorage.setItem("myProjData", JSON.stringify(projCollection));
}

/****************************** END PROJECT SECTION ****************************************/

function displayProjTask(projNumber) {

    let iName, iDate, iPrior, iDone, iSerial;

    /* 1. Update Header Display */

    const mHead = document.querySelector(".projHeader");
    mHead.textContent = projCollection[projNumber].name + "'s Task(s)";

    /* 2. Delte all displayed task */
    const mAllTask = document.querySelector(".rootOldTask");

    while (mAllTask.firstChild) {
        mAllTask.removeChild(mAllTask.firstChild);
    }

    /* 3. Display new tasks to DOM*/
    for (i = 0; i < projCollection[projNumber].taskArray.length; i++) {

        if (projCollection[projNumber].taskArray[i]) {
            iName = projCollection[projNumber].taskArray[i].name;
            iDate = projCollection[projNumber].taskArray[i].date;
            iPrior = projCollection[projNumber].taskArray[i].prior;
            iDone = projCollection[projNumber].taskArray[i].done;
            iSerial = projCollection[projNumber].taskArray[i].serial;

            // function addTaskDOM(reverse, mName, mDate, mPrior, mDone, mSerial) {
            addTaskDOM(true, iName, iDate, iPrior, iDone, iSerial);
        }
    }

    reAttachTaskButton();
}

function activatePrj(e) {

    let projectNum = Number(e.target.getAttribute('val'));


    if (activeProject != projectNum) { // User changes project !

        activeProject = projectNum;

        displayProjTask(activeProject);
    }
}


function initPrj() {

    /* 0.Load from localStorage */

    projCollection = JSON.parse(localStorage.getItem("myProjData") || "[]"); // Loading only Object parameter, not function

    if (projCollection.length === 0) {

        // 1.Setup default project if there is nothing 

        const pjName = "General";
        const pjArray = [];

        // 2.Output to DOM 

        addProjDOM(true, pjName, 0);

        // 3.Output to Array 

        const proj = new projObj(pjName, pjArray);
        projCollection.push(proj);
    } else {

        for (i = 0; i < projCollection.length; i++) {

            if (projCollection[i]) {
                addProjDOM(true, projCollection[i].name, projCollection[i].serial);
            }
        }
    }

    reAttachProjButton();

    // 4. Update Task Window 

    activeProject = 0;
    displayProjTask(activeProject);

    // 5.Cannot remove default project 
    const pjDel = document.querySelector(".pjDel0");
    pjDel.remove();
}
/******************************** END ACTIVATE PROJECT ************************************/

const taskForm = document.getElementById('addTask');
taskForm.addEventListener('submit', addTask);

const projForm = document.getElementById('addProject');
projForm.addEventListener('submit', addProj);

const actProj = Array.from(document.querySelectorAll('.pjTopic'));
actProj.forEach(key => key.addEventListener('click', activatePrj));

initPrj();