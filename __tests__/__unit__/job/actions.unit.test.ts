/*
* This program and the accompanying materials are made available under the terms of the *
* Eclipse Public License v2.0 which accompanies this distribution, and is available at *
* https://www.eclipse.org/legal/epl-v20.html                                      *
*                                                                                 *
* SPDX-License-Identifier: EPL-2.0                                                *
*                                                                                 *
* Copyright Contributors to the Zowe Project.                                     *
*                                                                                 *
*/

import * as vscode from "vscode";
import * as zowe from "@zowe/cli";
import { Job } from "../../../src/job/ZoweJobNode";
import {
    createISession,
    createTreeView, createISessionWithoutCredentials, createTextDocument, createInstanceOfProfile, createValidIProfile
} from "../../../__mocks__/mockCreators/shared";
import { createIJobFile, createIJobObject, createJobsTree } from "../../../__mocks__/mockCreators/jobs";
import { createJesApi, bindJesApi } from "../../../__mocks__/mockCreators/api";
import * as jobActions from "../../../src/job/actions";
import { ZoweDatasetNode } from "../../../src/dataset/ZoweDatasetNode";
import * as dsActions from "../../../src/dataset/actions";
import * as globals from "../../../src/globals";
import { Logger } from "@zowe/imperative";
import { createDatasetSessionNode, createDatasetTree } from "../../../__mocks__/mockCreators/datasets";
import { Profiles } from "../../../src/Profiles";
import { ZoweExplorerApiRegister } from "../../../src/api/ZoweExplorerApiRegister";
import { DefaultProfileManager } from "../../../src/profiles/DefaultProfileManager";

const activeTextEditorDocument = jest.fn();

async function createGlobalMocks() {
    const globalMocks = {
        mockGetInstance: jest.fn(),
        mockProfileInstance: null,
        jesApi: null,
        defaultProfile: null,
        defaultProfileManagerInstance: null,
        mockGetJesApi: jest.fn(),
        commonApi: null,
        mockGetCommonApi: jest.fn(),
        imperativeProfile: createValidIProfile(),
        session: createISession(),
        sessionNoCreds: createISessionWithoutCredentials(),
        treeView: createTreeView(),
        iJob: createIJobObject(),
        testJobsTree: null,
    };

    // Mocking the Jes API
    globalMocks.jesApi = createJesApi(globalMocks.imperativeProfile);
    globalMocks.mockProfileInstance = createInstanceOfProfile(globalMocks.imperativeProfile, globalMocks.session);
    bindJesApi(globalMocks.jesApi);

    globalMocks.testJobsTree = createJobsTree(globalMocks.session,
                                              globalMocks.iJob,
                                              globalMocks.imperativeProfile,
                                              globalMocks.treeView);
    Profiles.createInstance(Logger.getAppLogger());
    globalMocks.mockGetInstance.mockReturnValue(globalMocks.mockProfileInstance);

    Object.defineProperty(vscode.window, "showInformationMessage", { value: jest.fn(), configurable: true });
    Object.defineProperty(vscode.window, "showInputBox", { value: jest.fn(), configurable: true });
    Object.defineProperty(vscode.window, "showErrorMessage", { value: jest.fn(), configurable: true });
    Object.defineProperty(zowe, "IssueCommand", { value: jest.fn(), configurable: true });
    Object.defineProperty(zowe.IssueCommand, "issueSimple", { value: jest.fn(), configurable: true });
    Object.defineProperty(vscode.window, "showOpenDialog", { value: jest.fn(), configurable: true });
    Object.defineProperty(zowe, "GetJobs", { value: jest.fn(), configurable: true });
    Object.defineProperty(zowe.GetJobs, "getJclForJob", { value: jest.fn(), configurable: true });
    Object.defineProperty(vscode.workspace, "openTextDocument", { value: jest.fn(), configurable: true });
    Object.defineProperty(vscode.window, "showTextDocument", { value: jest.fn(), configurable: true });
    Object.defineProperty(zowe, "ZosmfSession", { value: jest.fn(), configurable: true });
    Object.defineProperty(zowe.ZosmfSession, "createBasicZosmfSessionFromArguments", { value: jest.fn(), configurable: true });
    Object.defineProperty(vscode.window, "activeTextEditor", { value: jest.fn(), configurable: true });
    Object.defineProperty(vscode.window, "showQuickPick", { value: jest.fn(), configurable: true });
    Object.defineProperty(vscode.window.activeTextEditor, "document", {
        get: activeTextEditorDocument,
        configurable: true
    });
    Object.defineProperty(globals, "LOG", { value: jest.fn(), configurable: true });
    Object.defineProperty(globals.LOG, "debug", { value: jest.fn(), configurable: true });
    Object.defineProperty(globals.LOG, "error", { value: jest.fn(), configurable: true });
    Object.defineProperty(Profiles, "getInstance", { value: globalMocks.mockGetInstance, configurable: true });
    Object.defineProperty(vscode, "Uri", { value: jest.fn(), configurable: true });
    Object.defineProperty(vscode.Uri, "parse", { value: jest.fn(), configurable: true });

    // Profile instance mocks
    globalMocks.defaultProfileManagerInstance = await DefaultProfileManager.createInstance(Logger.getAppLogger());
    await Profiles.createInstance(Logger.getAppLogger());
    globalMocks.defaultProfile = DefaultProfileManager.getInstance().getDefaultProfile("zosmf");
    Object.defineProperty(DefaultProfileManager,
                          "getInstance",
                          { value: jest.fn(() => globalMocks.defaultProfileManagerInstance), configurable: true });
    Object.defineProperty(globalMocks.defaultProfileManagerInstance,
                          "getDefaultProfile",
                          { value: jest.fn(() => globalMocks.defaultProfile), configurable: true });

    // Jes API mocks
    globalMocks.jesApi = ZoweExplorerApiRegister.getJesApi(globalMocks.imperativeProfile);
    globalMocks.mockGetJesApi.mockReturnValue(globalMocks.jesApi);
    Object.defineProperty(globalMocks.jesApi, "getValidSession", { value: jest.fn(() => globalMocks.session), configurable: true });
    ZoweExplorerApiRegister.getJesApi = globalMocks.mockGetJesApi.bind(ZoweExplorerApiRegister);

    // Common API mocks
    globalMocks.commonApi = ZoweExplorerApiRegister.getCommonApi(globalMocks.imperativeProfile);
    globalMocks.mockGetCommonApi.mockReturnValue(globalMocks.commonApi);
    Object.defineProperty(globalMocks.commonApi, "getValidSession", { value: jest.fn(() => globalMocks.session), configurable: true });
    ZoweExplorerApiRegister.getCommonApi = globalMocks.mockGetCommonApi.bind(ZoweExplorerApiRegister);

    return globalMocks;
}

