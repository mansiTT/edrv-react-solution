import http from "../common/http-common";



const generateAccessToken = () => {

    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', 'aYnsAI7U1UKKHEI3ckY6HSLZtqPCgT6l');
    params.append('client_secret', '7zk1irjdzSL0HBZoiiIvAxiubsLO-2cm0f5ISlN2EcLe1oEIB2U6iyAQwAYGPT5r');
    params.append('audience', 'https://api.edrv.ioa');
    return http.post("/oauth/token", params)
}


const remoteStart = (data) => {
    return http.post("/v1/commands/remotestart", data);
};

const remoteStop = (data) => {
    return http.post("/v1/commands/remotestop", data);
};

const getConnectorStatus = (connectorId) => {
  return http.get(`/v1/connectors/${connectorId}`);
};

const getToken = (id, data) => {
  return http.put(`/tutorials/${id}`, data);
};

const getMeterReading = (transationId) => {
  console.log(transationId)
  return http.get(`/v1/transactions/${transationId}?include_evse=true&include_rate=true&include_reservation=true`);
};

const getTransationCost = (transationId) => {
  return http.get(`/v1/transactions/${transationId}/cost`);
};

const EdrvDataService = {
    remoteStart,
    remoteStop,
    getConnectorStatus,
    getToken,
    getMeterReading,
    generateAccessToken,
    getTransationCost
};

export default EdrvDataService