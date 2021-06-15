# Zowe Explorer Conformance Test Evaluation Guide

The Zowe Conformance Test Evaluation Guide is a set of self-certifying and self-service tests to help the development community integrate and extend specific technology into the Zowe framework.

This guide describes the requirements of the three available conformance programs. Items marked **(required)** are required for an application to be conformant. Items marked **(best practice)** are considered best practices for conformant applications.

These Zowe Conformance criteria are applicable to the lastest Zowe v1 LTS Release.

- [Zowe Explorer Conformance Test Evaluation Guide](#zowe-explorer-conformance-test-evaluation-guide)
  - [Zowe Explorer - Zowe v1](#zowe-explorer---zowe-v1)
    - [General Extension](#general-extension)
    - [Extension Accessing Profiles](#extension-accessing-profiles)
    - [Data Provider Extension](#data-provider-extension)
    - [Extension Adding Menus](#extension-adding-menus)

## Zowe Explorer - Zowe v1

### General Extension

<table rules="all">
 <thead>
 <th style=background-color:#5555AA>Item </th>
 <th style=background-color:#5555AA>Ver </th>
 <th style=background-color:#5555AA>Required </th>
 <th style=background-color:#5555AA>Best Practice </th>
 <th style=background-color:#5555AA>Conformant </th>
 <th style=background-color:#5555AA>Criteria </th>
 </thead>

 <tr>
   <th style="background-color:#555555">1</th>
   <th style="background-color:#555555">v1</th>
   <th style="background-color:#AAAAAA">x</th>
   <th style="background-color:#AAAAAA"></th>
   <th></th>
   <td><b>Naming:</b> If the extension uses the word "Zowe" in its name, it abides by Linux Foundation's Trademark Usage rules to ensure the word Zowe is used in a way intended by the Zowe community.</td>
 </tr>

 <tr>
   <th style="background-color:#555555">2</th>
   <th style="background-color:#555555">v1</th>
   <th style="background-color:#AAAAAA"></th>
   <th style="background-color:#AAAAAA">x</th>
   <th></th>
   <td><b>User settings consistency:</b> For a consistent user experience we recommend that user settings and configuration settings follow the naming conventions as documented in the Zowe Explorer extensibility documentation.</td>
 </tr>

 <tr>
   <th style="background-color:#555555">3</th>
   <th style="background-color:#555555">v1</th>
   <th style="background-color:#AAAAAA">x</th>
   <th style="background-color:#AAAAAA"></th>
   <th></th>
   <td><b>Publication tag:</b> If the extension is published in a public catalog or marketplace such as Npmjs, Open-VSX, or VS Code Marketplace, it uses the tag or keyword "Zowe" so it can be found when searching for Zowe and be listed with other Zowe offerings.</td>
 </tr>

 <tr>
   <th style="background-color:#555555">4</th>
   <th style="background-color:#555555">v1</th>
   <th style="background-color:#AAAAAA">x</th>
   <th style="background-color:#AAAAAA"></th>
   <th></th>
   <td><b>Support:</b> Extension has a clear documentation and clear instructions on how to report problems that are related to the extension.</td>
 </tr>

 <tr>
   <th style="background-color:#555555">5</th>
   <th style="background-color:#555555">v1</th>
   <th style="background-color:#AAAAAA"></th>
   <th style="background-color:#AAAAAA">x</th>
   <th></th>
   <td><b>User settings consistency:</b> Extension provides a consistent user experience and follows the recommended naming convention for the user settings and configuration settings indicated in the Zowe Explorer extensibility documentation.</td>
 </tr>

 <tr>
   <th style="background-color:#555555">6</th>
   <th style="background-color:#555555">v1</th>
   <th style="background-color:#AAAAAA"></th>
   <th style="background-color:#AAAAAA">x</th>
   <th></th>
   <td><b>Error message consistency:</b> Extension follows the recommended error message format indicated in the Zowe Explorer extensibility documentation.</td>
 </tr>

 <tr>
   <th style="background-color:#555555">7</th>
   <th style="background-color:#555555">v1</th>
   <th style="background-color:#AAAAAA"></th>
   <th style="background-color:#AAAAAA">x</th>
   <th></th>
   <td><b>Zowe SDK usage:</b> Extension utilizes the available Zowe SDKs and it standardizes the z/OS interaction as well as other common capabilities that are used by many other Zowe extensions and tools.</td>
 </tr>

 <tr>
   <th style="background-color:#555555">8</th>
   <th style="background-color:#555555">v1</th>
   <th style="background-color:#AAAAAA">x</th>
   <th style="background-color:#AAAAAA"></th>
   <th></th>
   <td><b>Sharing of profiles with Zowe CLI:</b> Extensions shares the created profiles between Zowe CLI and VSCode.</td>
 </tr>
 <tr>
   <th style="background-color:#555555" rowspan=5>9</th>
   <th style="background-color:#555555"></th>
   <th style="background-color:#AAAAAA" colspan=2>Mark (a) or (b) or (c)</th>
   <th style="background-color:#AAAAAA"></th>
   <td style="text-align:center">Extension uses the extensibility APIs provided by Zowe Explorer. Supported methods include:<p style="color:red">(Please select all that apply _a_, _b_, or _c_)</td>
 </tr>
 <tr>
   <th style="background-color:#555555"></th>
   <th style="background-color:#AAAAAA"></th>
   <th style="background-color:#AAAAAA" ></th>
   <th></th>
  <td>a. Extension Accessing Profiles</td>
 </tr>
 <tr>
   <th style="background-color:#555555"></th>
   <th style="background-color:#AAAAAA"></th>
   <th style="background-color:#AAAAAA" ></th>
   <th></th>
  <td>b. Data Provider Extension</td>
 </tr>
 <tr>
   <th style="background-color:#555555"></th>
   <th style="background-color:#AAAAAA"></th>
   <th style="background-color:#AAAAAA" ></th>
   <th></th>
  <td>c. Extension Adding Menus</td>
 </tr>
</table>

### Extension Accessing Profiles

<table rules="all">
 <thead>
 <th style=background-color:#5555AA>Item </th>
 <th style=background-color:#5555AA>Ver </th>
 <th style=background-color:#5555AA>Required </th>
 <th style=background-color:#5555AA>Best Practice </th>
 <th style=background-color:#5555AA>Conformant </th>
 <th style=background-color:#5555AA>Criteria </th>
 </thead>

 <tr>
   <th style="background-color:#555555">10</th>
   <th style="background-color:#555555">v1</th>
   <th style="background-color:#AAAAAA">x</th>
   <th style="background-color:#AAAAAA"></th>
   <th></th>
   <td><b>VS Code extension dependency:</b> Extension defines Zowe Explorer as a VSCode extension dependency (Code Example). It includes an extensionDependencies entry for Zowe Explorer in its package.json file.</td>
 </tr>

  <tr>
   <th style="background-color:#555555">11</th>
   <th style="background-color:#555555">v1</th>
   <th style="background-color:#AAAAAA">x</th>
   <th style="background-color:#AAAAAA"></th>
   <th></th>
   <td><b>Zowe Extender access:</b> Extension accesses the shared Zowe Explorer profiles cache via ZoweExplorerApi.IApiRegisterClient.getExplorerExtenderApi() API as documented in the Zowe Explorer extensibility documentation.</td>
 </tr>

  <tr>
   <th style="background-color:#555555">12</th>
   <th style="background-color:#555555">v1</th>
   <th style="background-color:#AAAAAA">x</th>
   <th style="background-color:#AAAAAA"></th>
   <th></th>
   <td><b>Added Profile Type initialization: </b> If the extension has a dependecny on a new Zowe CLI profile type other than the Zowe Explorer default `zosmf`, it is calling the `ZoweExplorerApi.IApiRegisterClient.getExplorerExtenderApi().initialize(profileTypeName)` to ensure that the profile type is supported and managed by the extension without a Zowe CLI plugin installed.</td>
 </tr>
</table>

### Data Provider Extension

<table rules="all">
 <thead>
 <th style=background-color:#5555AA>Item </th>
 <th style=background-color:#5555AA>Ver </th>
 <th style=background-color:#5555AA>Required </th>
 <th style=background-color:#5555AA>Best Practice </th>
 <th style=background-color:#5555AA>Conformant </th>
 <th style=background-color:#5555AA>Criteria </th>
 </thead>

 <tr>
   <th style="background-color:#555555">13</th>
   <th style="background-color:#555555">v1</th>
   <th style="background-color:#AAAAAA">x</th>
   <th style="background-color:#AAAAAA"></th>
   <th></th>
   <td><b>New Zowe CLI profile type: </b> The extension registers its new API via the ZoweExplorerApi.IApiRegisterClient.registerMvsApi() call as indicated from the Zowe Explorer extensibility documentation</td>
 </tr>

 <tr>
   <th style="background-color:#555555">14</th>
   <th style="background-color:#555555">v1</th>
   <th style="background-color:#AAAAAA">x</th>
   <th style="background-color:#AAAAAA"></th>
   <th></th>
   <td><b>Matching Zowe CLI Plugin: </b> Provide a Zowe CLI Plugin for the data provider's profile type that implements the core capabilities required for the new protocol that users can then also use to interact with the protocol outside of the Zowe Explorer extension using Zowe CLI commands.</td>
 </tr>

 <tr>
   <th style="background-color:#555555">15</th>
   <th style="background-color:#555555">v1</th>
   <th style="background-color:#AAAAAA">x</th>
   <th style="background-color:#AAAAAA"></th>
   <th></th>
   <td><b>Data provider API implementation:  </b> Extension fully implements and registers to at least one of the three Zowe Explorer interfaces or alternatively throws exceptions that provide meaningful error messages to the end-user in the 'Error.message' property that will be displayed in a dialog.</td>
 </tr>

 <tr>
   <th style="background-color:#555555">16</th>
   <th style="background-color:#555555">v1</th>
   <th style="background-color:#AAAAAA"></th>
   <th style="background-color:#AAAAAA">x</th>
   <th></th>
   <td><b>API test suite implementation:   </b>  If the extension implements a Zowe Explorer API data provider interface, it should implement a test suite that calls each of the implemented API methods.</td>
 </tr>

 <tr>

   <th style="background-color:#555555">17</th>
   <th style="background-color:#555555">v1</th>
   <th style="background-color:#AAAAAA"></th>
   <th style="background-color:#AAAAAA">x</th>
   <th></th>
   <td><b>Base Profile and Tokens:   </b>  Extension supports base profiles and tokens (For more information, click here)</td>
 </tr>

 <tr>

   <th style="background-color:#555555">18</th>
   <th style="background-color:#555555">v1</th>
   <th style="background-color:#AAAAAA"></th>
   <th style="background-color:#AAAAAA">x</th>
   <th></th>
   <td><b>Team Configuration File:   </b> Extension supports JSON configuration file</td>
 </tr>

 <tr>

   <th style="background-color:#555555">19</th>
   <th style="background-color:#555555">v1</th>
   <th style="background-color:#AAAAAA"></th>
   <th style="background-color:#AAAAAA">x</th>
   <th></th>
   <td><b>Secure Credential Store:   </b> If the extension supports Zowe's Secure Credential store, it calls the Zowe Explorer-provided method</td>
 </tr>
</table>

### Extension Adding Menus

<table rules="all">
 <thead>
 <th style=background-color:#5555AA>Item </th>
 <th style=background-color:#5555AA>Ver </th>
 <th style=background-color:#5555AA>Required </th>
 <th style=background-color:#5555AA>Best Practice </th>
 <th style=background-color:#5555AA>Conformant </th>
 <th style=background-color:#5555AA>Criteria </th>
 </thead>

 <tr>
   <th style="background-color:#555555">20</th>
   <th style="background-color:#555555">v1</th>
   <th style="background-color:#AAAAAA">x</th>
   <th style="background-color:#AAAAAA"></th>
   <th></th>
   <td><b>Menu Names: </b> If the extension is adding new commands and context menu entries to the Zowe Explorer tree view nodes, it adheres to the Zowe Explorer-provided contextual string format.</td>
 </tr>
</table>