// Idea is borrowed from: https://github.com/kulshekhar/ts-jest/blob/master/src/util/testing.ts
const mocked = <T extends (...args: any[]) => any>(fn: T): jest.Mock<ReturnType<T>> => fn as any;

describe("Jobs Actions Unit Tests - Function setPrefix", () => {
    it("Checking that the prefix is set correctly on the job", async () => {
        const globalMocks = await createGlobalMocks();
        const node = new Job("job", vscode.TreeItemCollapsibleState.None, null, globalMocks.session, null, null);

        mocked(vscode.window.showInputBox).mockResolvedValueOnce("*");
        await jobActions.setPrefix(node, globalMocks.testJobsTree);

        expect(mocked(vscode.window.showInputBox).mock.calls.length).toBe(1);
        expect(mocked(vscode.window.showInputBox).mock.calls[0][0]).toEqual({
            prompt: "Prefix"
        });
        expect(mocked(vscode.window.showInformationMessage).mock.calls.length).toBe(0);
    });
});

describe("Jobs Actions Unit Tests - Function setOwner", () => {
    it("Checking that the owner is set correctly on the job", async () => {
        const globalMocks = await createGlobalMocks();
        const node = new Job("job", vscode.TreeItemCollapsibleState.None, null,
            globalMocks.session, globalMocks.iJob, globalMocks.imperativeProfile);

        mocked(vscode.window.showInputBox).mockResolvedValueOnce("OWNER");
        await jobActions.setOwner(node, globalMocks.testJobsTree);

        expect(mocked(vscode.window.showInputBox).mock.calls.length).toBe(1);
        expect(mocked(vscode.window.showInputBox).mock.calls[0][0]).toEqual({
            prompt: "Owner",
        });
        expect(mocked(vscode.window.showInformationMessage).mock.calls.length).toBe(0);
    });
});

