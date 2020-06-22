/*
 * Copyright (c) 2015-present, salesforce.com, inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided
 * that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of conditions and the
 * following disclaimer.
 *
 * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and
 * the following disclaimer in the documentation and/or other materials provided with the distribution.
 *
 * Neither the name of salesforce.com, inc. nor the names of its contributors may be used to endorse or
 * promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
 * PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 * TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

import { NativeModules } from "react-native";
const { SalesforceNetReactBridge, SFNetReactBridge } = NativeModules;
import { exec as forceExec } from "./react.force.common";
import { HttpMethod } from "./typings";
import { sdkConsole } from "./react.force.log";

let apiVersion = "v46.0";

/**
 * Set apiVersion to be used
 */
export const setApiVersion = (version: string): void => {
  apiVersion = version;
};

/**
 * Return apiVersion used
 */
export const getApiVersion = (): string => apiVersion;

/**
 * Send arbitray force.com request
 */
export const sendRequest = (
  endPoint: string,
  path: string,
  successCB: (result: any) => void,
  errorCB: (err: Error) => void,
  method?: HttpMethod,
  payload?: Record<string, unknown> | null,
  headerParams?: Record<string, unknown> | null,
  fileParams?,
  returnBinary?: boolean,
  doesNotRequireAuthentication?: boolean
): void => {
  method = method || "GET";
  payload = payload || {};
  headerParams = headerParams || {};
  fileParams = fileParams || {}; // File params expected to be of the form: {<fileParamNameInPost>: {fileMimeType:<someMimeType>, fileUrl:<fileUrl>, fileName:<fileNameForPost>}}
  returnBinary = !!returnBinary;
  doesNotRequireAuthentication = !!doesNotRequireAuthentication;
  const args = {
    endPoint,
    path,
    method,
    queryParams: payload,
    headerParams,
    fileParams,
    returnBinary,
    doesNotRequireAuthentication,
  };
  forceExec(
    "SFNetReactBridge",
    "SalesforceNetReactBridge",
    SFNetReactBridge,
    SalesforceNetReactBridge,
    successCB,
    errorCB,
    "sendRequest",
    args
  );
};

/*
 * Lists summary information about each Salesforce.com version currently
 * available, including the version, label, and a link to each version's
 * root.
 * @param callback function to which response will be passed
 * @param [error=null] function called in case of error
 */
export const versions = (
  successCB: (result: any) => void,
  errorCB: (err: Error) => void
): void => sendRequest("/services/data", "/", successCB, errorCB);

/*
 * Lists available resources for the client's API version, including
 * resource name and URI.
 * @param callback function to which response will be passed
 * @param [error=null] function called in case of error
 */
export const resources = (
  successCB: (result: any) => void,
  errorCB: (err: Error) => void
): void => sendRequest("/services/data", `/${apiVersion}/`, successCB, errorCB);

/*
 * Lists the available objects and their metadata for your organization's
 * data.
 * @param callback function to which response will be passed
 * @param [error=null] function called in case of error
 */
export const describeGlobal = (
  successCB: (result: any) => void,
  errorCB: (err: Error) => void
): void =>
  sendRequest("/services/data", `/${apiVersion}/sobjects/`, successCB, errorCB);

/*
 * Describes the individual metadata for the specified object.
 * @param objtype object type; e.g. "Account"
 * @param callback function to which response will be passed
 * @param [error=null] function called in case of error
 */
export const metadata = (
  objtype: string,
  successCB: (result: any) => void,
  errorCB: (err: Error) => void
): void =>
  sendRequest(
    "/services/data",
    `/${apiVersion}/sobjects/${objtype}/`,
    successCB,
    errorCB
  );

/*
 * Completely describes the individual metadata at all levels for the
 * specified object.
 * @param objtype object type; e.g. "Account"
 * @param callback function to which response will be passed
 * @param [error=null] function called in case of error
 */
export const describe = (
  objtype: string,
  successCB: (result: any) => void,
  errorCB: (err: Error) => void
): void =>
  sendRequest(
    "/services/data",
    `/${apiVersion}/sobjects/${objtype}/describe/`,
    successCB,
    errorCB
  );

/*
 * Fetches the layout configuration for a particular sobject type and record type id.
 * @param objtype object type; e.g. "Account"
 * @param (Optional) recordTypeId Id of the layout's associated record type
 * @param callback function to which response will be passed
 * @param [error=null] function called in case of error
 */
export const describeLayout = (
  objtype: string,
  recordTypeId: string,
  successCB: (result: any) => void,
  errorCB: (err: Error) => void
): void => {
  recordTypeId = recordTypeId ? recordTypeId : "";
  return sendRequest(
    "/services/data",
    `/${apiVersion}/sobjects/${objtype}/describe/layouts/${recordTypeId}`,
    successCB,
    errorCB
  );
};

/*
 * Creates a new record of the given type.
 * @param objtype object type; e.g. "Account"
 * @param fields an object containing initial field names and values for
 *               the record, e.g. {:Name "salesforce.com", :TickerSymbol
 *               "CRM"}
 * @param callback function to which response will be passed
 * @param [error=null] function called in case of error
 */
export const create = (
  objtype: string,
  fields: Record<string, unknown>,
  successCB: (result: any) => void,
  errorCB: (err: Error) => void
): void =>
  sendRequest(
    "/services/data",
    `/${apiVersion}/sobjects/${objtype}/`,
    successCB,
    errorCB,
    "POST",
    fields
  );