describe("Jobs Actions Unit Tests - Function stopCommand", () => {
    it("Checking that stop command of Job Node is executed properly", async () => {
        const globalMocks = await createGlobalMocks();
        const node = new Job("job", vscode.TreeItemCollapsibleState.None, null,
            globalMocks.session, globalMocks.iJob, globalMocks.imperativeProfile);

        mocked(zowe.IssueCommand.issueSimple).mockResolvedValueOnce({
            success: false,
            zosmfResponse: [],
            commandResponse: "fake response"
        });
        await jobActions.stopCommand(node);
        expect(mocked(vscode.window.showInformationMessage).mock.calls.length).toBe(1);
        expect(mocked(vscode.window.showInformationMessage).mock.calls[0][0]).toEqual(
            "Command response: fake response"
        );
    });
    it("Checking failed attempt to issue stop command for Job Node.", async () => {
        const globalMocks = await createGlobalMocks();
        mocked(zowe.IssueCommand.issueSimple).mockResolvedValueOnce({
            success: false,
            zosmfResponse: [],
            commandResponse: "fake response"
        });
        await jobActions.stopCommand(undefined);
        expect(mocked(vscode.window.showErrorMessage).mock.calls.length).toBe(1);
    });
});

describe("Jobs Actions Unit Tests - Function modifyCommand", () => {
    it("Checking modification of Job Node", async () => {
        const globalMocks = await createGlobalMocks();
        const node = new Job("job", vscode.TreeItemCollapsibleState.None, null,
            globalMocks.session, globalMocks.iJob, globalMocks.imperativeProfile);

        mocked(vscode.window.showInputBox).mockResolvedValue("modify");
        mocked(zowe.IssueCommand.issueSimple).mockResolvedValueOnce({
            success: false,
            zosmfResponse: [],
            commandResponse: "fake response"
        });
        await jobActions.modifyCommand(node);
        expect(mocked(vscode.window.showInformationMessage).mock.calls.length).toBe(1);
        expect(mocked(vscode.window.showInformationMessage).mock.calls[0][0]).toEqual(
            "Command response: fake response"
        );
    });
    it("Checking failed attempt to modify Job Node", async () => {
        const globalMocks = await createGlobalMocks();
        mocked(vscode.window.showInputBox).mockResolvedValue("modify");
        mocked(zowe.IssueCommand.issueSimple).mockResolvedValueOnce({
            success: false,
            zosmfResponse: [],
            commandResponse: "fake response"
        });
        await jobActions.modifyCommand(undefined);
        expect(mocked(vscode.window.showErrorMessage).mock.calls.length).toBe(1);
    });
});

describe("Jobs Actions Unit Tests - Function downloadSpool", () => {
    it("Checking download of Job Spool", async () => {
        const globalMocks = await createGlobalMocks();
        const node = new Job("job", vscode.TreeItemCollapsibleState.None, null,
            globalMocks.session, globalMocks.iJob, globalMocks.imperativeProfile);
        const fileUri = {
            fsPath: "/tmp/foo",
            scheme: "",
            authority: "",
            fragment: "",
            path: "",
            query: ""
        };
        mocked(vscode.window.showOpenDialog).mockResolvedValue([fileUri as vscode.Uri]);
        const downloadFileSpy = jest.spyOn(globalMocks.jesApi, "downloadSpoolContent");

        await jobActions.downloadSpool(node);
        expect(mocked(vscode.window.showOpenDialog)).toBeCalled();
        expect(downloadFileSpy).toBeCalled();
        expect(downloadFileSpy.mock.calls[0][0]).toEqual(
            {
                jobid: node.job.jobid,
                jobname: node.job.jobname,
                outDir: fileUri.fsPath
            }
        );
    });
    it("Checking failed attempt to download Job Spool", async () => {
        const globalMocks = await createGlobalMocks();
        const fileUri = {
            fsPath: "/tmp/foo",
            scheme: "",
            authority: "",
            fragment: "",
            path: "",
            query: ""
        };
        mocked(vscode.window.showOpenDialog).mockResolvedValue([fileUri as vscode.Uri]);
        await jobActions.downloadSpool(undefined);
        expect(mocked(vscode.window.showErrorMessage).mock.calls.length).toBe(1);
    });
});

describe("Jobs Actions Unit Tests - Function downloadJcl", () => {
    it("Checking download of Job JCL", async () => {
        const globalMocks = await createGlobalMocks();
        const node = new Job("job", vscode.TreeItemCollapsibleState.None, null,
            globalMocks.session, globalMocks.iJob, globalMocks.imperativeProfile);

        await jobActions.downloadJcl(node);
        expect(mocked(zowe.GetJobs.getJclForJob)).toBeCalled();
        expect(mocked(vscode.workspace.openTextDocument)).toBeCalled();
        expect(mocked(vscode.window.showTextDocument)).toBeCalled();
    });
    it("Checking failed attempt to download Job JCL", async () => {
        const globalMocks = await createGlobalMocks();
        await jobActions.downloadJcl(undefined);
        expect(mocked(vscode.window.showErrorMessage)).toBeCalled();
    });
});

describe("Jobs Actions Unit Tests - Function submitJcl", () => {
    function createBlockMocks(globalMocks) {
        const datasetSessionNode = createDatasetSessionNode(globalMocks.sessionNoCreds, globalMocks.imperativeProfile);
        const textDocument = createTextDocument("HLQ.TEST.AFILE(mem)", datasetSessionNode);
        const profileInstance = createInstanceOfProfile(globalMocks.imperativeProfile, globalMocks.sessionNoCreds);
        const testDatasetTree = createDatasetTree(datasetSessionNode, globalMocks.treeView);

        return {
            datasetSessionNode,
            testDatasetTree,
            textDocument,
            profileInstance,
        };
    }

    it("Checking submit of active text editor content as JCL", async () => {
        const globalMocks = await createGlobalMocks();
        const blockMocks: any = createBlockMocks(globalMocks);
        mocked(zowe.ZosmfSession.createBasicZosmfSessionFromArguments).mockReturnValue(globalMocks.sessionNoCreds);
        mocked(Profiles.getInstance).mockReturnValue(blockMocks.profileInstance);
        mocked(vscode.window.showQuickPick).mockReturnValueOnce(new Promise((resolve) => {
            resolve(blockMocks.datasetSessionNode.label);
        }));
        blockMocks.testDatasetTree.getChildren.mockResolvedValueOnce([
            new ZoweDatasetNode("node", vscode.TreeItemCollapsibleState.None, blockMocks.datasetSessionNode, null),
            blockMocks.datasetSessionNode
        ]);
        activeTextEditorDocument.mockReturnValue(blockMocks.textDocument);
        const submitJclSpy = jest.spyOn(globalMocks.jesApi, "submitJcl");
        submitJclSpy.mockClear();
        submitJclSpy.mockResolvedValueOnce(globalMocks.iJob);
        await dsActions.submitJcl(blockMocks.testDatasetTree);

        expect(submitJclSpy).toBeCalled();
        expect(mocked(vscode.window.showInformationMessage)).toBeCalled();
        expect(mocked(vscode.window.showInformationMessage).mock.calls.length).toBe(1);
        expect(mocked(vscode.window.showInformationMessage).mock.calls[0][0]).toEqual("Job submitted [JOB1234](command:zowe.setJobSpool?%5B%22sestest%22%2C%22JOB1234%22%5D)");
    });

    it("Checking failed attempt to submit of active text editor content as JCL", async () => {
        const globalMocks = await createGlobalMocks();
        const blockMocks = createBlockMocks(globalMocks);
        mocked(zowe.ZosmfSession.createBasicZosmfSessionFromArguments).mockReturnValue(globalMocks.session);
        mocked(Profiles.getInstance).mockReturnValue(blockMocks.profileInstance);
        mocked(vscode.window.showQuickPick).mockResolvedValueOnce(null); // Here we imitate the case when no profile was selected
        blockMocks.testDatasetTree.getChildren.mockResolvedValueOnce([
            new ZoweDatasetNode("node", vscode.TreeItemCollapsibleState.None, blockMocks.datasetSessionNode, null),
            blockMocks.datasetSessionNode
        ]);
        activeTextEditorDocument.mockReturnValue(blockMocks.textDocument);
        const submitJclSpy = jest.spyOn(globalMocks.jesApi, "submitJcl");
        submitJclSpy.mockClear();
        submitJclSpy.mockResolvedValueOnce(globalMocks.iJob);

        await dsActions.submitJcl(blockMocks.testDatasetTree);

        expect(submitJclSpy).not.toBeCalled();
        expect(mocked(globals.LOG.error)).toBeCalled();
    });
});