/*
 * Retrieves field values for a record of the given type.
 * @param objtype object type; e.g. "Account"
 * @param id the record's object ID
 * @param [fields=null] optional comma-separated list of fields for which
 *               to return values; e.g. Name,Industry,TickerSymbol
 * @param callback function to which response will be passed
 * @param [error=null] function called in case of error
 */
export const retrieve = (
  objtype: string,
  id: string,
  fieldlist: Record<string, unknown>,
  successCB: (result: any) => void,
  errorCB: (err: Error) => void
): void => {
  if (arguments.length == 4) {
    error = callback;
    callback = fieldlist;
    fieldlist = null;
  }
  const fields = fieldlist ? { fields: fieldlist } : null;
  return sendRequest(
    "/services/data",
    `/${apiVersion}/sobjects/${objtype}/${id}`,
    successCB,
    errorCB,
    "GET",
    fields
  );
};

/*
 * Upsert - creates or updates record of the given type, based on the
 * given external Id.
 * @param objtype object type; e.g. "Account"
 * @param externalIdField external ID field name; e.g. "accountMaster__c"
 * @param externalId the record's external ID value
 * @param fields an object containing field names and values for
 *               the record, e.g. {:Name "salesforce.com", :TickerSymbol
 *               "CRM"}
 * @param callback function to which response will be passed
 * @param [error=null] function called in case of error
 */
export const upsert = (
  objtype: string,
  externalIdField: string,
  externalId: string,
  fields: Record<string, unknown>,
  successCB: (result: any) => void,
  errorCB: (err: Error) => void
): void =>
  sendRequest(
    "/services/data",
    `/${apiVersion}/sobjects/${objtype}/${externalIdField}/${
      externalId ? externalId : ""
    }`,
    successCB,
    errorCB,
    externalId ? "PATCH" : "POST",
    fields
  );

/*
 * Updates field values on a record of the given type.
 * @param objtype object type; e.g. "Account"
 * @param id the record's object ID
 * @param fields an object containing initial field names and values for
 *               the record, e.g. {:Name "salesforce.com", :TickerSymbol
 *               "CRM"}
 * @param callback function to which response will be passed
 * @param [error=null] function called in case of error
 */
export const update = (
  objtype: string,
  id: string,
  fields: Record<string, unknown>,
  successCB: (result: any) => void,
  errorCB: (err: Error) => void
): void =>
  sendRequest(
    "/services/data",
    `/${apiVersion}/sobjects/${objtype}/${id}`,
    successCB,
    errorCB,
    "PATCH",
    fields
  );

/*
 * Deletes a record of the given type. Unfortunately, 'delete' is a
 * reserved word in JavaScript.
 * @param objtype object type; e.g. "Account"
 * @param id the record's object ID
 * @param callback function to which response will be passed
 * @param [error=null] function called in case of error
 */
export const del = (
  objtype: string,
  id: string,
  successCB: (result: any) => void,
  errorCB: (err: Error) => void
): void =>
  sendRequest(
    "/services/data",
    `/${apiVersion}/sobjects/${objtype}/${id}`,
    successCB,
    errorCB,
    "DELETE"
  );

/*
 * Executes the specified SOQL query.
 * @param soql a string containing the query to execute - e.g. "SELECT Id,
 *             Name from Account ORDER BY Name LIMIT 20"
 * @param callback function to which response will be passed
 * @param [error=null] function called in case of error
 */
export const query = (
  soql: string,
  successCB: (result: any) => void,
  errorCB: (err: Error) => void
): void =>
  sendRequest(
    "/services/data",
    `/${apiVersion}/query`,
    successCB,
    errorCB,
    "GET",
    { q: soql }
  );

/*
 * Queries the next set of records based on pagination.
 * <p>This should be used if performing a query that retrieves more than can be returned
 * in accordance with http://www.salesforce.com/us/developer/docs/api_rest/Content/dome_query.htm</p>

 * @param url - the url retrieved from nextRecordsUrl or prevRecordsUrl
 * @param callback function to which response will be passed
 * @param [error=null] function called in case of error
 */
export const queryMore = (
  url: string,
  successCB: (result: any) => void,
  errorCB: (err: Error) => void
): void => {
  const pathFromUrl = url.match(/https:\/\/[^/]*(.*)/);
  if (pathFromUrl && pathFromUrl.length === 2) {
    return sendRequest("", pathFromUrl[1], successCB, errorCB);
  } else {
    sdkConsole.error(`queryMore failed: url must be a valid`);
  }
};

/*
 * Executes the specified SOSL search.
 * @param sosl a string containing the search to execute - e.g. "FIND
 *             {needle}"
 * @param callback function to which response will be passed
 * @param [error=null] function called in case of error
 */
export const search = (
  sosl: string,
  successCB: (result: any) => void,
  errorCB: (err: Error) => void
): void =>
  sendRequest(
    "/services/data",
    `/${apiVersion}/search`,
    successCB,
    errorCB,
    "GET",
    { q: sosl }
  );

/**
 * Convenience function to retrieve an attachment
 * @param id
 * @param callback function to which response will be passed (attachment is returned as {encodedBody:"base64-encoded-response", contentType:"content-type"})
 * @param [error=null] function called in case of error
 */
export const getAttachment = (
  id: string,
  successCB: (result: any) => void,
  errorCB: (err: Error) => void
): void =>
  sendRequest(
    "/services/data",
    `/${apiVersion}/sobjects/Attachment/${id}/Body`,
    successCB,
    errorCB,
    "GET",
    null,
    null,
    null,
    true /* return binary */
  );