describe("Jobs Actions Unit Tests - Function submitMember", () => {
    function createBlockMocks(globalMocks) {
        const datasetSessionNode = createDatasetSessionNode(globalMocks.sessionNoCreds, globalMocks.imperativeProfile);
        const profileInstance = createInstanceOfProfile(globalMocks.imperativeProfile, globalMocks.sessionNoCreds);

        return {
            datasetSessionNode,
            profileInstance,
        };
    }

    it("Checking Submit Job for PDS Member content", async () => {
        const globalMocks = await createGlobalMocks();
        const blockMocks = createBlockMocks(globalMocks);
        mocked(Profiles.getInstance).mockReturnValue(blockMocks.profileInstance);
        const subNode = new ZoweDatasetNode("dataset", vscode.TreeItemCollapsibleState.Collapsed,
            blockMocks.datasetSessionNode, null);
        subNode.contextValue = globals.DS_PDS_CONTEXT;
        const member = new ZoweDatasetNode("member", vscode.TreeItemCollapsibleState.None, subNode, null);
        member.contextValue = globals.DS_MEMBER_CONTEXT;
        const submitJobSpy = jest.spyOn(globalMocks.jesApi, "submitJob");
        submitJobSpy.mockResolvedValueOnce(globalMocks.iJob);

        await dsActions.submitMember(member);
        expect(submitJobSpy).toBeCalled();
        expect(submitJobSpy.mock.calls[0][0]).toEqual("dataset(member)");
        expect(mocked(vscode.window.showInformationMessage)).toBeCalled();
        expect(mocked(vscode.window.showInformationMessage).mock.calls[0][0]).toEqual(
            "Job submitted [JOB1234](command:zowe.setJobSpool?%5B%22sestest%22%2C%22JOB1234%22%5D)");
    });
    it("Checking Submit Job for PS Dataset content", async () => {
        const globalMocks = await createGlobalMocks();
        const blockMocks = createBlockMocks(globalMocks);
        mocked(Profiles.getInstance).mockReturnValue(blockMocks.profileInstance);
        const dataset = new ZoweDatasetNode("dataset", vscode.TreeItemCollapsibleState.Collapsed, blockMocks.datasetSessionNode, null);
        dataset.contextValue = globals.DS_DS_CONTEXT;
        const submitJobSpy = jest.spyOn(globalMocks.jesApi, "submitJob");
        submitJobSpy.mockClear();
        submitJobSpy.mockResolvedValueOnce(globalMocks.iJob);

        await dsActions.submitMember(dataset);
        expect(submitJobSpy).toBeCalled();
        expect(submitJobSpy.mock.calls[0][0]).toEqual("dataset");
        expect(mocked(vscode.window.showInformationMessage)).toBeCalled();
        expect(mocked(vscode.window.showInformationMessage).mock.calls[0][0]).toEqual(
            "Job submitted [JOB1234](command:zowe.setJobSpool?%5B%22sestest%22%2C%22JOB1234%22%5D)");
    });
    it("Checking Submit Job for Favourite PDS Member content", async () => {
        const globalMocks = await createGlobalMocks();
        const blockMocks = createBlockMocks(globalMocks);
        mocked(Profiles.getInstance).mockReturnValue(blockMocks.profileInstance);
        const favoriteSession = new ZoweDatasetNode("Favorites", vscode.TreeItemCollapsibleState.Collapsed,
            blockMocks.datasetSessionNode, null);
        favoriteSession.contextValue = globals.FAVORITE_CONTEXT;
        const favoriteSubNode = new ZoweDatasetNode("[test]: TEST.JCL", vscode.TreeItemCollapsibleState.Collapsed,
            favoriteSession, null);
        favoriteSubNode.contextValue = globals.DS_PDS_CONTEXT + globals.FAV_SUFFIX;
        const favoriteMember = new ZoweDatasetNode(globals.DS_PDS_CONTEXT, vscode.TreeItemCollapsibleState.Collapsed,
            favoriteSubNode, null);
        favoriteMember.contextValue = globals.DS_MEMBER_CONTEXT;
        const submitJobSpy = jest.spyOn(globalMocks.jesApi, "submitJob");
        submitJobSpy.mockClear();
        submitJobSpy.mockResolvedValueOnce(globalMocks.iJob);

        await dsActions.submitMember(favoriteMember);
        expect(submitJobSpy).toBeCalled();
        expect(submitJobSpy.mock.calls[0][0]).toEqual("TEST.JCL(pds)");
        expect(mocked(vscode.window.showInformationMessage)).toBeCalled();
        expect(mocked(vscode.window.showInformationMessage).mock.calls[0][0]).toEqual(
            "Job submitted [JOB1234](command:zowe.setJobSpool?%5B%22test%22%2C%22JOB1234%22%5D)");
    });
    it("Checking Submit Job for Favourite PS Dataset content", async () => {
        const globalMocks = await createGlobalMocks();
        const blockMocks = createBlockMocks(globalMocks);
        mocked(Profiles.getInstance).mockReturnValue(blockMocks.profileInstance);
        const favoriteSession = new ZoweDatasetNode("Favorites", vscode.TreeItemCollapsibleState.Collapsed,
            blockMocks.datasetSessionNode, null);
        favoriteSession.contextValue = globals.FAVORITE_CONTEXT;
        const favoriteDataset = new ZoweDatasetNode("[test]: TEST.JCL", vscode.TreeItemCollapsibleState.Collapsed,
            favoriteSession, null);
        favoriteDataset.contextValue = globals.DS_DS_CONTEXT + globals.FAV_SUFFIX;
        const submitJobSpy = jest.spyOn(globalMocks.jesApi, "submitJob");
        submitJobSpy.mockClear();
        submitJobSpy.mockResolvedValueOnce(globalMocks.iJob);

        await dsActions.submitMember(favoriteDataset);
        expect(submitJobSpy).toBeCalled();
        expect(submitJobSpy.mock.calls[0][0]).toEqual("TEST.JCL");
        expect(mocked(vscode.window.showInformationMessage)).toBeCalled();
        expect(mocked(vscode.window.showInformationMessage).mock.calls[0][0]).toEqual(
            "Job submitted [JOB1234](command:zowe.setJobSpool?%5B%22test%22%2C%22JOB1234%22%5D)");
    });
    it("Checking Submit Job for unsupported Dataset content", async () => {
        const globalMocks = await createGlobalMocks();
        const blockMocks = createBlockMocks(globalMocks);
        mocked(Profiles.getInstance).mockReturnValue(blockMocks.profileInstance);
        const corruptedNode = new ZoweDatasetNode("gibberish", vscode.TreeItemCollapsibleState.Collapsed,
            blockMocks.datasetSessionNode, null);
        corruptedNode.contextValue = "gibberish";
        const corruptedSubNode = new ZoweDatasetNode("gibberishmember", vscode.TreeItemCollapsibleState.Collapsed, corruptedNode, null);
        const submitJobSpy = jest.spyOn(globalMocks.jesApi, "submitJob");
        submitJobSpy.mockClear();
        submitJobSpy.mockResolvedValueOnce(globalMocks.iJob);

        try {
            await dsActions.submitMember(corruptedSubNode);
        } catch (e) {
            expect(e.message).toEqual("submitMember() called from invalid node.");
        }
        expect(submitJobSpy).not.toBeCalled();
        expect(mocked(vscode.window.showInformationMessage)).not.toBeCalled();
        expect(mocked(vscode.window.showErrorMessage)).toBeCalled();
        expect(mocked(vscode.window.showErrorMessage).mock.calls[0][0]).toEqual("submitMember() called from invalid node.");
    });
});

describe("Jobs Actions Unit Tests - Function getSpoolContent", () => {
    function createBlockMocks(globalMocks) {
        const iJobFile = createIJobFile();
        const datasetSessionNode = createDatasetSessionNode(globalMocks.sessionNoCreds, globalMocks.imperativeProfile);
        const profileInstance = createInstanceOfProfile(globalMocks.imperativeProfile, globalMocks.sessionNoCreds);

        return {
            iJobFile,
            datasetSessionNode,
            profileInstance,
        };
    }

    it("Checking opening of Spool Content", async () => {
        const globalMocks = await createGlobalMocks();
        const blockMocks = createBlockMocks(globalMocks);

        mocked(vscode.Uri.parse).mockReturnValueOnce("test" as any);
        mocked(Profiles.getInstance).mockReturnValue(blockMocks.profileInstance);
        await jobActions.getSpoolContent(globalMocks.testJobsTree, "sessionName", blockMocks.iJobFile);

        expect(mocked(vscode.workspace.openTextDocument)).toBeCalledWith("test");
        expect(mocked(vscode.window.showTextDocument)).toBeCalled();
    });
    it("Checking failed attempt to open Spool Content", async () => {
        const globalMocks = await createGlobalMocks();
        const blockMocks = createBlockMocks(globalMocks);

        mocked(vscode.Uri.parse).mockImplementationOnce(() => {
            throw new Error("Test");
        });
        mocked(Profiles.getInstance).mockReturnValue(blockMocks.profileInstance);
        await jobActions.getSpoolContent(globalMocks.testJobsTree, "sessionName", blockMocks.iJobFile);

        expect(mocked(vscode.workspace.openTextDocument)).not.toBeCalled();
        expect(mocked(vscode.window.showTextDocument)).not.toBeCalled();
    });
    it("Checking opening of Spool Content with credentials prompt", async () => {
        const globalMocks = await createGlobalMocks();
        const blockMocks = createBlockMocks(globalMocks);

        blockMocks.profileInstance.promptCredentials.mockReturnValue(["fake", "fake", "fake"]);
        mocked(vscode.Uri.parse).mockReturnValueOnce("test" as any);
        mocked(Profiles.getInstance).mockReturnValue(blockMocks.profileInstance);
        await jobActions.getSpoolContent(globalMocks.testJobsTree, "sessionName", blockMocks.iJobFile);

        expect(mocked(vscode.workspace.openTextDocument)).toBeCalledWith("test");
        expect(mocked(vscode.window.showTextDocument)).toBeCalled();
    });
    it("Checking failed attempt to open Spool Content with credentials prompt", async () => {
        const globalMocks = await createGlobalMocks();
        const blockMocks = createBlockMocks(globalMocks);

        blockMocks.profileInstance.promptCredentials.mockReturnValue(["fake", "fake", "fake"]);
        mocked(vscode.Uri.parse).mockImplementationOnce(() => {
            throw new Error("Test");
        });
        mocked(Profiles.getInstance).mockReturnValue(blockMocks.profileInstance);
        await jobActions.getSpoolContent(globalMocks.testJobsTree, "sessionName", blockMocks.iJobFile);

        expect(mocked(vscode.workspace.openTextDocument)).not.toBeCalled();
        expect(mocked(vscode.window.showTextDocument)).not.toBeCalled();
    });
});

describe("Jobs Actions Unit Tests - Function refreshJobsServer", () => {
    function createBlockMocks(globalMocks) {
        const iJobFile = createIJobFile();
        const datasetSessionNode = createDatasetSessionNode(globalMocks.sessionNoCreds, globalMocks.imperativeProfile);
        const profileInstance = createInstanceOfProfile(globalMocks.imperativeProfile, globalMocks.sessionNoCreds);

        return {
            iJobFile,
            datasetSessionNode,
            profileInstance,
        };
    }

    it("Checking common execution of function", async () => {
        const globalMocks = await createGlobalMocks();
        const blockMocks = createBlockMocks(globalMocks);

        mocked(Profiles.getInstance).mockReturnValue(blockMocks.profileInstance);
        const job = new Job("jobtest", vscode.TreeItemCollapsibleState.Expanded, null,
            globalMocks.sessionNoCreds, globalMocks.iJob, globalMocks.imperativeProfile);
        job.contextValue = globals.JOBS_SESSION_CONTEXT;
        mocked(zowe.ZosmfSession.createBasicZosmfSessionFromArguments).mockReturnValueOnce(globalMocks.sessionNoCreds);

        await jobActions.refreshJobsServer(job, globalMocks.testJobsTree);

        expect(globalMocks.testJobsTree.checkCurrentProfile).toHaveBeenCalledWith(job);
        expect(globalMocks.testJobsTree.refreshElement).toHaveBeenCalledWith(job);
    });
    it("Checking failed attempt to execute the function", async () => {
        const globalMocks = await createGlobalMocks();
        const blockMocks = createBlockMocks(globalMocks);

        mocked(Profiles.getInstance).mockReturnValue(blockMocks.profileInstance);
        const job = new Job("jobtest", vscode.TreeItemCollapsibleState.Expanded, null,
            globalMocks.sessionNoCreds, globalMocks.iJob, globalMocks.imperativeProfile);
        job.contextValue = globals.JOBS_SESSION_CONTEXT;
        mocked(zowe.ZosmfSession.createBasicZosmfSessionFromArguments).mockReturnValueOnce(globalMocks.sessionNoCreds);
        globalMocks.testJobsTree.checkCurrentProfile.mockImplementationOnce(() => {
            throw Error("test");
        });

        try {
            await jobActions.refreshJobsServer(job, globalMocks.testJobsTree);
        } catch (err) {
            expect(err).toEqual(Error("test"));
        }

        expect(globalMocks.testJobsTree.refreshElement).not.toHaveBeenCalled();
    });
    it("Checking execution of function with credential prompt", async () => {
        const globalMocks = await createGlobalMocks();
        const blockMocks = createBlockMocks(globalMocks);

        blockMocks.profileInstance.promptCredentials.mockReturnValue(["fake", "fake", "fake"]);
        mocked(Profiles.getInstance).mockReturnValue(blockMocks.profileInstance);
        const job = new Job("jobtest", vscode.TreeItemCollapsibleState.Expanded, null,
            globalMocks.sessionNoCreds, globalMocks.iJob, globalMocks.imperativeProfile);
        job.contextValue = globals.JOBS_SESSION_CONTEXT;
        mocked(zowe.ZosmfSession.createBasicZosmfSessionFromArguments).mockReturnValueOnce(globalMocks.sessionNoCreds);

        await jobActions.refreshJobsServer(job, globalMocks.testJobsTree);

        expect(globalMocks.testJobsTree.checkCurrentProfile).toHaveBeenCalledWith(job);
        expect(globalMocks.testJobsTree.refreshElement).toHaveBeenCalledWith(job);
    });
    it("Checking execution of function with credential prompt for favorite", async () => {
        const globalMocks = await createGlobalMocks();
        const blockMocks = createBlockMocks(globalMocks);

        blockMocks.profileInstance.promptCredentials.mockReturnValue(["fake", "fake", "fake"]);
        mocked(Profiles.getInstance).mockReturnValue(blockMocks.profileInstance);
        const job = new Job("jobtest", vscode.TreeItemCollapsibleState.Expanded, null,
            globalMocks.sessionNoCreds, globalMocks.iJob, globalMocks.imperativeProfile);
        job.contextValue = globals.JOBS_SESSION_CONTEXT + globals.FAV_SUFFIX;
        mocked(zowe.ZosmfSession.createBasicZosmfSessionFromArguments).mockReturnValueOnce(globalMocks.sessionNoCreds);

        await jobActions.refreshJobsServer(job, globalMocks.testJobsTree);

        expect(globalMocks.testJobsTree.checkCurrentProfile).toHaveBeenCalledWith(job);
        expect(globalMocks.testJobsTree.refreshElement).toHaveBeenCalledWith(job);
    });
});

describe("refreshAll", () => {
    function createBlockMocks(globalMocks) {
        const newMocks = {
            profileInstance: null,
            jobsTree: null,
        };
        newMocks.profileInstance = createInstanceOfProfile(globalMocks.imperativeProfile, globalMocks.sessionNoCreds);
        newMocks.jobsTree = createJobsTree(globalMocks.sessionNoCreds, globalMocks.iJob, newMocks.profileInstance, globalMocks.treeView);

        return newMocks;
    }

    it("Testing that refreshAllJobs is executed successfully", async () => {
        const globalMocks = await createGlobalMocks();
        const blockMocks = createBlockMocks(globalMocks);

        mocked(Profiles.getInstance).mockReturnValue(blockMocks.profileInstance);
        const submitJclSpy = jest.spyOn(jobActions, "refreshAllJobs");
        jobActions.refreshAllJobs(blockMocks.jobsTree);
        expect(submitJclSpy).toHaveBeenCalledTimes(1);
    });
});
